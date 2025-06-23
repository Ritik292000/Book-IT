#!/bin/sh

cd api-node


echo "Enrolling the Admin into the network"
node enrollAdmin.js

echo "Adding Producers and Distributors into the Network"
node registerUser.js

echo "Initializing the network and adding SIT token as the platform token"
node invoke.js

echo "Bringing up the server. It will take just a while..."
node server.js
