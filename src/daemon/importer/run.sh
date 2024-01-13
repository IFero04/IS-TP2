#!/bin/bash

if [ $USE_DEV_MODE = "true" ];
  then nodemon --legacy-watch --exec python -u main.py $NUM_XML_PARTS;
  else python -u main.py $NUM_XML_PARTS;
fi