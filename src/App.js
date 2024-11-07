import './App.css';
import React, { useState } from 'react';
import DeployContract from './components/DeployContract';
import ManageContract from './components/ManageContract';

function App() {

  const [contractAddress, setContractAddress] = useState('');

  return (
    <div className="App">
        {/* <DeployContract /> */}
        <DeployContract setContractAddress={setContractAddress} />
        {contractAddress && <ManageContract contractAddress={contractAddress} />}
    </div>
  );
}

export default App;
