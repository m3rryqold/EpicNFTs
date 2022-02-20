import React, { useEffect,useState } from 'react';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import { ethers } from 'ethers';
import myEpicNFT from './utils/MyEpicNFT.json';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const CONTRACT_ADDRESS = "0x3D56eD4DCDe5f15E2C9CE18B7305EE4686A24eEe";

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
      //user already connected and authorized
      setupEventListener()
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

      // user visits site and connected wallet for first time
      setupEventListener()
    } catch (error){
      console.log(error)
    }
  }

  //listener setup
  const setupEventListener = async => {
    try{
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS,myEpicNFT.abi, signer)

        // capture event when contract throws it.
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener")
      } else{
        console.log("Ethereum object doesn't exist!");
      }
    } catch(error){
      console.log(error)
    }
  }

  // mint NFT
  const askContractToMintNft = async () => {

    try{
      const { ethereum } = window;

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS,myEpicNFT.abi,signer);

        console.log("pop up wallet to pay gas, sigh...")
        let nftTxn = await connectedContract.makeAnEpicNFT();

        console.log("Mining... please wait.")
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);


      } else {
        console.log("Ethereum onject doesn't exist!");
      }
    } catch (error) {
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
            <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
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