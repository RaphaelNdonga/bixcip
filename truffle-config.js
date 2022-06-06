module.exports = {
  // Uncommenting the defaults below
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks.
  // See details at: https://trufflesuite.com/docs/truffle/reference/configuration
  // on how to specify configuration options!
  //
  compilers: {
    solc: {
      version: "0.8.7",
    },
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    test: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    // Dashboard assumes mumbai network will be selected
    dashboard: {
      port: 24012,
      host: "localhost",
      vrfCoordinator: "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed",
      keyHash: "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f",
      linkToken: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"
    }
  },
  //
  // Truffle DB is currently disabled by default; to enable it, change enabled:
  // false to enabled: true. The default storage location can also be
  // overridden by specifying the adapter settings, as shown in the commented code below.
  //
  // NOTE: It is not possible to migrate your contracts to truffle DB and you should
  // make a backup of your artifacts to a safe location before enabling this feature.
  //
  // After you backed up your artifacts you can utilize db by running migrate as follows:
  // $ truffle migrate --reset --compile-all
  //
  // db: {
  // enabled: false,
  // host: "127.0.0.1",
  // adapter: {
  //   name: "sqlite",
  //   settings: {
  //     directory: ".db"
  //   }
  // }
  // }
};
