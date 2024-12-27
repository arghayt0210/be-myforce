#!/bin/bash

echo "Starting deployment process..."

# Backup env files before git pull
cp backend/.env backend/.env.temp
cp frontend/.env.local frontend/.env.local.temp

# Pull latest changes
git pull

# Restore env files after git pull
cp backend/.env.temp backend/.env
cp frontend/.env.local frontend/.env
rm backend/.env.temp
rm frontend/.env.local.temp

# Backend deployment
cd backend
npm install --legacy-peer-deps
npm run build

# Frontend deployment
cd ../frontend
npm install --legacy-peer-deps
npm run build

# Restart services
pm2 restart all

# Reload Nginx
sudo systemctl reload nginx

# Log deployment
echo "Deployment completed at $(date)" >> /var/log/deployments.log
