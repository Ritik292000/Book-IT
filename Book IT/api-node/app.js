/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const fs = require('fs');

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');

//This will be used to store the contract object
var movieContract;

exports.init = async function () {

	try {
		const ccpPath = path.resolve(__dirname, '..','vars', 'profiles', 'mychannel_connection_for_nodesdk.json');
        console.log(`Chaincode running 1 ...`);
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        console.log(`Chaincode running 2 ...`);
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(),'..','wallet');
        console.log(`Chaincode running 3 ...`);
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('producer1');
        if (!identity) {
            console.log('An identity for the user "producer" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        console.log(`Chaincode running 4 ...`);
        await gateway.connect(ccp, { wallet, identity: 'producer1', discovery: { enabled: true, asLocalhost: true } });

        console.log(`Chaincode running 5 ...`);
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        console.log(`Chaincode running 6 ...`);
        // Get the contract from the network.
        movieContract = network.getContract('tokenChaincode');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
        console.log(`Chaincode running 7 ...`);
		}catch(error){
			console.log("Inner Error catch block");
			console.log(error);
		}
	};

exports.MintWithTokenURI = async function (id, amount, movie) {
	try{
		//get client account ID for UserMinter in org1
        for (let i = 0; i < amount; i++) {
            console.log(`Creating token ${id} for the ${i + 1} time`);
            await movieContract.submitTransaction('MintWithTokenURI',id+'-'+i,'sit://token?mc=msp_producer&mode=02&purpose=00&movie='+movie);
            console.log('Transaction has been submitted');
          }

	}catch(e){
		console.log("Error in MintWithTokenURI");
		console.log(e);
	}
};

exports.BatchTransferFrom = async function (id, amount) {
	try{
		//get client account ID for UserMinter in org1
		const minterAccount = await movieContract.submitTransaction('ClientAccountID');

		console.log('\n--> Evaluate Transaction: BatchTransferFrom, function transfer token from one account to another');
		let result = await movieContract.submitTransaction('BatchTransferFrom', tokenMinterOrg1Base64Address, tokenRecieverBase64Address, id, amount);
		
		let balance = await movieContract.submitTransaction('BalanceOf', tokenMinterOrg1Base64Address, "101");
		console.log("balance of minter for 101" + balance.toString());

		balance = await movieContract.submitTransaction('BalanceOf', tokenRecieverBase64Address, "101");
		console.log("balance of receiver for 101" + balance.toString());

		return result.toString();
	}
	catch(e){
		console.log("Error in BatchTransferFrom");
		console.log(e);
	}
};

// function Burn(ctx contractapi.TransactionContextInterface, account string, id uint64, amount uint64)
exports.Burn = async function (id, amount) {
	try{
		//burn token tokenRecieverBase64Address from org2
        const result = await movieContract.evaluateTransaction('TotalSupply');
        console.log(`Total tokens for this movie is: ${result.toString()}`);

		console.log('\n--> Evaluate Transaction: Burn, function burn token from an account');
		//Burn the Token
        for (let i = 0; i < amount; i++) {
            console.log(`Burning token ${id}-${i + 1}`);
            await movieContract.submitTransaction('Burn',id+'-'+i);
            console.log(`Burned token ${id}-${i + 1}`);
          }
		//balance = await movieContract.submitTransaction('BalanceOf', tokenRecieverBase64Address, "103");
		//console.log("balance of receiver for 101" + balance.toString());

	}
	catch(e){
		console.log("Error in Burn");
		console.log(e);
	}
};

