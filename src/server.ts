#!/usr/bin/env node

/**
 * Smart Content Aggregator API Server
 * Main entry point for the application
 */

import dotenv from 'dotenv';
import DatabaseConnection from './config/database';

// Load environment variables first
dotenv.config();

// Import the app after environment variables are loaded
import App from './app';

/**
 * Server startup function
 */
async function startServer(): Promise<void> {
  try {
    console.log(' Starting Smart Content Aggregator API...');

    // Connect to database
    console.log(' Connecting to database...');
    await DatabaseConnection.connect();
    console.log(' Database connected successfully');

    // Create and start the Express application
    const app = new App();
    await app.start();

  } catch (error) {
    console.error(' Failed to start server:', error);
    await DatabaseConnection.disconnect();
    process.exit(1);
  }
}

/**
 * Graceful shutdown handlers
 */
const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`\n ${signal} signal received: closing HTTP server`);
  try {
    await DatabaseConnection.disconnect();
    console.log(' Database connection closed');
    console.log(' Server shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error(' Error during graceful shutdown:', error);
    process.exit(1);
  }
};

// Handle process termination
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error(' Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error(' Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
if (require.main === module) {
  startServer();
}
