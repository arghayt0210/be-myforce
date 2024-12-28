module.exports = {
  apps: [
    {
      name: 'backend',
      cwd: './backend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 8000
      },
      watch: false, // Disable watch to prevent auto-restart
      max_memory_restart: '300M'
    },
    {
      name: 'frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      watch: false, // Disable watch to prevent auto-restart
      max_memory_restart: '300M'
    },
  ],
};