/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..','vars', 'profiles', 'mychannel_connection_for_nodesdk.json');
        //console.log(`Chaincode running 1 ...`);
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        //console.log(`Chaincode running 2 ...`);
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(),'..','wallet');
        //console.log(`Chaincode running 3 ...`);
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('producer1');
        if (!identity) {
            console.log('An identity for the user "producer1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        //console.log(`Chaincode running 4 ...`);
        await gateway.connect(ccp, { wallet, identity: 'producer1', discovery: { enabled: true, asLocalhost: true } });

        //console.log(`Chaincode running 5 ...`);
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        //console.log(`Chaincode running 6 ...`);
        // Get the contract from the network.
        const contract = network.getContract('tokenChaincode');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
        //console.log(`Chaincode running 7 ...`);
        //await contract.submitTransaction('checkInitialized');
        await contract.submitTransaction('Initialize','SIT','Token');

        // console.log('Chaincode running 8 ...')

        //Mint the token
        // await contract.submitTransaction('MintWithTokenURI','65f8a2ac-f0c1-43ba-943d-31e348fed841','sit://token?mc=msp_producer&mode=02&purpose=00&movie=pathan');
        // console.log('Transaction has been submitted');

        //Burn the Token
        // await contract.submitTransaction('Burn','102');
        // console.log('Transaction has been submitted');

        //check the total supply
        // await contract.submitTransaction('TotalSupply');
        // console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
