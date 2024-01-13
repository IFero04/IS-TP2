#!/bin/bash

if [ $USE_DEV_MODE = "true" ];
  then nodemon --legacy-watch --exec python -u main.py $RPC_SERVER_PORT;
  else python -u main.py $RPC_SERVER_PORT;
fi