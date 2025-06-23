# Fabric Movie Platform

This project is a blockchain-based movie platform built on Hyperledger Fabric. It provides a secure and transparent platform for movie producers and consumers to interact with each other. The project uses Fabric binaries of version 2.4 and is built using Node.js and Golang.

## Prerequisites

Before running the project, make sure you have the following:

1. Fabric Binaries: Ensure that you have the following Fabric binaries pulled in your system:
    ```bash 
    i. hyperledger/fabric-tools:2.4
    
    ii. hyperledger/fabric-peer:2.4
    
    iii. hyperledger/fabric-orderer:2.4
    
    iv. hyperledger/fabric-ccenv:2.4
    
    v. hyperledger/fabric-baseos:2.4
    
    ```

2. Node.js and NPM: Ensure that Node.js and NPM are installed on your system.

3. Golang: Ensure that Golang with version >=19 is installed on your system.

## Running the Project

Follow the below steps to run the project:

1. Run the `deploy.sh` script to deploy the chaincode and start the Fabric network.

2. Navigate to the `api-node` directory and run `npm install` to install the required node modules.

3. Run the `enrollAdmin.js` and `registerUser.js` scripts to enroll the admin and register a new user.

4. Finally, run the `invoke.js` script to invoke the chaincode and start using the Fabric movie platform.

Happy movie watching!

