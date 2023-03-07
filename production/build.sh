#!/bin/sh
set -e
cd /mnt/production

npm ci --silent
npm run eslint:json
npm run test:coverage
npm run build
