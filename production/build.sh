#!/bin/sh
set -e
cd /mnt/production

npm ci
npm run eslint:json
npm run test:coverage
npm run build
