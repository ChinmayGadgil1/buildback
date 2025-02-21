const express = require('express');
const mongoose = require('mongoose');
const next = require('next');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Import API routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.prepare().then(() => {
  const server = express();
  
  // Parse JSON request body
  server.use(express.json());
  
  // Session setup with MongoDB store
  server.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      },
    })
  );
  
  // API routes
  server.use('/api/auth', authRoutes);
  server.use('/api/projects', projectRoutes);
  
  // Let Next.js handle all other routes
  server.all('*', (req, res) => {
    return handle(req, res);
  });
  
  server.listen(3000, err => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});