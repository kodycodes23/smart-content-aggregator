#!/usr/bin/env node

/**
 * Smart Content Aggregator API
 * Main entry point
 */

import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

import App from './app';
import DatabaseConnection from './config/database';

/**
 * Main function to start the server
 */
async function main(): Promise<void> {
  try {
    console.log(' Starting Smart Content Aggregator API...');

    // Connect to database
    console.log(' Connecting to database...');
    await DatabaseConnection.connect();
    console.log(' Database connected successfully');

    // Create and start the app
    const app = new App();
    await app.start();

  } catch (error) {
    console.error(' Failed to start server:', error);
    await DatabaseConnection.disconnect();
    process.exit(1);
  }
}

/**
 * Graceful shutdown handler
 */
async function gracefulShutdown(signal: string): Promise<void> {
  console.log(`\n ${signal} signal received`);
  try {
    console.log('🔌 Closing database connection...');
    await DatabaseConnection.disconnect();
    console.log(' Database connection closed');
    console.log('👋 Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error(' Error during shutdown:', error);
    process.exit(1);
  }
}

// Error handlers
process.on('uncaughtException', (error) => {
  console.error(' Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(' Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start the application
if (require.main === module) {
  main();
}
