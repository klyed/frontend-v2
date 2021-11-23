<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <template v-if="loading">
      <BalLoadingBlock v-for="n in 3" :key="n" class="h-28" />
    </template>
    <template v-else>
      <BalCard>
        <div class="text-sm text-gray-500 font-medium mb-2">
          EMBR Price
        </div>
        <div class="text-xl font-medium flex items-center">
          ${{ numeral(embrPrice).format('0.[0000]') }}
        </div>
      </BalCard>
      <BalCard>
        <div class="text-sm text-gray-500 font-medium mb-2">
          Market Cap
        </div>
        <div class="text-xl font-medium truncate flex items-center">
          ${{ fNum(marketCap, 'usd_lg') }}
        </div>
      </BalCard>
      <BalCard>
        <div class="text-sm text-gray-500 font-medium mb-2">
          Circulating Supply
        </div>
        <div class="text-xl font-medium flex items-end relative">
          <div>{{ fNum(circulatingSupply, 'token_lg') }}&nbsp;</div>
          <div class="text-sm text-gray-500" :style="{ paddingBottom: '2px' }">
            EMBR
          </div>
        </div>
      </BalCard>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';
import useNumbers from '@/composables/useNumbers';
import { differenceInMilliseconds, format, parseISO } from 'date-fns';
import { DecoratedPool } from '@/services/balancer/subgraph/types';
import numeral from 'numeral';
import useProtocolDataQuery from '@/composables/queries/useProtocolDataQuery';

export default defineComponent({
  components: {},

  emits: ['lbpStateChange'],

  props: {
    lbpTokenName: { type: String, required: true },
    lbpTokenAddress: { type: String, required: true },
    lbpTokenStartingAmount: { type: Number, required: true },
    usdcAddress: { type: String, required: true },
    lbpStartTime: { type: String, required: true },
    lbpEndTime: { type: String, required: true },
    pool: { type: Object as PropType<DecoratedPool> },
    loading: { type: Boolean, default: true },
    isBeforeLbpStart: { type: Boolean, required: true }
  },

  setup(props) {
    const { fNum } = useNumbers();
    const harvesting = ref(false);

    const timeRemaining = computed(() =>
      props.isBeforeLbpStart
        ? differenceInMilliseconds(parseISO(props.lbpStartTime), new Date())
        : differenceInMilliseconds(parseISO(props.lbpEndTime), new Date())
    );

    const countdownDateFormatted = computed(() =>
      props.isBeforeLbpStart
        ? format(parseISO(props.lbpStartTime), 'MMM d') +
          ' at ' +
          format(parseISO(props.lbpStartTime), 'HH:mm')
        : format(parseISO(props.lbpEndTime), 'MMM d') +
          ' at ' +
          format(parseISO(props.lbpEndTime), 'HH:mm')
    );

    const countdownLabel = computed(() =>
      props.isBeforeLbpStart ? 'Starts In' : 'Ends In'
    );

    const lbpData = computed(() => {
      const tokens = props.pool?.tokens;
      const embr = tokens?.find(
        token => token.address.toLowerCase() === props.lbpTokenAddress
      );
      const usdc = tokens?.find(
        token => token.address.toLowerCase() === props.usdcAddress
      );

      if (!embr || !usdc) {
        return null;
      }

      const remaining = parseFloat(embr.balance);
      const sold = props.lbpTokenStartingAmount - remaining;
      const tokenPrice =
        ((parseFloat(embr.weight) / parseFloat(usdc.weight)) *
          parseFloat(usdc.balance)) /
        parseFloat(embr.balance);
      const predictedPrice =
        ((0.8 / 0.2) * parseFloat(usdc.balance)) / parseFloat(embr.balance);

      return {
        sold,
        remaining,
        percentSold: sold / props.lbpTokenStartingAmount,
        tokenPrice: numeral(tokenPrice).format('$0,0.0000'),
        predictedPrice: numeral(predictedPrice).format('$0,0.0000'),
        embrWeight: numeral(parseFloat(embr.weight) * 100).format('0.[00]'),
        usdcWeight: numeral(parseFloat(usdc.weight) * 100).format('0.[00]')
      };
    });

    function transformTime(slotProps) {
      return {
        ...slotProps,
        hours: slotProps.hours < 10 ? `0${slotProps.hours}` : slotProps.hours,
        minutes:
          slotProps.minutes < 10 ? `0${slotProps.minutes}` : slotProps.minutes,
        seconds:
          slotProps.seconds < 10 ? `0${slotProps.seconds}` : slotProps.seconds
      };
    }

    const protocolDataQuery = useProtocolDataQuery();
    const tvl = computed(
      () => protocolDataQuery.data?.value?.totalLiquidity || 0
    );

    const embrPrice = computed(
      () => protocolDataQuery.data?.value?.embrPrice || 0
    );
    const circulatingSupply = computed(
      () => protocolDataQuery.data.value?.circulatingSupply || 0
    );
    const marketCap = computed(() => {
      return embrPrice.value * circulatingSupply.value;
    });

    return {
      fNum,
      harvesting,
      transformTime,
      timeRemaining,
      lbpData,
      countdownDateFormatted,
      countdownLabel,
      tvl,
      embrPrice,
      marketCap,
      circulatingSupply,
      numeral
    };
  }
});
</script>
