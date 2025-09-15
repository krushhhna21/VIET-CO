#!/bin/sh
set -e

# Build the client
echo "Building client..."
cd client
../node_modules/.bin/vite build --outDir ../dist/client

# Build the server
echo "Building server..."
cd ..
./node_modules/.bin/esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist/server