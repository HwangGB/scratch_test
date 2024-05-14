#!/bin/bash
set -e

echo "Verifying location of Scratch source is known"
if [ -z "$SCRATCH_SRC_HOME" ]; then
    echo "Error: SCRATCH_SRC_HOME environment variable is not set."
    exit 1
fi

#echo "Checking if Scratch source has already been customized"
#if [ -e $SCRATCH_SRC_HOME/patched ]; then
#    exit 1
#fi

echo "Getting the location of this script"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo $DIR

echo "Adding extension to Scratch source"
cd $SCRATCH_SRC_HOME/scratch-vm/src/extensions
#cp -f $DIR/my_module/vm/scratch3_foxbot/index.js scratch3_foxbot/index.js
cp -Rf $DIR/my_module/vm/scratch3_foxbot .
cp -Rf $DIR/my_module/vm/scratch3_foxbotCar .

echo "Patching Scratch source to enable extension"
cd $SCRATCH_SRC_HOME/scratch-vm/src/extension-support
cp -Rf $DIR/my_module/vm/extension-manager.js .

cd $SCRATCH_SRC_HOME/scratch-gui/src/lib/libraries/extensions
cp -Rf $DIR/my_module/gui/index.jsx .

echo "Copying in the Scratch extension files"
cd $SCRATCH_SRC_HOME/scratch-gui/src/lib/libraries/extensions
cp -Rf $DIR/my_module/gui/foxbot .
cp -Rf $DIR/my_module/gui/foxbotCar .

cd $SCRATCH_SRC_HOME/scratch-vm
mv package.json $DIR/dependencies/package.json
ln -s $DIR/dependencies/package.json .
mv package-lock.json $DIR/dependencies/package-lock.json
ln -s $DIR/dependencies/package-lock.json .
#echo "Marking the Scratch source as customized"
#touch $SCRATCH_SRC_HOME/patched
