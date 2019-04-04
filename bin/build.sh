#!/bin/bash
set -e

npm run build

TARGET_PATH='/opt/app/static/'

cp -rf ./static $TARGET_PATH
cp index.html $TARGET_PATH/index.html


