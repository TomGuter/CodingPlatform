import dotenv from 'dotenv';
import mongoose from 'mongoose';
import initializeServer from './server';

dotenv.config();

const startServer = async () => {
  try {
    const { server } = await initializeServer();
    const PORT = process.env.PORT;

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    server.on('error', (error) => {
      console.error('Server error:', error);
    });

    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Closing server...');
      server.close(() => {
        mongoose.connection.close();
        console.log('Server and MongoDB connection closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();




