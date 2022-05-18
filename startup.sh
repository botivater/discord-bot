#!/usr/bin/env sh
set -e

# Run the migrations
yarn migration:up

# Start the app
node ./dist/src/index.js