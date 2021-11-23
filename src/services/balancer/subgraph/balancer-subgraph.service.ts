import { balancerSubgraphClient } from './balancer-subgraph.client';
import { rpcProviderService as _rpcProviderService } from '@/services/rpc-provider/rpc-provider.service';
import Pools from './entities/pools';
import PoolShares from './entities/poolShares';
import PoolActivities from './entities/poolActivities';
import PoolSnapshots from './entities/poolSnapshots';
import Swaps from './entities/swaps';
import TokenPrices from './entities/tokenPrices';
import Balancers from '@/services/balancer/subgraph/entities/balancers';

const NETWORK = process.env.VUE_APP_NETWORK || '43113';

export default class BalancerSubgraphService {
  pools: Pools;
  poolShares: PoolShares;
  poolActivities: PoolActivities;
  poolSnapshots: PoolSnapshots;
  swaps: Swaps;
  tokenPrices: TokenPrices;
  balancers: Balancers;

  constructor(
    readonly client = balancerSubgraphClient,
    readonly rpcProviderService = _rpcProviderService
  ) {
    // Init entities
    this.pools = new Pools(this);
    this.poolShares = new PoolShares(this);
    this.poolActivities = new PoolActivities(this);
    this.poolSnapshots = new PoolSnapshots(this);
    this.swaps = new Swaps(this);
    this.tokenPrices = new TokenPrices(this);
    this.balancers = new Balancers(this);
  }

  public get blockTime(): number {
    switch (NETWORK) {
      case '1':
        return 13;
      case '137':
        return 2;
      case '42':
        // Should be ~4s but this causes subgraph to return with unindexed block error.
        return 1;
      case '43113':
        return 1;
      case '250':
        return 1;
      default:
        return 13;
    }
  }
}

export const balancerSubgraphService = new BalancerSubgraphService();
