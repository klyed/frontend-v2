import { computed } from 'vue';
import useEmbrConfigQuery from '@/composables/queries/useEmbrConfigQuery';
import { EmbrConfig } from '@/services/embr/embr.service';

export default function useEmbrConfig() {
  const embrConfigQuery = useEmbrConfigQuery();

  const embrConfigLoading = computed(
    () => embrConfigQuery.isLoading.value || embrConfigQuery.isIdle.value
  );

  const embrConfig = computed(
    (): EmbrConfig =>
      embrConfigQuery.data.value
        ? embrConfigQuery.data.value
        : { incentivizedPools: [], blacklistedPools: [], pausedPools: [] }
  );

  return {
    embrConfigLoading,
    embrConfig
  };
}
