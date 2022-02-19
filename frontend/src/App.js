import React, { useEffect,useState } from 'react';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {

  // store user's public wallet in a state. Don't forget to import useState
  const [currentAccount, setCurrentAccount] = useState("")

  //check connection needs to be async
  const checkIfWalletIsConnected = async () => {
    // check access to window.ethereum
    const { ethereum } = window;

    if (!ethereum){
      console.log("Make sure you have metamask!");
    }else{
      console.log("We have ethereum object", ethereum);
    }

    // check authorization to user's wallet
    const accounts = await ethereum.request({method: 'eth_accounts'});

    // user can have multiple accounts. Take the first one.
    if(accounts.length !== 0){
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)
    }else{
      console.log("No authorized account found")
    }
  }

  // connect wallet
  const connectWallet = async () =>{
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      // request access to account.
      const accounts = await ethereum.request({ method: "eth_requestAccounts"});

      // print out public address after authorizing Metamask
      console.log("Connected",accounts[0]);
    } catch (error){
      console.log(error)
    }
  }

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick = {connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  //run function on page load
  useEffect(()=>{
    checkIfWalletIsConnected();
  }, [])

// conditionally rendered if already connected
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.Yayy!!!
          </p>
          {currentAccount === ""?(
            renderNotConnectedContainer()
          ):(
            <button onClick={null} className="cta-button connect-wallet-button">
            Mint NFT
            </button>
          )}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;