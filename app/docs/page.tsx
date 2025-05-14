"use client"; // Ensure this is a Client Component

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import { useEffect, useState } from "react";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function APIDocs() {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    fetch("/api/docs")
      .then((res) => res.json())
      .then((data) => setSpec(data))
      .catch((err) => console.error("Error loading Swagger spec:", err));
  }, []);

  if (!spec) return <p>Loading API documentation...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>API Documentation</h1>
      <SwaggerUI spec={spec} docExpansion="none" filter={true} />
    </div>
  );
}
