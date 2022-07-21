const express = require('express');
const { abi } = require('./abi');
const ethers = require("ethers");
const app = express();

const contractAddress = '0xa2139C4FC5DF92a790EFf9707D0568c0CC5192CB';

app.listen(3000, () => {
    console.log('listening on port 3000');
})

app.get('/', (req, res) => {
    res.send('server is up!')
})

app.get('/mint', async (req, res) => {
    try {

        var url = 'https://rinkeby.infura.io/v3/c34e0ffd65024a00a40523d2e148d276';
        var customHttpProvider = new ethers.providers.JsonRpcProvider(url);
        const sc = new ethers.Contract(contractAddress, abi, customHttpProvider)
        const interface = new ethers.utils.Interface(abi)
        var privateKey = "b9ff2a3e522e34e748169cc9bd369c507f7d65cd5573ec69ae902e0bfb898c50";
        var wallet = new ethers.Wallet(privateKey);
        console.log("Address: " + wallet.address);

        const tx = {
            to: contractAddress,
            value: ethers.utils.parseEther("0.01"),
            gasLimit: 10000000,
            gasPrice: (await customHttpProvider.getFeeData()).gasPrice,
            data: interface.encodeFunctionData("mintRequire"),
            nonce: await customHttpProvider.getTransactionCount(wallet.address),
            chainId: 4,
        }

        console.log(tx);

        wallet.signTransaction(tx).then((signedTX) => {
            customHttpProvider.sendTransaction(signedTX).then(console.log);
        });
    } catch (e) {
        console.log(e.message);
    }
})

