const jsonServer = require('json-server');
const cors = require('cors');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const fs = require('fs');
const path = require('path');

// Set CORS options
const corsOptions = {
  origin: 'http://localhost:5173', // Update with your frontend's origin if necessary
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow Authorization header
};

// Apply CORS middleware with the defined options
server.use(cors(corsOptions));

// Handle preflight OPTIONS requests
server.options('*', cors(corsOptions));

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// To handle POST, PUT and PATCH you need to use a body-parser
server.use(jsonServer.bodyParser);

// Custom route for password reset
server.post('/reset-password', (req, res) => {
  const { email } = req.body;
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json')));
  const user = db.users.find(user => user.email === email);

  if (user) {
    // Simulate token generation
    const resetToken = "someGeneratedToken"; // Replace with actual token generation logic
    const resetTokenExpiration = Date.now() + 3600000; // Token valid for 1 hour

    // Update user with resetToken and expiration
    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration;

    // Write back to db.json
    fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(db));

    res.status(200).json({ message: 'Password reset link has been sent.' });
  } else {
    res.status(200).json({ message: 'Password reset link has been sent.' });
  }
});

// Use default router
server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running on http://localhost:3000');
});
