#!/bin/bash

OUTPUT_BIN="main"

# Check if not in dev mode
if [ "$USE_DEV_MODE" != "true" ]; then
  go build -o $OUTPUT_BIN main.go "$POLLING_FREQ";
fi

# Execute the project
if [ "$USE_DEV_MODE" = "true" ]; then
  nodemon --exec go run main.go "$POLLING_FREQ";
else
  ./$OUTPUT_BIN
fi
