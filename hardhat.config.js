require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/ZaIzfIQC1UwxSyO9HC8MD",
      accounts: ["8ddd4c0abc3316d697632a85ce50f76f91238e6ed60944ed55b987757d889dde"],
    },
  }
};
