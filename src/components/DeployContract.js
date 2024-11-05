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
        <div className="flex items-center justify-center min-h-screen bg-black uppercase">
            {/* Card Container */}
            <div className="bg-gray-800 text-white rounded-lg shadow-lg p-8 w-full max-w-md">
                {/* Header */}
                <h2 className="text-2xl font-bold mb-6 text-center uppercase">Create Airdrop</h2>

                {connected && (
                    <div>
                        {account && <p className="text-center mb-4">Connected account: {account}</p>}
                    </div>
                )}

                {account ? (
                    <form className="space-y-4" onSubmit={handleDeploy}>
                        {/* Token Address */}
                        <div>
                            <label className="block text-sm font-medium mb-2" htmlFor="tokenAddress">
                                Token Address
                            </label>
                            <input
                                type="text"
                                id="tokenAddress"
                                className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter token address"
                                value={tokenAddress}
                                onChange={(e) => setTokenAddress(e.target.value)}
                                required
                            />
                        </div>

                        {/* Token Amount */}
                        <div>
                            <label className="block text-sm font-medium mb-2" htmlFor="tokenAmount">
                                Token Amount
                            </label>
                            <input
                                type="number"
                                id="tokenAmount"
                                className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter token amount"
                                value={tokenAmount}
                                onChange={(e) => setTokenAmount(e.target.value)}
                                required
                            />
                        </div>

                        {/* Initial Owner */}
                        <div>
                            <label className="block text-sm font-medium mb-2" htmlFor="initialOwner">
                                Initial Owner
                            </label>
                            <input
                                type="text"
                                id="initialOwner"
                                className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter initial owner"
                                value={initialOwner}
                                onChange={(e) => setInitialOwner(e.target.value)}
                                required
                            />
                        </div>

                        {/* Airdrop Button */}
                        <button
                            type="submit"
                            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 uppercase"
                        >
                            Create Airdrop
                        </button>
                    </form>
                ) : (
                    <button
                        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 uppercase"
                        onClick={connect}
                    >
                        Connect
                    </button>
                )}

                {contractAddress && <p className="text-center mt-4">Contract Address: {contractAddress}</p>}
            </div>
        </div>
    );
}

export default DeployContract;
