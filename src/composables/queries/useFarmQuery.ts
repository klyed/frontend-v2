import { computed, reactive } from 'vue';
import { useQuery } from 'vue-query';
import { QueryObserverOptions } from 'react-query/core';
import useTokens from '@/composables/useTokens';
import QUERY_KEYS from '@/constants/queryKeys';
import { Farm } from '@/services/balancer/subgraph/types';
import useApp from '../useApp';
import { farmSubgraphClient } from '@/services/balancer/subgraph/farm-subgraph.client';

export default function useFarmQuery(
  id: string,
  options: QueryObserverOptions<Farm> = {}
) {
  /**
   * COMPOSABLES
   */
  const { dynamicDataLoading } = useTokens();
  const { appLoading } = useApp();

  /**
   * COMPUTED
   */
  const enabled = computed(
    () => !appLoading.value && !dynamicDataLoading.value
  );

  /**
   * QUERY INPUTS
   */
  const queryKey = QUERY_KEYS.Farms.Current(id);

  const queryFn = async () => {
    const data = await farmSubgraphClient.getFarm(id);

    if (!data.farm) {
      throw new Error('Could not load farm');
    }

    return data.farm;
  };

  const queryOptions = reactive({
    enabled,
    ...options
  });

  return useQuery<Farm>(queryKey, queryFn, queryOptions);
}
