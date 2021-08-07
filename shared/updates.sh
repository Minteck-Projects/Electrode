#!/bin/bash

echo "updater: Downloading update..."

wget https://github.com/Minteck-Projects/Neutron-Core/archive/trunk.zip &>/dev/null
code=$?
if [[ $code -eq 0 ]]; then
    echo "updater: Success"
else
    echo "updater: Failed with code $code"
    echo "updater: Cleaning up..."
    rm -dr trunk.zip*
    exit $code
fi

echo "updater: Extracting..."

unzip trunk.zip
code=$?
if [[ $code -eq 0 || $code -eq 2 ]]; then
    echo "updater: Success"
else
    echo "updater: Failed with code $code"
    echo "updater: Cleaning up..."
    rm -dr trunk.zip*
    exit $code
fi

echo "updater: Please wait while Updater prepare Neutron-Core to be installed..."

rm -dr ./public/api
rm -dr ./public/cms-special
rm -dr ./public/widgets
rm -dr ./public/resources/css
rm -dr ./public/resources/image
rm -dr ./public/resources/fonts
rm -dr ./public/resources/i18n
rm -dr ./public/resources/js
rm -dr ./public/resources/lib
rm -dr ./public/resources/private
rm -dr ./public/index.php

echo "updater: Installing..."

cp -r Neutron-Core-trunk/* ./public/
code=$?
if [[ $code -eq 0 ]]; then
    echo "updater: Success"
else
    echo "updater: Failed with code $code"
    echo "updater: Cleaning up..."
    rm -dr trunk.zip*
    exit $code
fi

rm -dr Neutron-Core-trunk/
code=$?
if [[ $code -eq 0 ]]; then
    echo "updater: Success"
else
    echo "updater: Failed with code $code"
    echo "updater: Cleaning up..."
    rm -dr trunk.zip*
    exit $code
fi

echo "updater: Updating version..."
code=$?
if [[ $code -eq 0 ]]; then
    echo "updater: Success"
else
    echo "updater: Failed with code $code"
    echo "updater: Cleaning up..."
    rm -dr trunk.zip*
    exit $code
fi

echo "updater: Cleaning up..."
rm -dr trunk.zip*
