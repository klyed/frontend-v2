<template>
  <BalCard
    shadow="lg"
    class="mt-4"
    :square="upToLargeBreakpoint"
    :noBorder="upToLargeBreakpoint"
    noPad
  >
    <BalTable
      :columns="columns"
      :data="pools"
      :is-loading="loading"
      skeleton-class="h-64"
      sticky="both"
      :square="upToLargeBreakpoint"
      :link="{
        to: 'farm-detail',
        getParams: pool => ({ id: pool.id })
      }"
      :on-row-click="handleRowClick"
      @load-more="$emit('loadMore')"
    >
      <template v-slot:iconColumnHeader>
        <div class="flex items-center">
          <img
            v-if="darkMode"
            :src="require('@/assets/images/icons/tokens_white.svg')"
          />
          <img
            v-else
            :src="require('@/assets/images/icons/tokens_black.svg')"
          />
        </div>
      </template>
      <template v-slot:iconColumnCell="pool">
        <div v-if="!loading" class="px-6 py-4">
          <BalAssetSet
            :addresses="orderedTokenAddressesFor(pool)"
            :width="100"
          />
        </div>
      </template>
      <template v-slot:aprCell="pool">
        <div class="px-6 py-4 -mt-1 flex justify-end">
          {{
            Number(pool.dynamic.apr.pool) > 10000
              ? '-'
              : fNum(pool.dynamic.apr.total, 'percent')
          }}
          <LiquidityMiningTooltip :pool="pool" />
        </div>
      </template>
    </BalTable>
  </BalCard>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  DecoratedPoolWithRequiredFarm,
  DecoratedPoolWithShares,
  PoolToken
} from '@/services/balancer/subgraph/types';
import { getAddress } from '@ethersproject/address';
import useNumbers from '@/composables/useNumbers';
import useFathom from '@/composables/useFathom';
import { ColumnDefinition } from '@/components/_global/BalTable/BalTable.vue';
import useDarkMode from '@/composables/useDarkMode';
import useBreakpoints from '@/composables/useBreakpoints';
import { isStableLike } from '@/composables/usePool';
import numeral from 'numeral';
import { calculateRewardsPerDay } from '@/lib/utils/farmHelper';
import { useI18n } from 'vue-i18n';
import LiquidityMiningTooltip from '@/components/tooltips/LiquidityMiningTooltip.vue';

export default defineComponent({
  components: {
    LiquidityMiningTooltip
  },

  emits: ['loadMore'],

  props: {
    pools: {
      type: Array as PropType<DecoratedPoolWithRequiredFarm[]>,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    },
    noPoolsLabel: {
      type: String,
      default: 'No pools'
    }
  },

  setup() {
    const { fNum } = useNumbers();
    const router = useRouter();
    const { trackGoal, Goals } = useFathom();
    const { darkMode } = useDarkMode();
    const { upToLargeBreakpoint } = useBreakpoints();
    const { t } = useI18n();

    const columns = ref<ColumnDefinition<DecoratedPoolWithRequiredFarm>[]>([
      {
        name: 'Icons',
        id: 'icons',
        accessor: 'uri',
        Header: 'iconColumnHeader',
        Cell: 'iconColumnCell',
        width: 125,
        noGrow: true
      },
      {
        name: 'Name',
        id: 'name',
        accessor: pool => pool.name,
        sortKey: pool => pool.name,
        width: 250
      },
      {
        name: 'TVL',
        id: 'tvl',
        accessor: pool =>
          fNum(pool.farm.tvl, 'usd', {
            forcePreset: true
          }),
        sortKey: pool => pool.farm.tvl,
        align: 'right',
        width: 150
      },
      {
        name: t('myBalance'),
        id: 'stake',
        accessor: pool => fNum(pool.farm.stake, 'usd'),
        sortKey: pool => pool.farm.stake,
        align: 'right',
        width: 150
      },
      {
        name: 'Pending Rewards',
        id: 'pendingEmbr',
        accessor: pool =>
          numeral(pool.farm.pendingEmbr).format('0,0.[00]') + ' EMBR',
        sortKey: pool => pool.farm.pendingEmbr,
        align: 'right',
        width: 200
      },
      {
        name: t('apr'),
        Cell: 'aprCell',
        accessor: pool => pool.dynamic.apr.total,
        align: 'right',
        id: 'poolApr',
        sortKey: pool => {
          const apr = Number(pool.dynamic.apr.total || 0);
          if (apr === Infinity || isNaN(apr)) return 0;
          return apr;
        },
        width: 150
      }
    ]);

    function orderedTokenAddressesFor(pool: DecoratedPoolWithRequiredFarm) {
      const sortedTokens = orderedPoolTokens(pool);
      return sortedTokens.map(token => getAddress(token.address));
    }

    function orderedPoolTokens(
      pool: DecoratedPoolWithRequiredFarm
    ): PoolToken[] {
      if (isStableLike(pool)) return pool.tokens;

      const sortedTokens = pool.tokens.slice();
      sortedTokens.sort((a, b) => parseFloat(b.weight) - parseFloat(a.weight));
      return sortedTokens;
    }

    function handleRowClick(pool: DecoratedPoolWithShares) {
      trackGoal(Goals.ClickPoolsTableRow);
      router.push({ name: 'farm-detail', params: { id: pool.id } });
    }

    return {
      // data
      columns,
      //data: decoratedFarms,

      // computed
      darkMode,
      upToLargeBreakpoint,

      // methods
      handleRowClick,
      getAddress,
      fNum,
      isStableLike,
      orderedTokenAddressesFor,
      calculateRewardsPerDay
    };
  }
});
</script>
