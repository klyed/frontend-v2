<template>
  <div :class="`app-nav-toggle bg-gray-50 dark:bg-gray-${darkModeBg}`">
    <router-link
      :to="{ name: 'trade' }"
      :class="[
        'toggle-link px-6 rounded-r-lg',
        { [activeClasses]: isTradePage }
      ]"
      @click="trackGoal(Goals.ClickNavTrade)"
    >
      {{ $t('trade') }} </router-link
    ><router-link
      :to="{ name: 'invest' }"
      :class="[
        'toggle-link px-6 rounded-l-lg',
        { [activeClasses]: isInvestPage }
      ]"
      @click="trackGoal(Goals.ClickNavInvest)"
    >
      Invest<span class="hidden lg:inline">&nbsp;/&nbsp;Farm</span>
    </router-link>
    <!--    <router-link
      :to="{ name: 'farm' }"
      :class="[
        'toggle-link px-6 rounded-r-lg',
        { [activeClasses]: isFarmPage }
      ]"
      @click="trackGoal(Goals.ClickNavFarm)"
    >
      Farm
    </router-link>-->
    <router-link
      :to="{ name: 'my-portfolio' }"
      :class="[
        'toggle-link px-4 rounded-l-lg',
        { [activeClasses]: isPortfolioPage }
      ]"
      @click="trackGoal(Goals.ClickNavHome)"
      v-if="isLoggedIn"
    >
      Portfolio
    </router-link>
    <router-link
      :to="{ name: 'cembr' }"
      :class="[
        'toggle-link px-4 rounded-l-lg',
        { [activeClasses]: isCharredEmbrPage }
      ]"
      @click="trackGoal(Goals.ClickNavCharredEmbr)"
      v-if="isLoggedIn"
    >
      fEmbr
    </router-link>
    <!--    <router-link
      :to="{ name: 'embr' }"
      :class="[
        'toggle-link px-6 rounded-r-lg',
        { [activeClasses]: isEmbrPage }
      ]"
      @click="trackGoal(Goals.ClickNavEmbr)"
    >
      EMBR
    </router-link>-->
  </div>
</template>

<script lang="ts">
import useFathom from '@/composables/useFathom';
import { computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import { EXTERNAL_LINKS } from '@/constants/links';
import useApp from '@/composables/useApp';
import useWeb3 from '@/services/web3/useWeb3';

export default defineComponent({
  name: 'AppNavToggle',
  components: {},
  props: {
    darkModeBg: { type: String, default: '800' }
  },

  setup() {
    const route = useRoute();
    const activeClasses =
      'bg-black text-white rounded-lg dark:text-black dark:bg-white';
    const isTradePage = computed(() => route.name === 'trade');
    const isFarmPage = computed(() => String(route.name).startsWith('farm'));
    const isEmbrPage = computed(() => route.name === 'embr');
    const isPortfolioPage = computed(() => route.name === 'my-portfolio');
    const isInvestPage = computed(
      () => route.name === 'invest' || String(route.name).startsWith('pool')
    );
    const isCharredEmbrPage = computed(() => route.name === 'cembr');
    const isHomePage = computed(
      () =>
        !isTradePage.value &&
        !isFarmPage.value &&
        !isEmbrPage.value &&
        !isInvestPage.value
    );
    const { trackGoal, Goals } = useFathom();

    const { appLoading } = useApp();
    const { account, isLoadingProfile } = useWeb3();

    const isLoggedIn = computed(
      () => !appLoading.value && !isLoadingProfile.value && !!account.value
    );

    return {
      isTradePage,
      isFarmPage,
      activeClasses,
      trackGoal,
      isEmbrPage,
      isInvestPage,
      isHomePage,
      Goals,
      EXTERNAL_LINKS,
      isLoggedIn,
      isPortfolioPage,
      isCharredEmbrPage
    };
  }
});
</script>

<style scoped>
.app-nav-toggle {
  @apply h-10 flex items-center rounded-lg shadow;
  font-variation-settings: 'wght' 600;
}

.toggle-link {
  @apply h-full flex items-center;
}
</style>
