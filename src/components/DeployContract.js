import React, { useState } from 'react';
import { useSDK } from "@metamask/sdk-react";
import Web3 from 'web3';
import DropContract from '../contract/Drop.json';  // Ensure this path is correct

function DeployContract() {
    const [account, setAccount] = useState('');
    const [tokenAddress, setTokenAddress] = useState('');
    const [tokenAmount, setTokenAmount] = useState('');
    const [initialOwner, setInitialOwner] = useState('');
    const [contractAddress, setContractAddress] = useState('');

    const { sdk, connected } = useSDK();

    const connect = async () => {
        try {
            const accounts = await sdk?.connect();
            setAccount(accounts?.[0]);
        } catch (err) {
            console.error("Failed to connect: ", err);
        }
    };

    const handleDeploy = async (e) => {
        e.preventDefault();
        if (!account) {
            alert("Please connect your MetaMask account first.");
            return;
        }

        try {
            const web3 = new Web3(window.ethereum);
            const networkId = await web3.eth.net.getId();

            // Check if the network is Sepolia (chainId 11155111)
            // if (networkId !== 11155111) {
            //     alert("Please switch to the Sepolia testnet.");
            //     return;
            // }

            const contract = new web3.eth.Contract(DropContract.abi);

            contract.deploy({
                data: DropContract.bytecode,
                arguments: [tokenAddress, web3.utils.toWei(tokenAmount, 'ether'), initialOwner]
            })
            .send({ from: account })
            .on('transactionHash', (hash) => {
                console.log("Transaction hash:", hash);
            })
            .on('receipt', (receipt) => {
                setContractAddress(receipt.contractAddress);
                console.log("Contract deployed to address:", receipt.contractAddress);
            })
            .on('error', (error) => {
                console.error("Error deploying contract:", error);
            });
        } catch (error) {
            console.error("Error deploying contract:", error);
        }
    };

    return (
        <div>
            <h1>Create Airdrop</h1>
            <button style={{ padding: 10, margin: 10 }} onClick={connect}>
                Connect
            </button>

            {connected && (
                <div>
                    {account && <p>Connected account: {account}</p>}
                </div>
            )}

            {account && (
                <form onSubmit={handleDeploy}>
                    <input
                        type="text"
                        placeholder="Token Address"
                        value={tokenAddress}
                        onChange={(e) => setTokenAddress(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Token Amount"
                        value={tokenAmount}
                        onChange={(e) => setTokenAmount(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Initial Owner"
                        value={initialOwner}
                        onChange={(e) => setInitialOwner(e.target.value)}
                        required
                    />
                    <button type="submit">Deploy Contract</button>
                </form>
            )}

            {contractAddress && <p>Contract Address: {contractAddress}</p>}
        </div>
    );
}

export default DeployContract;
