#!/bin/bash
#
#


cd /home/erapetti/Pizarron
export NODE_ENV=production
#export LOG_QUERIES=true
exec sails lift --prod
