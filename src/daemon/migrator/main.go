package main

import (
    "log"
    "os"
)

var (
    POLLING_FREQ = os.Getenv("POLLING_FREQ")
)

func main() {
    log.Println("POLLING_FREQ: ", POLLING_FREQ)
}