<template>
  <div class="lg:container lg:mx-auto pt-24 md:pt-16">
    <template v-if="isWalletReady && userPools && userPools.length > 0">
      <div class="px-4 lg:px-0">
        <h3 class="mb-2">My Investments</h3>
        <BalAlert
          v-if="hasUnstakedBpt"
          title="You have unstaked BPT in your wallet"
          description="If you deposit your BPT into the farm, you will earn additional rewards paid out in EMBR."
          type="warning"
          size="sm"
          class=""
        />
      </div>
      <PoolsTable
        :isLoading="isLoadingUserPools"
        :data="userPools"
        :noPoolsLabel="$t('noInvestments')"
        showPoolShares
        class="mb-8"
      />
      <div class="px-4 lg:px-0" v-if="!hideV1Links">
        <div class="text-black-600">{{ $t('seeV1BalancerInvestments') }}</div>
        <BalLink :href="EXTERNAL_LINKS.Balancer.PoolsV1Dashboard" external>{{
          $t('goToBalancerV1Site')
        }}</BalLink>
      </div>
      <div class="mb-16" />
    </template>

    <div class="px-4 lg:px-0">
      <h3 class="mb-3">Beethoven-X Investment Pools</h3>
      <TokenSearchInput
        v-model="selectedTokens"
        :loading="isLoadingPools"
        @add="addSelectedToken"
        @remove="removeSelectedToken"
      />
    </div>
    <PoolsTable
      :isLoading="isLoadingPools"
      :data="filteredPools"
      :noPoolsLabel="$t('noPoolsFound')"
      :isPaginated="poolsHasNextPage"
      :isLoadingMore="poolsIsFetchingNextPage"
      @loadMore="loadMorePools"
      class="mb-16"
    />
    <div class="px-4 lg:px-0 mb-3 flex">
      <div class="flex-1">
        <h3>Community Investment Pools</h3>
        <p>
          Investment pools created by the community. Please DYOR before
          investing in any community pool.
        </p>
      </div>
      <BalBtn label="Compose a pool" @click="goToPoolCreate" />
    </div>
    <PoolsTable
      :isLoading="isLoadingPools"
      :data="communityPools"
      :noPoolsLabel="$t('noPoolsFound')"
      :isPaginated="poolsHasNextPage"
      :isLoadingMore="poolsIsFetchingNextPage"
      @loadMore="loadMorePools"
      class="mb-8"
    />
    <div class="px-4 lg:px-0" v-if="!hideV1Links">
      <div class="text-black-600">
        {{ $t('tableShowsBalancerV2Pools') }}
      </div>
      <BalLink :href="EXTERNAL_LINKS.Balancer.PoolsV1Explore" external>{{
        $t('exploreBalancerV1Pools')
      }}</BalLink>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { EXTERNAL_LINKS } from '@/constants/links';
import TokenSearchInput from '@/components/inputs/TokenSearchInput.vue';
import PoolsTable from '@/components/tables/PoolsTable/PoolsTable.vue';
import usePools from '@/composables/pools/usePools';
import useWeb3 from '@/services/web3/useWeb3';
import usePoolFilters from '@/composables/pools/usePoolFilters';
import { masterChefContractsService } from '@/services/farm/master-chef-contracts.service';
import BalBtn from '@/components/_global/BalBtn/BalBtn.vue';
import BalAlert from '@/components/_global/BalAlert/BalAlert.vue';
import useEmbrConfig from '@/composables/useEmbrConfig';

export default defineComponent({
  components: {
    BalAlert,
    BalBtn,
    TokenSearchInput,
    PoolsTable
  },

  setup() {
    // COMPOSABLES
    const router = useRouter();
    const { isWalletReady, isV1Supported } = useWeb3();
    const { embrConfig } = useEmbrConfig();
    const {
      selectedTokens,
      addSelectedToken,
      removeSelectedToken
    } = usePoolFilters();

    const {
      poolsWithFarms,
      onlyPoolsWithFarms,
      userPools,
      isLoadingPools,
      isLoadingUserPools,
      isLoadingFarms,
      loadMorePools,
      poolsHasNextPage,
      poolsIsFetchingNextPage
    } = usePools();

    //TODO: this will break down once pagination starts happening
    const communityPools = computed(() => {
      return poolsWithFarms.value?.filter(
        pool => !embrConfig.value.incentivizedPools.includes(pool.id)
      );
    });

    // COMPUTED
    const filteredPools = computed(() => {
      return selectedTokens.value.length > 0
        ? poolsWithFarms.value?.filter(pool => {
            return (
              selectedTokens.value.every((selectedToken: string) =>
                pool.tokenAddresses.includes(selectedToken)
              ) && embrConfig.value.incentivizedPools.includes(pool.id)
            );
          })
        : poolsWithFarms?.value.filter(pool =>
            embrConfig.value.incentivizedPools.includes(pool.id)
          );
    });

    const hideV1Links = computed(() => !isV1Supported);

    const poolsWithUserInFarm = computed(() => {
      return onlyPoolsWithFarms.value.filter(pool => pool.farm.stake > 0);
    });

    const hasUnstakedBpt = computed(() =>
      userPools.value.find(pool => pool.farm && parseFloat(pool.shares) > 0)
    );

    masterChefContractsService.embrToken.getCirculatingSupply();

    function goToPoolCreate() {
      router.push({ name: 'pool-create' });
    }

    return {
      // data
      filteredPools,
      poolsWithUserInFarm,
      userPools,
      isLoadingPools,
      isLoadingUserPools,
      isLoadingFarms,

      // computed
      isWalletReady,
      hideV1Links,
      poolsHasNextPage,
      poolsIsFetchingNextPage,
      selectedTokens,
      hasUnstakedBpt,

      //methods
      router,
      loadMorePools,
      addSelectedToken,
      removeSelectedToken,
      communityPools,
      goToPoolCreate,

      // constants
      EXTERNAL_LINKS
    };
  }
});
</script>
