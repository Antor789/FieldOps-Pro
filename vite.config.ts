import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {Server as SocketIOServer} from 'socket.io';

function socketIOPlugin() {
  return {
    name: 'socket-io-dev-server',
    configureServer(server: any) {
      if (!server.httpServer) return;
      const io = new SocketIOServer(server.httpServer, {
        cors: {
          origin: '*',
          methods: ['GET', 'POST'],
        },
      });

      io.on('connection', (socket) => {
        // Broadcast any event incoming from a client to all connected clients
        const eventNames = [
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

        eventNames.forEach((evt) => {
          socket.on(evt, (data) => {
            socket.broadcast.emit(evt, data);
          });
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), socketIOPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
