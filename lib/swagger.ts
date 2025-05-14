import swaggerJsdoc from 'swagger-jsdoc';

const getSwaggerSpec = () => {
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
    apis: ['./app/api/**/*.ts'], // Adjust path based on your file structure
  };

  return swaggerJsdoc(options);
};

export default getSwaggerSpec;
