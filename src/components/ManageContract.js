import React, { useState, useEffect } from 'react';
import { useSDK } from "@metamask/sdk-react";
import Web3 from 'web3';
import DropContract from '../contract/Drop.json';  // Ensure this path is correct

function ManageContract({ contractAddress }) {
    const [account, setAccount] = useState('');
    const [newTokenAddress, setNewTokenAddress] = useState('');
    const [newDropAmount, setNewDropAmount] = useState('');
    const [dropperAddress, setDropperAddress] = useState('');
    const [balance, setBalance] = useState('');
    const [dropAmount, setDropAmount] = useState('');
    const [verificationStatus, setVerificationStatus] = useState(false);
    const [checkVerificationAddress, setCheckVerificationAddress] = useState('');

    const { sdk, connected } = useSDK();

    const connect = async () => {
        try {
            const accounts = await sdk?.connect();
            setAccount(accounts?.[0]);
        } catch (err) {
            console.error("Failed to connect: ", err);
        }
    };

    useEffect(() => {
        if (account && contractAddress) {
            loadBalance();
            loadDropAmount();
        }
    }, [account, contractAddress]);

    const loadBalance = async () => {
        try {
            const web3 = new Web3(window.ethereum);
            const contract = new web3.eth.Contract(DropContract.abi, contractAddress);
            const balance = await contract.methods.getBalance().call();
            setBalance(web3.utils.fromWei(balance, 'ether'));
        } catch (error) {
            console.error("Error loading balance:", error);
        }
    };

    const loadDropAmount = async () => {
        try {
            const web3 = new Web3(window.ethereum);
            const contract = new web3.eth.Contract(DropContract.abi, contractAddress);
            const amount = await contract.methods.dropAmount().call();
            setDropAmount(web3.utils.fromWei(amount, 'ether'));
        } catch (error) {
            console.error("Error loading drop amount:", error);
        }
    };

    const checkVerification = async () => {
        try {
            const web3 = new Web3(window.ethereum);
            const contract = new web3.eth.Contract(DropContract.abi, contractAddress);
            const status = await contract.methods.verification(checkVerificationAddress).call();
            setVerificationStatus(status);
        } catch (error) {
            console.error("Error checking verification status:", error);
        }
    };

    const changeTokenAddress = async (e) => {
        e.preventDefault();
        try {
            const web3 = new Web3(window.ethereum);
            const contract = new web3.eth.Contract(DropContract.abi, contractAddress);
            await contract.methods.changeToken(newTokenAddress).send({ from: account });
            alert("Token address changed successfully!");
        } catch (error) {
            console.error("Error changing token address:", error);
        }
    };

    const changeDropAmount = async (e) => {
        e.preventDefault();
        try {
            const web3 = new Web3(window.ethereum);
            const contract = new web3.eth.Contract(DropContract.abi, contractAddress);
            await contract.methods.dropAmountChange(web3.utils.toWei(newDropAmount, 'ether')).send({ from: account });
            alert("Drop amount changed successfully!");
        } catch (error) {
            console.error("Error changing drop amount:", error);
        }
    };

    const withdrawTokens = async (e) => {
        e.preventDefault();
        try {
            const web3 = new Web3(window.ethereum);
            const contract = new web3.eth.Contract(DropContract.abi, contractAddress);
            await contract.methods.withdraw().send({ from: account });
            alert("Tokens withdrawn successfully!");
        } catch (error) {
            console.error("Error withdrawing tokens:", error);
        }
    };

    const changeVerificationStatus = async (e) => {
        e.preventDefault();
        try {
            const web3 = new Web3(window.ethereum);
            const contract = new web3.eth.Contract(DropContract.abi, contractAddress);
            await contract.methods.changeVerification(dropperAddress).send({ from: account });
            alert("Verification status changed successfully!");
        } catch (error) {
            console.error("Error changing verification status:", error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black uppercase">
            {/* Card Container */}
            <div className="bg-gray-800 text-white rounded-lg shadow-lg p-8 w-full max-w-md">
                {/* Header */}
                <h2 className="text-2xl font-bold mb-6 text-center uppercase">Manage Airdrop</h2>

                {connected && (
                    <div>
                        {account && <p className="text-center mb-4">Connected account: {account}</p>}
                    </div>
                )}

                {account ? (
                    <div>
                        {/* Display Contract Address */}
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-2">Contract Address</h3>
                            <p className="text-center">{contractAddress}</p>
                        </div>

                        {/* Change Token Address */}
                        <form className="space-y-4" onSubmit={changeTokenAddress}>
                            <div>
                                <label className="block text-sm font-medium mb-2" htmlFor="newTokenAddress">
                                    New Token Address
                                </label>
                                <input
                                    type="text"
                                    id="newTokenAddress"
                                    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter new token address"
                                    value={newTokenAddress}
                                    onChange={(e) => setNewTokenAddress(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 uppercase"
                            >
                                Change Token Address
                            </button>
                        </form>

                        {/* Change Drop Amount */}
                        <form className="space-y-4" onSubmit={changeDropAmount}>
                            <div>
                                <label className="block text-sm font-medium mb-2 mt-3" htmlFor="newDropAmount">
                                    New Drop Amount
                                </label>
                                <input
                                    type="number"
                                    id="newDropAmount"
                                    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter new drop amount"
                                    value={newDropAmount}
                                    onChange={(e) => setNewDropAmount(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 uppercase"
                            >
                                Change Drop Amount
                            </button>
                        </form>

                        {/* Withdraw Tokens */}
                        <form className="space-y-4" onSubmit={withdrawTokens}>
                            <button
                                type="submit"
                                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 uppercase"
                            >
                                Withdraw Tokens
                            </button>
                        </form>

                        {/* Change Verification Status */}
                        <form className="space-y-4" onSubmit={changeVerificationStatus}>
                            <div>
                                <label className="block text-sm font-medium mb-2 mt-3" htmlFor="dropperAddress">
                                    Dropper Address
                                </label>
                                <input
                                    type="text"
                                    id="dropperAddress"
                                    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter dropper address"
                                    value={dropperAddress}
                                    onChange={(e) => setDropperAddress(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 uppercase"
                            >
                                Change Verification Status
                            </button>
                        </form>

                        {/* Check Balance */}
                        <button
                            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 uppercase"
                            onClick={loadBalance}
                        >
                            Check Balance
                        </button>

                        {/* Display Balance */}
                        <div className="mt-6">
                            <h3 className="text-xl font-semibold mb-2">Remaining Tokens</h3>
                            <p className="text-center">{balance} ETH</p>
                        </div>

                        {/* Check Drop Amount */}
                        <button
                            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 uppercase"
                            onClick={loadDropAmount}
                        >
                            Check Drop Amount
                        </button>

                        {/* Display Drop Amount */}
                        <div className="mt-6">
                            <h3 className="text-xl font-semibold mb-2">Drop Amount</h3>
                            <p className="text-center">{dropAmount} ETH</p>
                        </div>

                        {/* Check Verification Status */}
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); checkVerification(); }}>
                            <div>
                                <label className="block text-sm font-medium mb-2 mt-3" htmlFor="checkVerificationAddress">
                                    Address to Check
                                </label>
                                <input
                                    type="text"
                                    id="checkVerificationAddress"
                                    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter address to check"
                                    value={checkVerificationAddress}
                                    onChange={(e) => setCheckVerificationAddress(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 uppercase"
                            >
                                Check Verification Status
                            </button>
                        </form>

                        {/* Display Verification Status */}
                        <div className="mt-6">
                            <h3 className="text-xl font-semibold mb-2">Verification Status</h3>
                            <p className="text-center">{verificationStatus ? "Claimed" : "Not Claimed"}</p>
                        </div>
                    </div>
                ) : (
                    <button
                        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 uppercase"
                        onClick={connect}
                    >
                        Connect
                    </button>
                )}
            </div>
        </div>
    );
}

export default ManageContract;
