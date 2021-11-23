import { computed } from 'vue';
import usePortfolioQuery from '@/composables/embr/usePortfolioQuery';
import { UserPortfolioData } from '@/services/embr/embr-types';

export default function usePortfolio() {
  const portfolioQuery = usePortfolioQuery();

  const portfolio = computed(
    (): UserPortfolioData => {
      if (!portfolioQuery.data.value?.portfolio) {
        return {
          totalValue: 0,
          timestamp: 0,
          tokens: [],
          totalSwapFees: 0,
          totalSwapVolume: 0,
          pools: [],
          myFees: 0
        };
      }

      return portfolioQuery.data.value.portfolio;
    }
  );

  const portfolioHistory = computed((): UserPortfolioData[] => {
    return portfolioQuery.data.value?.history || [];
  });

  const isLoadingPortfolio = computed(
    () => portfolioQuery.isLoading.value || portfolioQuery.isIdle.value
  );

  return {
    portfolio,
    portfolioHistory,
    isLoadingPortfolio
  };
}
