import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Movie Management API',
      version: '1.0.0',
      description: 'API documentation for managing movies',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
  },
  apis: ['./app/api/**/*.js', './app/api/**/*.ts'], // Path to your API files (adjust as needed)
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
