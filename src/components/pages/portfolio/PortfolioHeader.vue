<template>
  <div class="mb-16 flex">
    <div class="flex-1">
      <h2 class="text-green-500 mb-2">My Portfolio</h2>
      <BalLoadingBlock v-if="isLoading" class="h-10 w-40" />
      <h2 class="text-5xl font-light" v-else>
        ${{ numeral(data.totalValue).format('0,0.00') }}
      </h2>
    </div>

    <template v-if="isLoading">
      <BalLoadingBlock
        v-for="n in 2"
        :key="n"
        :class="['h-28', 'w-48', n === 1 ? 'mr-4' : '']"
      />
    </template>
    <template v-else>
      <BalCard class="w-48 mr-4">
        <div class="text-sm text-gray-500 font-medium mb-2 text-left">
          Pending Rewards
        </div>
        <div class="text-xl font-medium truncate flex items-center">
          <div>{{ farmData.pendingEmbr }}&nbsp;</div>
          <div class="text-sm text-gray-500 font-medium mt-1 text-left">
            EMBR
          </div>
        </div>
        <div class="text-sm text-gray-500 font-medium mt-1 text-left">
          {{ farmData.pendingEmbrValue }}
        </div>
      </BalCard>
      <BalCard class="w-48">
        <div class="text-sm text-gray-500 font-medium mb-2 text-left">
          Average APR
        </div>
        <div class="text-xl font-medium truncate flex items-center">
          {{ farmData.apr }}
        </div>
        <div class="text-sm text-gray-500 font-medium mt-1 text-left">
          {{ farmData.dailyEmbr }} EMBR / day
        </div>
      </BalCard>
    </template>
    <!--    <BalCard class="w-44" v-if="tvl">
      <div class="text-sm text-gray-500 font-medium mb-2">
        TVL
      </div>
      <div class="text-xl font-medium truncate flex items-center">
        ${{ fNum(tvl, 'usd_lg') }}
      </div>
    </BalCard>-->
    <!--    <BalCard class="mr-2 w-48">
      <div class="text-sm text-gray-500 font-medium mb-2">
        EMBR Price
      </div>
      <div class="text-xl font-medium truncate flex items-center">
        $1.48
      </div>
      <div class="text-sm text-gray-500 font-medium mt-1">
        MC: $8,450,000
      </div>
    </BalCard>
    <BalCard class="w-48">
      <div class="text-sm text-gray-500 font-medium mb-2">
        Circulating Supply
      </div>
      <div class="text-xl font-medium truncate flex items-center">
        7,724,530
      </div>
      <div class="text-sm text-gray-500 font-medium mt-1">
        5.05 EMBR/block
      </div>
    </BalCard>-->
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import numeral from 'numeral';
import { UserPortfolioData } from '@/services/embr/embr-types';
import useNumbers from '@/composables/useNumbers';
import useProtocolDataQuery from '@/composables/queries/useProtocolDataQuery';
import { DecoratedPoolWithRequiredFarm } from '@/services/balancer/subgraph/types';
import { sumBy } from 'lodash';

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<UserPortfolioData>,
      required: true
    },
    pools: {
      type: Array as PropType<DecoratedPoolWithRequiredFarm[]>,
      required: true
    },
    isLoading: {
      type: Boolean
    }
  },
  components: {
    //BalCard
  },
  setup(props) {
    const { fNum } = useNumbers();
    const protocolDataQuery = useProtocolDataQuery();

    const tvl = computed(
      () => protocolDataQuery.data?.value?.totalLiquidity || 0
    );

    const embrPrice = computed(
      () => protocolDataQuery.data?.value?.embrPrice || 0
    );

    const farmData = computed(() => {
      const farms = props.pools.map(pool => pool.farm);

      const averageApr =
        sumBy(farms, farm => farm.apr * (farm.stake || 0)) /
        sumBy(farms, farm => farm.stake || 0);
      const dailyApr = averageApr / 365;
      const totalBalance = sumBy(farms, farm => farm.stake || 0);

      return {
        numFarms: farms.filter(farm => farm.stake > 0).length,
        totalBalance: fNum(totalBalance, 'usd'),
        pendingEmbr: numeral(sumBy(farms, farm => farm.pendingEmbr)).format(
          '0,0.[0000]'
        ),
        pendingEmbrValue: fNum(
          sumBy(farms, farm => farm.pendingEmbrValue),
          'usd'
        ),
        apr: fNum(averageApr, 'percent'),
        dailyApr: fNum(dailyApr, 'percent'),
        dailyEmbr: embrPrice.value
          ? fNum((dailyApr * totalBalance) / embrPrice.value)
          : 0
      };
    });

    const hasFarmRewards = computed(
      () => props.pools.filter(pool => pool.farm.stake > 0).length > 0
    );

    return {
      //refs

      numeral,
      fNum,
      tvl,
      farmData,
      hasFarmRewards
    };
  }
});
</script>
