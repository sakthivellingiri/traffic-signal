import express from 'express';
import cors from 'cors';
import http from 'http';
import 'dotenv/config';

import { connectDB } from './src/config/db.js';
import signalRouter from './src/routes/signal.routes.js';
import './src/config/mqtt.js';
import { initializeSocket } from './src/config/socket.js';

const app = express();
const port = process.env.PORT || 4000

// Wrap express app with HTTP server
const server = http.createServer(app);

// database connection
connectDB();

// Initialize Socket.IO service with the HTTP server
initializeSocket(server);

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];


app.use(express.json());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Routes
app.get('/', (req, res) => res.send('API Is Working!'));
app.use('/api/signal', signalRouter);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
