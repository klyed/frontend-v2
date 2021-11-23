<template>
  <div class="lg:container lg:mx-auto pt-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-y-8 gap-x-0 lg:gap-x-8">
      <div class="hidden lg:block" />

      <div class="col-span-2 order-2 lg:order-1">
        <div class="grid grid-cols-1 gap-y-8">
          <div class="px-1 lg:px-0">
            <div>
              <div style="background-color: #ff4a8d;padding: 20px">
                <b>Save me Jebus!</b>
                <br />
                <br />
                <div>
                  <button
                    style="border: 1px solid black; margin-bottom: 20px;"
                    :onclick="approve100"
                  >
                    approve 100
                  </button>
                </div>
                <div>
                  <button
                    style="border: 1px solid black; margin-bottom: 20px"
                    :onclick="enterFembr"
                  >
                    enter with 100
                  </button>
                </div>
                <div>
                  <button
                    style="border: 1px solid black"
                    :onclick="leaveFembr"
                  >
                    leave with 100
                  </button>
                </div>
                <br />
                Exchange rate: {{ currentExchangeRate }}
                <br />
                Exchange amount: {{ currentExchangeAmount }}
                <br />
                My fEmbr balance: {{ currentFEmbrBalance }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import useWeb3 from '@/services/web3/useWeb3';
import { fNum } from '@/composables/useNumbers';
import { useGovernance } from '@/composables/useGovernance';
import { bn, fp } from '@/lib/utils/numbers';

export default defineComponent({
  components: {},

  setup() {
    const { isWalletReady } = useWeb3();
    const {
      totalVestedTokenAmount,
      fEmbrTotalSupply,
      fEmbrBalance,
      enter,
      leave,
      exchangeAmount,
      exchangeRate,
      approveVestingToken
    } = useGovernance();

    const currentExchangeRate = ref();
    const currentExchangeAmount = ref();
    const currentFEmbrBalance = ref();

    totalVestedTokenAmount().then(result => {
      console.log('total vested amount: ', result.toString());
    });

    fEmbrTotalSupply().then(result => {
      console.log('total cembr supply', result);
    });

    exchangeAmount().then(amount => {
      currentExchangeAmount.value = amount;
      console.log('exchange amount: ', amount);
    });

    exchangeRate().then(rate => {
      currentExchangeRate.value = rate;
      console.log('exchange rate: ', rate);
    });

    fEmbrBalance().then(balance => {
      currentFEmbrBalance.value = balance;
      console.log('my fEmbr balance', balance);
    });

    async function approve100() {
      await approveVestingToken(fp(100));
      console.log('approved 100');
    }

    async function enterFembr() {
      await enter(fp(100));
      console.log('entered with 100 bpt');
    }

    async function leaveFembr() {
      await leave(fp(100));
      console.log('left with 100 bpt');
    }

    return {
      fNum,
      enterFembr,
      leaveFembr,
      approve100,
      currentExchangeRate,
      currentExchangeAmount,
      currentFEmbrBalance
    };
  }
});
</script>

<style scoped>
.pool-title {
  @apply mr-4 capitalize mt-2;
  font-variation-settings: 'wght' 700;
}
</style>
