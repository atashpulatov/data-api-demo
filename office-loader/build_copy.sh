#! /bin/bash
yarn build
cp -rf ./build/* ../ROOT/experimental/
cp -rf ./build/* ../MicroStrategyLibrary/build/
