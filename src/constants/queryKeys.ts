import { Ref } from 'vue';
import { GetAmountsOutInput } from '@/services/dex/dex-contract-types';
export const POOLS_ROOT_KEY = 'pools';
export const FARMS_ROOT_KEY = 'farms';
export const BALANCES_ROOT_KEY = 'accountBalances';
export const CLAIMS_ROOT_KEY = 'claims';
export const SWAPS_ROOT_KEY = 'swaps';
export const TOKEN_PRICES_ROOT_KEY = 'tokenPrices';

const QUERY_KEYS = {
  Farms: {
    All: ['farms', 'all'],
    Current: (id: string) => [FARMS_ROOT_KEY, 'current', { id }],
    ApprovalRequired: (token: string) => [
      FARMS_ROOT_KEY,
      'approvalRequired',
      { token }
    ],
    User: (id: string, account: Ref<string>) => [
      FARMS_ROOT_KEY,
      'user',
      { id, account }
    ],
    UserAllFarms: (account: Ref<string>) => [
      FARMS_ROOT_KEY,
      'userAllFarms',
      { account }
    ],
    TokenBalance: (address: string) => [
      FARMS_ROOT_KEY,
      'token-balance',
      { address }
    ]
  },
  Pools: {
    All: (tokens: Ref<string[]>, poolIds: Ref<string[]> | undefined) => [
      POOLS_ROOT_KEY,
      'all',
      { tokens, poolIds }
    ],
    User: (account: Ref<string>) => [POOLS_ROOT_KEY, 'user', { account }],
    Current: (id: string) => [POOLS_ROOT_KEY, 'current', { id }],
    Snapshot: (id: string) => [POOLS_ROOT_KEY, 'snapshot', { id }],
    Activities: (id: string) => [POOLS_ROOT_KEY, 'activities', 'all', { id }],
    UserActivities: (id: string, account: Ref<string>) => [
      POOLS_ROOT_KEY,
      'activities',
      'user',
      { account, id }
    ]
  },
  Swaps: {
    Current: (poolIds: Ref<string[]> | undefined) => [
      SWAPS_ROOT_KEY,
      'current',
      { poolIds }
    ]
  },
  TokenPrices: {
    Current: (poolId: Ref<string>, asset: Ref<string>) => [
      TOKEN_PRICES_ROOT_KEY,
      'current',
      { poolId, asset }
    ]
  },
  TokenLists: {
    All: ['tokenLists', 'all']
  },
  Config: {
    All: ['config', 'all']
  },
  Claims: {
    All: (account: Ref<string>) => [CLAIMS_ROOT_KEY, { account }]
  },
  Tokens: {
    Prices: (tokens: Ref<string[]>) => ['tokens', 'prices', { tokens }]
  },
  Account: {
    Balances: (account: Ref<string>, tokens: Ref<string[]>) => [
      'account',
      'balances',
      { account, tokens }
    ],
    Allowances: (
      account: Ref<string>,
      contractAddresses: Ref<string[]>,
      tokens: Ref<string[]>
    ) => ['account', 'allowances', { account, contractAddresses, tokens }],
    RelayerApprovals: (account: Ref<string>, relayer: Ref<string>) => [
      'account',
      'relayer',
      { account, relayer }
    ],
    Profile: (account: Ref<string>, chainId: Ref<number | undefined>) => [
      'account',
      'profile',
      { account, chainId }
    ],
    Portfolio: (account: Ref<string>, chainId: Ref<number | undefined>) => [
      'account',
      'portfolio',
      { account, chainId }
    ]
  },
  App: {
    Chains: ['evm_chains']
  },
  ProtocolData: {
    All: ['protocolData', 'all']
  },
  Dexes: {
    GetAmountsOut: ['Dexes', 'GetAmountsOut', 'all']
  }
};

export default QUERY_KEYS;
