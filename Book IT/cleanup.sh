#!/bin/sh

./minifab cleanup

rm -rf vars/
cd api-go/
rm -rf wallet/
cd ..
rm -rf wallet/
