import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    supportFile: false,        // disable support file for now
    allowCypressEnv: false     // remove that warning
  },
});