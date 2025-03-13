import { Server as SocketIOServer } from 'socket.io';

let ioConnection = null;

export const initializeSocket = (server) => {
  ioConnection = new SocketIOServer(server, {
    cors: {
      origin: '*',
      credentials: true,
    },
  });

  ioConnection.on('connection', (socket) => {
    console.log(`A user connected with Socket ID: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`User with Socket ID: ${socket.id} disconnected`);
    });
  });
};

export const emitEventToClient = (event, data) => {
  if (ioConnection) {
    ioConnection.emit(event, data);
    console.log(`${event}: IO Data Emitted -`, data);
  } else {
    console.log('Socket.IO is not initialized');
  }
};
