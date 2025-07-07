#!/bin/bash
cd /home/kavia/workspace/code-generation/circuluminate-109352-109361/regenius_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

