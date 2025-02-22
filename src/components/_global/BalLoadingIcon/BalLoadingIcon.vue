<template>
  <div :class="['spinner', sizeClasses]">
    <div :class="`double-bounce1 ${colorClasses}`" />
    <div :class="`double-bounce2 ${colorClasses}`" />
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'BalLoadingIcon',

  props: {
    color: {
      type: String,
      default: 'gray',
      validator: value => ['gray', 'primary', 'white'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: value => ['sm', 'md', 'lg'].includes(value)
    }
  },

  setup(props) {
    const sizeClasses = computed(() => {
      switch (props.size) {
        case 'lg':
          return 'lg';
        case 'sm':
          return 'sm';
        default:
          return 'md';
      }
    });

    const colorClasses = computed(() => {
      switch (props.color) {
        case 'white':
          return 'bg-white dark:bg-opacity-50';
        case 'gray':
          return 'bg-gray-400 dark:bg-gray-500';
        default:
          return `bg-${props.color}-500`;
      }
    });

    return {
      sizeClasses,
      colorClasses
    };
  }
});
</script>

<style scoped>
.spinner {
  position: relative;
}

.sm {
  width: 16px;
  height: 16px;
}

.md {
  width: 22px;
  height: 22px;
}

.lg {
  width: 32px;
  height: 32px;
}

.double-bounce1,
.double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  -webkit-animation: sk-bounce 2s infinite ease-in-out;
  animation: sk-bounce 2s infinite ease-in-out;
}
.double-bounce2 {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}
@-webkit-keyframes sk-bounce {
  0%,
  100% {
    -webkit-transform: scale(0);
  }
  50% {
    -webkit-transform: scale(1);
  }
}
@keyframes sk-bounce {
  0%,
  100% {
    transform: scale(0);
    -webkit-transform: scale(0);
  }
  50% {
    transform: scale(1);
    -webkit-transform: scale(1);
  }
}
</style>
