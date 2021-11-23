export type QueryArgs = Record<string, any>;
export type QueryAttrs = Record<string, any>;
export type QueryBuilder = (
  args?: QueryArgs,
  attrs?: QueryAttrs
) => Record<string, any>;

export enum PoolType {
  Weighted = 'Weighted',
  Stable = 'Stable',
  MetaStable = 'MetaStable'
}
export type TimeTravelPeriod = '24h';

export interface PoolToken {
  address: string;
  symbol: string;
  balance: string;
  weight: string;
  priceRate?: string;
}

export interface Pool {
  id: string;
  name: string;
  address: string;
  poolType: PoolType;
  swapFee: string;
  owner: string;
  factory: string;
  tokens: PoolToken[];
  tokensList: string[];
  tokenAddresses: string[];
  totalLiquidity: string;
  totalShares: string;
  totalSwapFee: string;
  totalSwapVolume: string;
  hasLiquidityMiningRewards: boolean;
  swapEnabled?: boolean;
}

export interface DecoratedPool extends Pool {
  dynamic: {
    period: TimeTravelPeriod;
    volume: string;
    apr: PoolApr;
    fees: string;
  };
}

export interface PoolApr {
  pool: string;
  liquidityMining: string;
  total: string;
}

export interface OnchainTokenData {
  balance: string;
  weight: number;
  decimals: number;
  logoURI: string;
  name: string;
  symbol: string;
}

export interface OnchainPoolData {
  tokens: Record<string, OnchainTokenData>;
  totalSupply: string;
  decimals: number;
  swapFee: string;
  amp?: string;
}

export interface FullPool extends DecoratedPool {
  onchain: OnchainPoolData;
}

export interface PoolShare {
  poolId: {
    id: string;
  };
  balance: string;
}

export interface DecoratedPoolWithShares extends DecoratedPool {
  shares: string;
  farm?: DecoratedFarm;
}

export type PoolActivityType = 'Join' | 'Exit';

export interface PoolActivity {
  amounts: string[];
  timestamp: number;
  tx: string;
  type: PoolActivityType;
}

export interface PoolSnapshot {
  pool: {
    id: string;
  };
  timestamp: number;
  amounts: string[];
  totalShares: string;
  swapVolume: string;
  swapFees: string;
}

export type PoolSnapshots = Record<number, PoolSnapshot>;

export interface Farm {
  id: string;
  pair: string;
  allocPoint: number;
  slpBalance: string;
  masterChef: {
    id: string;
    totalAllocPoint: number;
    embrPerBlock: string;
  };
}

export interface FarmUser {
  id: string;
  pendingEmbr: number;
  pendingEmbrValue: number;
  amount: number;
  rewardDebt: number;
  embrHarvested: number;
  pool: {
    id: string;
  };
}

export interface DecoratedFarm extends Farm {
  tvl: number;
  rewards: number;
  stake: number;
  pendingEmbr: number;
  pendingEmbrValue: number;
  apr: number;
  share: number;
}

export interface DecoratedPoolWithFarm extends DecoratedPool {
  farm?: DecoratedFarm;
}

export interface DecoratedPoolWithRequiredFarm extends DecoratedPool {
  farm: DecoratedFarm;
}

export interface SubgraphSwap {
  id: string;
  tokenIn: string;
  tokenInSym: string;
  tokenOut: string;
  tokenOutSym: string;
  tokenAmountIn: string;
  tokenAmountOut: string;
  poolId: {
    id: string;
  };
  userAddress: {
    id: string;
  };
  timestamp: number;
}

export interface SubgraphTokenPrice {
  id: string;
  asset: string;
  amount: string;
  pricingAsset: string;
  price: string;
  block: string;
  timestamp: number;
}

export interface SubgraphBalancer {
  poolCount: number;
  totalLiquidity: number;
  totalSwapFee: number;
  totalSwapVolume: number;
}
