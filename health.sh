#!/usr/bin/env bash

# Check for .js files in src/ (should only be in out/)
if find src -name "*.js" -o -name "*.js.map" | grep -q .; then
    echo "ERROR: Found compiled .js files in src/ (should only be in out/)"
    find src -name "*.js" -o -name "*.js.map" | sed 's/^/  /'
    exit 1
fi

pnpm run compile

if [ $? -ne 0 ]; then
    echo "ERROR: Compilation failed"
    exit 1
fi

exit 0
