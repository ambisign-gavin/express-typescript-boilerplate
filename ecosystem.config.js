/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const SCRIPT = './dist/index.js';

const appName = 'express_server';

module.exports = {
  apps: [
    {
      name: `${appName}_test`,
      script: SCRIPT,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'test',
        ...process.env,
      },
    },
    {
      name: `${appName}_prod`,
      script: SCRIPT,
      instances: 0,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '800M',
      env: {
        NODE_ENV: 'production',
        ...process.env,
      },
    },
  ],
};
