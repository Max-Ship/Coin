const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'y8dp82',
  e2e: {
    baseUrl: 'http://localhost:8080',
  },
});
