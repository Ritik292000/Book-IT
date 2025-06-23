#!/bin/sh

mkdir vars
cp chaincode.tar.xz vars/
cd vars/
tar -xf chaincode.tar.xz
rm chaincode.tar.xz
cd ..
./minifab up -o producer.movie.com -n tokenChaincode -i 2.4 -d false -l go -v 1.3 -r true -s couchdb -e 7000
sudo chmod 775 -R vars/





