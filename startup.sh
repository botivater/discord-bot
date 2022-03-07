#!/usr/bin/env sh
set -e

# Run the migrations
yarn mikro-orm migration:up

# Start the app
node ./dist/src/index.js