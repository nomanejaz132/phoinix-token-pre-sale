import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ethers } from 'ethers';
import CountdownTimer from './CountdownTimer';

import Web3 from 'web3/dist/web3.min.js';
import contract from './ICO_Contract.json';
import './App.css';

// let rpcUrl = 'https://ropsten.infura.io/v3/db6ad682b4aa4d88b6d4850823672e09';
const Account1 = '0x9803CC075d4520f8Ea76201893EE133DAeA55B47';
const Account2 = '0x4882dC0662DF0ee370BA97Cbb86a45ceD716E53F';
const web3 = new Web3(window.ethereum);
let abi = contract.abi;
const contractAddress = '0x06Ba2ce7F269892EcA5A85403cA6a75E6B8351c5';

const PresalePage = () => {
  let content;
  const [inputfieldchange, setinputfieldchange] = useState();
  const [account, setAccount] = useState('');
  const [Hello, setHello] = useState({});
  const [loading, setLoading] = useState(true);
  const [loading2, setloading2] = useState(false);
  const [refresh, setrefresh] = useState(0);
  const [TokenName, setTokenName] = useState('');
  const [TokenSymbol, setTokenSymbol] = useState('');
  const [decimals, setdecimals] = useState('');
  const [totalSupply, settotalSupply] = useState('');
  const [remainingPreSaleTokens, setremainingPreSaleTokens] = useState('');
  const [getPrice, setPrice] = useState('');
  const [getStartTime, setStartTime] = useState('');
  const [getisSaleopen, setisSaleopen] = useState('');
  const [getEndTime, setEndTime] = useState('');
  const [getNOPH, setNOPH] = useState('');
  const [getBalance, setBalance] = useState('');
  const [presalecontractinstance, setpresalecontractinstance] = useState({});

  // new Code

  const [walletConnect, setWalletConnect] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [haveMetamask, sethaveMetamask] = useState(true);
  const [accountAddress, setAccountAddress] = useState('');
  const [time, setTime] = useState();

  const { ethereum } = window;

  // new Switch Network Code

  window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: '3',
        rpcUrls: ['https://ropsten.infura.io/v3/'],
        chainName: 'Ropsten Testnet',
        nativeCurrency: {
          name: 'Ropsten Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        blockExplorerUrls: ['https://ropsten.etherscan.io/'],
      },
    ],
  });

  // if (window.ethereum) {
  // window.ethereum.enable();
  // window.ethereum.request({
  //   method: 'wallet_addEthereumChain',
  //   params: [
  //     {
  //       chainId: '3',
  //       rpcUrls: ['https://ropsten.infura.io/v3/'],
  //       chainName: 'Ropsten Testnet',
  //       nativeCurrency: {
  //         name: 'Ropsten Testnet',
  //         symbol: 'ETH',
  //         decimals: 18,
  //       },
  //       blockExplorerUrls: ['https://ropsten.etherscan.io/'],
  //     },
  //   ],
  // });
  // } else {
  //   window.alert(
  //     'Non-Ethereum browser detected. You should consider trying MetaMask!'
  //   );
  // }

  // new Connect Wallet

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        sethaveMetamask(false);
      }
      const networkId = await web3.eth.net.getId();
      if (networkId !== 3) {
        window.alert('Please Select the correct Network');
        window.location.reload();
      }
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAccountAddress(accounts[0]);
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
    }
  };

  // const connectWallet = async () => {
  //   console.log('Connecting Wallet');
  //   try {
  //     if (!ethereum) {
  //       sethaveMetamask(false);
  //     }
  //     const accounts = await ethereum.request({
  //       method: 'eth_requestAccounts',
  //     });
  //     setAccountAddress(accounts[0]);
  //     setIsConnected(true);
  //   } catch (error) {
  //     setIsConnected(false);
  //   }
  // };

  const loadBlockchainData = async () => {
    setLoading(true);

    const accounts = await web3.eth.getAccounts();

    if (accounts.length === 0) {
      return;
    }
    setAccount(accounts[0]);
    const networkId = await web3.eth.net.getId();
    if (networkId === 3) {
      const contract = new web3.eth.Contract(abi, contractAddress);

      const endTime = await contract.methods.GetEndingTime().call();
      setEndTime(endTime);

      if (refresh === 1) {
        setrefresh(0);
        loadBlockchainData();
      }

      const TokenName = await contract.methods.GetTokenName().call();
      setTokenName(TokenName);

      const GetSymbol = await contract.methods.GetSymbol().call();
      setTokenSymbol(GetSymbol);

      const decimalss = await contract.methods.decimalss().call();
      setdecimals(decimalss);

      const TotalSupply = await contract.methods.OverAllTotalSupply().call();
      settotalSupply(TotalSupply);

      const CheckingRemainingPresaleTokens = await contract.methods
        .CheckingRemainingPresaleTokens()
        .call();
      setremainingPreSaleTokens(CheckingRemainingPresaleTokens);

      const Price = await contract.methods.getPriceOFPresaleToken().call();
      const priceInEth = await web3.utils.fromWei(Price, 'ether');
      setPrice(priceInEth);

      const StartTime = await contract.methods.GetStartTimeofPresale().call();
      setStartTime(StartTime);

      let isSaleopen = await contract.methods.Sale().call();
      setisSaleopen(isSaleopen);

      const noOPSH = await contract.methods.numberOfPresaleHolders().call();
      setNOPH(noOPSH);

      const balanceofuser = await contract.methods
        .balanceOf(accounts[0])
        .call();
      const balanceofuserinwei = await web3.utils.fromWei(
        balanceofuser,
        'ether'
      );
      setBalance(balanceofuserinwei);

      setLoading(false);
    } else {
      <></>;
    }
  };

  // web3.eth.net.getId().then(console.log('ChainId'));

  // const changeininputfield = (e) => {
  //   setinputfieldchange(e.target.value);
  // };

  // const onsubmit = async () => {
  //   if (parseInt(inputfieldchange) > 0) {
  //     await onsendbuytransaction(inputfieldchange);
  //   } else {
  //     window.alert('null value not allowed');
  //   }
  // };

  // const onsendbuytransaction = async (i) => {
  //   const web3 = new Web3(window.ethereum);

  //   const contract = new web3.eth.Contract(abi, contractAddress);

  //   const amountofethinwei = i + '';

  //   await contract.methods
  //     .BuyTokens(i)
  //     .send({ from: account, value: amountofethinwei })
  //     .once('recepient', (recepient) => {
  //       window.alert('sucess');
  //     })
  //     .on('error', () => {
  //       window.alert('error ');
  //     });
  // };

  // const walletAddress = async () => {
  //   await window.ethereum.request({
  //     method: 'eth_requestAccounts',
  //     params: [{ eth_accounts: {} }],
  //   });
  //   window.location.reload();
  // };

  // new Time

  // const dateTimeAfterThreeDays = NOW_IN_MS + getEndTime;

  // console.log(time, 'timeeee');

  let newTime = getEndTime * 1000;
  let expireTime = new Date(newTime);
  // setTime(expireTime);
  console.log(getStartTime, 'start timeeee');
  console.log(getEndTime, 'end timeeee');
  console.log(expireTime, 'expireTimeeee');

  const changeininputfield = (e) => {
    //it will call whenever data is entered in input field
    console.log(e.target.value);
    setinputfieldchange(e.target.value); // here we set the value while setting input field change
  };

  const onSendBuyTransaction = async (i) => {
    // while calling this function user enter the amount of tokens he want
    // amount of tokens
    const web3 = new Web3(window.ethereum);

    const contract = new web3.eth.Contract(abi, contractAddress);

    const amountofethinwei = i + '';

    await contract.methods
      .BuyTokens(i) //here we call our smart contract function which is BuyTokens
      .send({ from: account, value: amountofethinwei }) // here we wrap it and send transaction from account who
      .once('recepient', (recepient) => {
        //call it and value how much amount they
        window.alert('sucess');
      })
      .on('error', () => {
        // window.alert('error ');
        toast.error('Transaction Cancelled or Failed.');
      });
    // await Hello.methods.setCompleted(a.toString()).send({ from: account }).once("recepient", (recepient) => {
    //     console.log("success");
    //   })
    // .on("error", () => {
    //   console.log("error");
    // });
  };

  const onSubmit = async () => {
    // when button is clicked it call function which is
    console.log(parseInt(inputfieldchange)); //onsendbuytransaction and value comes from input field change
    if (parseInt(inputfieldchange) > 0) {
      await onSendBuyTransaction(inputfieldchange); // finally here we call our main buy transaction function
    } else {
      window.alert('null value not allowed');
    }
  };

  useEffect(() => {
    if (accountAddress && isConnected) {
      loadBlockchainData();
    }
  }, [refresh, accountAddress, isConnected, getEndTime]);

  return (
    <div className="Navbar_div">
      <div className="body1 header" style={{ height: '100vh' }}>
        <div>
          <div className="navbar-mainscreen">
            <nav
              style={{ backgroundColor: 'transparent', paddingTop: '1.75rem' }}
              className="navbar navbar-expand-lg"
            >
              <div className="container">
                <div>
                  <a className="navbar-brand nav-logo" href="/">
                    PHOINIX Token Pre-Sale
                  </a>
                </div>
                <button className="connectButton" onClick={connectWallet}>
                  {isConnected && accountAddress
                    ? `${accountAddress.slice(0, 4)}...${accountAddress.slice(
                        accountAddress.length - 4
                      )}`
                    : 'Connect Wallet'}
                </button>
              </div>
            </nav>
          </div>
          {/* <!-- mobile navbar --> */}
          <div className="mobile-nav">
            <div className="container">
              <div className="row">
                <div
                  className="col-md-4 col-sm-4 col-4"
                  data-bs-toggle="offcanvas"
                  href="#offcanvasExample"
                  role="button"
                  aria-controls="offcanvasExample"
                >
                  <div className="toggle-icon">
                    <span className="toggle-line"></span>
                    <span className="toggle-line"></span>
                    <span className="toggle-line"></span>
                    <span className="toggle-line"></span>
                  </div>
                  <div
                    className="offcanvas offcanvas-start b-offcanvaswidth"
                    tabIndex="-1"
                    id="offcanvasExample"
                    aria-labelledby="offcanvasExampleLabel"
                  >
                    <div className="b-titlemain">
                      <h5
                        className="offcanvas-title b-title"
                        id="offcanvasExampleLabel"
                      >
                        PHOINIX Token Pre-Sale
                      </h5>
                      <div style={{ textAlign: 'end' }}>
                        {' '}
                        <button
                          type="button"
                          className="b-button-close"
                          data-bs-dismiss="offcanvas"
                          aria-label="Close"
                        >
                          {' '}
                          X{' '}
                        </button>
                      </div>
                    </div>
                    <div className="offcanvas-body">
                      <ul className="navbar-nav nav-itempading">
                        <li className="nav-item">
                          <a
                            className="nav-link active"
                            aria-current="page"
                            href="#"
                          >
                            Home
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div
                  className="col-md-4 col-sm-4 col-4"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <a className="navbar-brand nav-logo" href="/">
                      PHOINIX Token Pre-Sale
                    </a>
                  </div>
                </div>
                <div
                  className="col-md-4 col-sm-4 col-4"
                  style={{ textAlign: 'end' }}
                ></div>
              </div>
            </div>
          </div>
          <div
            className="container d-flex justify-content-center align-items-center w-100"
            style={{ height: '85vh' }}
          >
            <div className="row d-flex flex-row align-items-center justify-content-between">
              <div className="col-lg-6 col-md-12 col-sm-12">
                <h1 className="heading-header">
                  Phoinix Token Pre Sale <br /> is live!
                </h1>
                <p className="header-p">
                  Fox Finance is a deflationary reflection token on the Binance
                  Smart Chain that joins investors, innovative decentralized
                  products, and the wild world around us in a common mission.
                </p>
              </div>
              {accountAddress && isConnected && (
                <div className="col-lg-5 col-md-12 col-sm-12 tokenSaleCard p-3">
                  <h3 className="p-3">Token Sale Ends In:</h3>
                  <CountdownTimer targetDate={expireTime} />
                  <div className="tokenDetails">
                    <p>
                      Token Name: <span>{TokenName}</span>
                    </p>
                    <p>
                      Token Symbol: <span>{TokenSymbol}</span>
                    </p>
                    <p>
                      Token Decimals: <span>{decimals}</span>
                    </p>
                    <p>
                      Total Supply: <span>{totalSupply}</span>
                    </p>
                    <p>
                      Remaining Pre-Sale Tokens:{' '}
                      <span>{remainingPreSaleTokens}</span>
                    </p>
                    <p>
                      Price of Presale token 100 tokens per
                      <span>{getPrice}</span> Ether
                    </p>
                    <p>
                      No Of Presale Holders are: <span>{getNOPH}</span>
                    </p>
                    <p>
                      Balance is: <span>{getBalance}</span>
                    </p>
                    <div className="w-100 mt-3">
                      <input
                        className="inputAmount"
                        placeholder="Input Amount of Tokens"
                        value={inputfieldchange}
                        onChange={changeininputfield}
                      />
                      <button className="buyButton" onClick={onSubmit}>
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresalePage;
