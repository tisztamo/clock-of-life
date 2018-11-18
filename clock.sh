#!/bin/bash

#chromium-browser --incognito --kiosk --app http://localhost?pattern=original_clock&noui=1 &
chromium-browser --incognito --js-flags="--max-old-space-size=700 --expose-gc" &
lxterminal

