#!/bin/bash
set -e

echo "Verifying location of Scratch source is known"
if [ -z "$SCRATCH_SRC_HOME" ]; then
    echo "Error: SCRATCH_SRC_HOME environment variable is not set."
    exit 1
fi

#####
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $SCRATCH_SRC_HOME/scratch-vm/src/extensions
cp -f $DIR/my_module/vm/scratch3_foxbot/index.js scratch3_foxbot/index.js
cp -f $DIR/my_module/vm/scratch3_foxbotCar/index.js scratch3_foxbotCar/index.js
#####

echo "BUILDING SCRATCH VM ..."
cd $SCRATCH_SRC_HOME/scratch-vm
NODE_OPTIONS='--openssl-legacy-provider' ./node_modules/.bin/webpack --bail #--watch --progress

echo "BUILDING SCRATCH GUI ..."
cd $SCRATCH_SRC_HOME/scratch-gui
NODE_OPTIONS='--openssl-legacy-provider' ./node_modules/.bin/webpack --bail #--watch --progress

# echo "Cleaning up cache..."
# npm cache verify
# ./3    $SCRATCH_SRC_HOME/scratch-vm/node_modules/.cache
# rm -rf $SCRATCH_SRC_HOME/scratch-gui/node_modules/.cache