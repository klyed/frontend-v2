<template>
  <img
    v-if="darkMode"
    src="~@/assets/images/embrlong.png"
    width="160"
    class="mr-2 -ml-2"
  />
  <img v-else src="~@/assets/images/embrlong.png" width="160" class="mr-2 -ml-2" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useDarkMode from '@/composables/useDarkMode';

export default defineComponent({
  name: 'AppIcon',

  setup() {
    const { darkMode } = useDarkMode();

    return {
      darkMode
    };
  }
});
</script>
