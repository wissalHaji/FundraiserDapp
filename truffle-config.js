const path = require("path");

const HDWalletProvider = require("@truffle/hdwallet-provider");

// const fs = require("fs");
// const secrets = JSON.parse(fs.readFileSync(".secrets.json").toString().trim());

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777",
    },
    // kovan: {
    //   networkCheckTimeout: 10000,
    //   provider: () => {
    //     return new HDWalletProvider(
    //       secrets.mnemonic,
    //       `wss://kovan.infura.io/ws/v3/${secrets.projectId}`
    //     );
    //   },
    //   network_id: "42",
    // },
  },

  mocha: {
    reporter: "eth-gas-reporter",
  },
  compilers: {
    solc: {
      version: "0.7.4", // A version or constraint - Ex. "^0.5.0"
      // Can also be set to "native" to use a native solc
      // docker: false, // Use a version obtained through docker
      // parser: "solcjs",  // Leverages solc-js purely for speedy parsing
      // settings: {
      //   optimizer: {
      //     enabled: false,
      //     runs: 0   // Optimize for how many times you intend to run the code
      //   },
      //   evmVersion: "" // Default: "petersburg"
      // }
    },
  },
};
