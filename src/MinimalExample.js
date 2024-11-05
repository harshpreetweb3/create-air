import { ethers } from 'ethers';

async function testEthers() {
    try {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            console.log("Connected account:", address);
        } else {
            console.error("MetaMask is not installed or not connected.");
        }
    } catch (error) {
        console.error("Error connecting to MetaMask:", error);
    }
}

testEthers();
