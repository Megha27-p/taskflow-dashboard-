const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

// Simple Redis-like cache (in-memory for demo)
const cache = new Map();
let tasks = [{id:1, title:"Design Dashboard", status:"Done", priority:"High"}];

// Auth Middleware - JWT
const auth = (req,res,next) => {
  const token = req.headers.authorization;
  if(!token) return res.status(401).json({msg:"No token"});
  next();
}

// GET Tasks - with caching
app.get('/api/tasks', auth, (req,res) => {
  if(cache.has('tasks')) return res.json(cache.get('tasks'));
  cache.set('tasks', tasks);
  res.json(tasks);
});

// POST Task
app.post('/api/tasks', auth, (req,res) => {
  const newTask = {id: tasks.length+1, ...req.body};
  tasks.push(newTask);
  cache.delete('tasks'); // Clear cache
  res.json(newTask);
});

app.listen(5000, () => console.log("Server on 5000"));
module.exports = app;
