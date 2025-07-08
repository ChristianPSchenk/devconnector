#!/bin/bash
set -eou pipefail

npm install --prefix client
npm install

npm run build --prefix client

/usr/bin/node /opt/devconnector/repo/server.js



