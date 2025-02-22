<template>
  <BalPopover no-pad>
    <template v-slot:activator>
      <BalBtn
        color="white"
        class="mr-2 text-base"
        :size="upToLargeBreakpoint ? 'md' : 'sm'"
        :circle="upToLargeBreakpoint"
      >
        <StarsIcon
          :class="{ 'mr-2': !upToLargeBreakpoint }"
          v-if="
            upToLargeBreakpoint ? !(isLoadingPools && isLoadingFarms) : true
          "
        />
        <BalLoadingIcon
          size="sm"
          v-if="harvesting || isLoadingPools || isLoadingFarms"
        />
        <span class="hidden lg:block" v-else>{{
          data.pendingRewardValue
        }}</span>
      </BalBtn>
    </template>
    <div class="w-80 sm:w-96">
      <h5 class="text-lg mb-3 px-3 pt-3">
        Farm Incentives
      </h5>
      <BalCard class="mx-2 mb-2">
        <div class="text-sm text-gray-500 font-medium mb-2 text-left">
          Pending Rewards
        </div>
        <div class="text-xl font-medium truncate flex items-center">
          {{ data.pendingEmbr }}
        </div>
        <div class="text-sm text-gray-500 font-medium mt-1 text-left">
          {{ data.pendingRewardValue }}
        </div>
      </BalCard>
      <div class="grid grid-cols-2 gap-x-2 gap-y-2 px-2">
        <BalCard class="">
          <div class="text-sm text-gray-500 font-medium mb-2 text-left">
            Total Deposit
          </div>
          <div class="text-xl font-medium truncate flex items-center">
            {{ data.totalBalance }}
          </div>
          <div class="text-sm text-gray-500 font-medium mt-1 text-left">
            {{ data.numFarms }} {{ data.numFarms === 1 ? 'Farm' : 'Farms' }}
          </div>
        </BalCard>
        <BalCard>
          <div class="text-sm text-gray-500 font-medium mb-2 text-left">
            Average APR
          </div>
          <div class="text-xl font-medium truncate flex items-center">
            {{ data.apr }}
          </div>
          <div class="text-sm text-gray-500 font-medium mt-1 text-left">
            {{ data.dailyApr }} Daily
          </div>
        </BalCard>
      </div>
      <div class="mx-2 mb-2 mt-2">
        <BalBtn
          type="submit"
          loading-label="Harvesting"
          :disabled="!hasFarmRewards"
          :loading="harvesting"
          @click="harvestAllRewards"
          class="w-full"
        >
          Harvest All Rewards
        </BalBtn>
      </div>
    </div>
  </BalPopover>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';
import { Alert } from '@/store/modules/alerts';
import useNumbers from '@/composables/useNumbers';
import { sumBy } from 'lodash';
import numeral from 'numeral';
import usePools from '@/composables/pools/usePools';
import useEthers from '@/composables/useEthers';
import useWeb3 from '@/services/web3/useWeb3';
import useBreakpoints from '@/composables/useBreakpoints';

export default defineComponent({
  name: 'NavAlert',

  props: {
    alert: { type: Object as PropType<Alert>, required: true }
  },

  setup(props) {
    const { isWalletReady } = useWeb3();
    const { txListener } = useEthers();
    const { fNum } = useNumbers();
    const {
      isLoadingPools,
      isLoadingFarms,
      onlyPoolsWithFarms,
      harvestAllFarms,
      refetchFarmsForUser
    } = usePools();
    const harvesting = ref(false);
    const { upToLargeBreakpoint } = useBreakpoints();

    const data = computed(() => {
      const farms = onlyPoolsWithFarms.value.map(pool => pool.farm);
      const pendingEmbrValue = sumBy(farms, farm => farm.pendingEmbrValue);

      const averageApr =
        sumBy(farms, farm => farm.apr * (farm.stake || 0)) /
        sumBy(farms, farm => farm.stake || 0);

      return {
        numFarms: farms.filter(farm => farm.stake > 0).length,
        totalBalance: fNum(
          sumBy(farms, farm => farm.stake || 0),
          'usd'
        ),
        pendingEmbr:
          numeral(sumBy(farms, farm => farm.pendingEmbr)).format('0,0.[0000]') +
          ' EMBR',
        pendingRewardValue: fNum(pendingEmbrValue, 'usd'),
        apr: fNum(averageApr, 'percent'),
        dailyApr: fNum(averageApr / 365, 'percent')
      };
    });

    const hasFarmRewards = computed(
      () =>
        onlyPoolsWithFarms.value.filter(pool => pool.farm.stake > 0).length > 0
    );

    async function harvestAllRewards(): Promise<void> {
      const farmIds = onlyPoolsWithFarms.value
        .filter(pool => pool.farm.stake > 0)
        .map(pool => pool.farm.id);

      harvesting.value = true;
      const tx = await harvestAllFarms(farmIds);

      if (!tx) {
        harvesting.value = false;
        return;
      }

      txListener(tx, {
        onTxConfirmed: async () => {
          await refetchFarmsForUser();
          harvesting.value = false;
        },
        onTxFailed: () => {
          harvesting.value = false;
        }
      });
    }

    return {
      data,
      hasFarmRewards,
      fNum,
      harvestAllRewards,
      harvesting,
      upToLargeBreakpoint,
      isLoadingPools,
      isLoadingFarms
    };
  }
});
</script>

<style>
.app-nav-alert {
  @apply flex items-center justify-between py-4 px-6;
}
</style>
