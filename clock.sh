#!/bin/bash

chromium-browser --incognito --kiosk --app http://localhost?pattern=original_clock&noui=1 &
lxterminal
