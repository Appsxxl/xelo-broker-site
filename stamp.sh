#!/bin/sh
HASH=$(git rev-parse --short HEAD)
sed -i "s/__I18N_BUILD__/$HASH/g" index.html
echo "Stamped index.html: __I18N_BUILD__ → $HASH"
