#!/bin/bash
set -eou pipefail

npm install --prefix client
npm run build --prefix client

npm install



