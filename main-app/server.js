const express = require('express');
const mongoose = require('mongoose');
const next = require('next');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');

const dev = false;
const app = next({ dev });
const handle = app.getRequestHandler();

// Import API routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');

// MongoDB connection
mongoose
  .connect('mongodb+srv://3011adinaik:toqkiG-rexji7-kexbis@item-store.2gzwbsj.mongodb.net/blog-website?retryWrites=true&w=majority&appName=blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.prepare().then(() => {
  const server = express();
  console.log(dev);

  server.use(cors({
    origin: [
      'https://buildback-sb4w.onrender.com',
      'http://localhost:3000',
    ],
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  
  server.use(express.json());
  
 
  server.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ 
        mongoUrl: 'mongodb+srv://3011adinaik:toqkiG-rexji7-kexbis@item-store.2gzwbsj.mongodb.net/blog-website?retryWrites=true&w=majority&appName=blog' 
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, 
        httpOnly: true,
        secure: !dev, 
        sameSite: 'lax',
        domain: dev ? undefined : 'buildback-sb4w.onrender.com' 
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
