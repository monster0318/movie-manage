// pages/api-docs.js

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import swaggerSpec from '@/lib/swagger';

export default function APIDocs() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>API Documentation</h1>
      <SwaggerUI
        spec={swaggerSpec}
        docExpansion="none" // Options like 'none', 'list', or 'full'
        filter={true} // Allow users to filter the API
        showRequestHeaders={true}
      />
    </div>
  );
}
