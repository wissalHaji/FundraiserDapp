import Web3 from "web3";
import Factory from "../contracts/FundraiserFactory.json";

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.enable();
          // Acccounts now exposed
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        // Use Mist/MetaMask's provider.
        const web3 = window.web3;
        console.log("Injected web3 detected.");
        resolve(web3);
      }
      // Fallback to localhost; use dev console port by default...
      else {
        // const provider = new Web3.providers.HttpProvider(
        //   "http://127.0.0.1:8545"
        // );
        // const web3 = new Web3(provider);
        // resolve(web3);
        console.log("No web3 instance injected.");
        reject("You must install MetaMask in order to use the Dapp");
      }
    });
  });

const getFactory = async (web3) => {
  const networkId = await web3.eth.net.getId();
  // in production need to check that its the main network
  const deployedNetwork = await Factory.networks[networkId];
  if (deployedNetwork) {
    const factory = new web3.eth.Contract(Factory.abi, deployedNetwork.address);
    return factory;
  } else
    throw Error(
      "The contract is not deployed in the network you're connected to."
    );
};

export { getWeb3, getFactory };
