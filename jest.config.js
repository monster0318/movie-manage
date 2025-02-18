// jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",  // Your Next.js project directory
});

const customJestConfig = {
  moduleDirectories: ["node_modules", "<rootDir>/"],  // Custom module directories
  testEnvironment: "jest-environment-jsdom",  // Set the test environment to jsdom (for frontend tests)
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",  // Map '@' alias to the 'src' directory
  },
  transformIgnorePatterns: [
    "/node_modules/(?!jose|next-auth)/" // Allow 'jose' and 'next-auth' to be transformed by Babel
  ],
};

module.exports = createJestConfig(customJestConfig);  // Export the final Jest config
