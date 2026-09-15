const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
    test: {
        globals: true,
        environment: 'node',
        setupFiles: ['./tests/setup.js'],
        testTimeout: 60000,
        hookTimeout: 60000,
        fileParallelism: false,
    },
});
