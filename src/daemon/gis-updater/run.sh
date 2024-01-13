#!/bin/bash

if [ $USE_DEV_MODE = "true" ];
  then nodemon --legacy-watch --exec python -u main.py $POLLING_FREQ ;
  else python -u main.py $POLLING_FREQ ;
fi