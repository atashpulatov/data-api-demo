#!/bin/sh
set -e
cd /mnt/office-loader

yarn install --frozen-lockfile
yarn build
