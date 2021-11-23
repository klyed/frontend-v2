export type NetworkId = 1 | 3 | 4 | 5 | 42 | 137 | 250 | 43113 | 43114;

export enum Network {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GÖRLI = 5,
  KOVAN = 42,
  POLYGON = 137,
  FANTOM = 250,
  FUJI = 43113,
  AVALANCHE = 43114
}

export const APP_NETWORK_ID = Number(process.env.VUE_APP_NETWORK) as NetworkId;
