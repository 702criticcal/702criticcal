const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = "elbow shield card century suffer coconut fatigue alarm slim seminar slush clutch";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic,
          "https://ropsten.infura.io/v3/b7daab19a5ce43dd98dc7318facf3a18")
      },
      network_id: 3
    },
    develop: {
      port: 8545
    }
  }
};
