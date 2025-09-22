import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUI from 'swagger-ui-express';
import dotenv from 'dotenv';

import DatabaseConnection from './config/database';
import { swaggerSpec } from './config/swagger';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware';
import { getDatabaseInfo, formatEnvironment } from './utils';

// Load environment variables
dotenv.config();

class App {
  public app: Application;
  private readonly port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3000', 10);

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS configuration
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }));

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging middleware
    this.app.use((req: Request, res: Response, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  private initializeRoutes(): void {
    // Root endpoint
    this.app.get('/', (req: Request, res: Response) => {
      res.status(200).json({
        success: true,
        message: 'Smart Content Aggregator API',
        version: '1.0.0',
        documentation: '/api-docs',
        endpoints: {
          articles: '/api/v1/articles',
          users: '/api/v1/users',
          interactions: '/api/v1/interactions',
          recommendations: '/api/v1/recommendations',
          health: '/api/v1/health',
        },
      });
    });

    // API routes
    this.app.use('/api/v1', routes);
  }

  private initializeSwagger(): void {
    // Swagger UI setup
    this.app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Smart Content Aggregator API Documentation',
    }));

    // Swagger JSON endpoint
    this.app.get('/api-docs.json', (req: Request, res: Response) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler for undefined routes
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Start server
        const server = this.app.listen(this.port, () => {
          const dbInfo = getDatabaseInfo(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartcontent_aggregator');
          const environment = formatEnvironment(process.env.NODE_ENV || 'development');

          console.log(`
 Smart Content Aggregator API is running!

 Server: http://localhost:${this.port}
 Documentation: http://localhost:${this.port}/api-docs
 Health Check: http://localhost:${this.port}/api/v1/health

 Available Endpoints:
   • Articles: http://localhost:${this.port}/api/v1/articles
   • Users: http://localhost:${this.port}/api/v1/users
   • Interactions: http://localhost:${this.port}/api/v1/interactions
   • Recommendations: http://localhost:${this.port}/api/v1/recommendations

 Environment: ${environment}
  Database: ${dbInfo.type} (${dbInfo.masked})
        `);
          resolve();
        });

        server.on('error', (error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  public getApp(): Application {
    return this.app;
  }
}

export default App;
