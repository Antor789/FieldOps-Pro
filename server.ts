import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);
  const PORT = Number(process.env.PORT) || 3000;

  // Real-time Socket.io Server Setup
  const io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('[Socket.io] Real-time client connected:', socket.id);

    // Relay standard real-time events to all connected clients
    const realtimeEvents = [
      'work_order:created',
      'work_order:assigned',
      'work_order:status_changed',
      'work_order:completed',
      'technician:location',
      'technician:online',
      'technician:offline',
      'payment:received',
      'notification:new',
      'chat:message',
      'system:alert',
    ];

    realtimeEvents.forEach((eventName) => {
      socket.on(eventName, (payload) => {
        socket.broadcast.emit(eventName, payload);
      });
    });

    socket.on('disconnect', () => {
      console.log('[Socket.io] Client disconnected:', socket.id);
    });
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'FieldOps Pro WebSocket Server',
      clientsConnected: io.engine.clientsCount,
      timestamp: new Date().toISOString(),
    });
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    // In dev mode, mount Vite dev middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[FieldOps Pro] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[FieldOps Pro] Error starting server:', err);
});
