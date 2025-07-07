#!/bin/bash

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  echo "This script should be sourced, not executed."
  exit 1
fi

export $(grep -v '^#' .env | xargs)
