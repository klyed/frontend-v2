import { computed, reactive } from 'vue';
import { useQuery } from 'vue-query';
import { QueryObserverOptions } from 'react-query/core';
import QUERY_KEYS from '@/constants/queryKeys';
import { farmSubgraphClient } from '@/services/balancer/subgraph/farm-subgraph.client';
import useWeb3 from '@/services/web3/useWeb3';
import { FarmUser } from '@/services/balancer/subgraph/types';
import useApp from '@/composables/useApp';
import { masterChefContractsService } from '@/services/farm/master-chef-contracts.service';
import useProtocolDataQuery from '@/composables/queries/useProtocolDataQuery';
import useTokens from '@/composables/useTokens';

export default function useAllFarmsForUserQuery(
  options: QueryObserverOptions<FarmUser[]> = {}
) {
  const { account, isWalletReady, appNetworkConfig } = useWeb3();
  const { appLoading } = useApp();
  const { priceFor, dynamicDataLoading, loading } = useTokens();
  const protocolDataQuery = useProtocolDataQuery();
  const embrPrice = computed(
    () => protocolDataQuery.data?.value?.embrPrice || 0
  );
  const enabled = computed(
    () =>
      isWalletReady.value &&
      account.value != null &&
      !appLoading.value &&
      !loading.value &&
      !dynamicDataLoading.value
  );
  const queryKey = QUERY_KEYS.Farms.UserAllFarms(account);

  const queryFn = async () => {
    try {
      const userFarms = await farmSubgraphClient.getUserDataForAllFarms(
        account.value
      );
      const decoratedUserFarms: FarmUser[] = [];

      for (const userFarm of userFarms) {
        const pendingEmbr = await masterChefContractsService.masterChef.getPendingEmbrForFarm(
          userFarm.pool.id,
          account.value
        );

        const pendingRewardToken = await masterChefContractsService.hndRewarder.getPendingReward(
          userFarm.pool.id,
          account.value
        );

        const hndPrice = priceFor(appNetworkConfig.addresses.hnd);

        decoratedUserFarms.push({
          ...userFarm,
          pendingEmbr,
          pendingEmbrValue: pendingEmbr * embrPrice.value,
          pendingRewardToken,
          pendingRewardTokenValue: pendingRewardToken * hndPrice
        });
      }

      return decoratedUserFarms;
    } catch (e) {
      console.log('ERROR', e);
      return [];
    }
  };

  const queryOptions = reactive({
    enabled,
    refetchInterval: 3000,
    ...options
  });

  return useQuery<FarmUser[]>(queryKey, queryFn, queryOptions);
}
