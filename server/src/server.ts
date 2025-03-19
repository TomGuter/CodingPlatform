import express, { Express } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import codeblocks_route from './routes/codeblocks_route';

dotenv.config();

const initializeServer = async (): Promise<{ app: Express; io: Server; server: ReturnType<typeof createServer> }> => {
  try {
    if (!process.env.DB_CONNECT) {
      throw new Error('MONGO_URI is not set in environment variables');
    }

    const app = express();
    const server = createServer(app);
    const io = new Server(server, {
      cors: {
        origin: `${process.env.FRONTEND_URL}`,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization']
      }
    });

    app.use(
      cors({
        origin: `${process.env.FRONTEND_URL}`,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
      })
    );
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));


    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.DB_CONNECT);
    console.log("Connected to MongoDB");

  
    app.use('/codeBlocks', codeblocks_route);

    const rooms = new Map(); 

    io.on('connection', (socket: Socket) => {
      
      console.log('a user connected');

      socket.on('joinChatRoom', (roomId) => {
        socket.join(roomId);
      });
    
      socket.on('sendMessage', ({ room, message }) => {
        io.to(room).emit('newMessage', message);
      });
    
      socket.on('leaveChatRoom', (roomId) => {
        socket.leave(roomId);
      });
    
      socket.on('joinRoom', (roomId: string, initialCode: string) => {
        socket.join(roomId);
    
        if (!rooms.has(roomId)) {
          rooms.set(roomId, { mentor: socket.id, students: new Set(), code: initialCode }); // Initialize with initialCode
          socket.emit('assignRole', 'mentor'); 
        } else {
          rooms.get(roomId)?.students.add(socket.id);
          socket.emit('assignRole', 'student'); 
    

          const currentCode = rooms.get(roomId)?.code || '';
          socket.emit('initialCode', currentCode);
        }
    

        io.to(roomId).emit('studentsCount', rooms.get(roomId)?.students.size || 0);
      });
    
      socket.on('codeChange', ({ room, code }: { room: string; code: string }) => {

        if (rooms.has(room)) {
          rooms.get(room)!.code = code;
        }
    

        socket.to(room).emit('codeUpdate', code);
      });
    
      socket.on('solutionSolved', ({ room, solved }: { room: string; solved: boolean }) => {

        io.to(room).emit('solutionSolved', solved);
      });
    
      socket.on('leaveRoom', (roomId: string) => {

        if (rooms.has(roomId)) {
          const roomData = rooms.get(roomId);
    
          if (roomData?.mentor === socket.id) {

            io.to(roomId).emit('mentorLeft');
            rooms.delete(roomId);
          } else if (roomData?.students.has(socket.id)) {

            roomData.students.delete(socket.id);
            io.to(roomId).emit('studentsCount', roomData.students.size);
          }
        }
      });
    
      socket.on('disconnect', () => {
        console.log('user disconnected');
    

        for (const [roomId, roomData] of rooms.entries()) {
          if (roomData.mentor === socket.id) {

            io.to(roomId).emit('mentorLeft');
            rooms.delete(roomId);
          } else if (roomData.students.has(socket.id)) {

            roomData.students.delete(socket.id);
            io.to(roomId).emit('studentsCount', roomData.students.size);
          }
        }
      });


    });

    

    return { app, io, server };
  } catch (error) {
    console.error('Failed to initialize server:');
    throw error;
  }
};

export default initializeServer;


