#!/bin/bash

#chromium-browser --incognito --kiosk --app http://localhost?pattern=original_clock&noui=1 &
chromium-browser --kiosk --incognito --js-flags="--max-old-space-size=700 --max-new-space-size=1024 --never-compact" http://localhost?pattern=halfspeed_original &
lxterminal

