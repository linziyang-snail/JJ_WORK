<template>
  <!-- 定義按鈕的樣式 -->
  <button :class="[
    baseClasses,
    {
      // 🚀 改進的 Outline 變體設計
      'border-2 text-primary border-primary bg-white hover:bg-primaryHover hover:shadow-lg active:bg-primaryPressed active:border-primaryPressed':
        variant === 'outline' && !disabled,
      // 🚀 Filled 按鈕的設計
      'bg-primary text-white hover:bg-primaryHover active:bg-primaryPressed':
        variant === 'filled' && !disabled,
      // 🚀 禁用狀態
      'bg-gray-300 text-gray-600 border-gray-300 cursor-not-allowed': disabled,
    },
  ]" :disabled="disabled">
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: "filled",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

// 按鈕的基本樣式
const baseClasses =
  "w-full max-w-[330px] h-full max-h-[48px] font-bold px-6 py-3 rounded-full shadow-md transition duration-300 flex items-center justify-center text-lg";
</script>

<style scoped>
/* 讓 hover 和 focus 狀態更加流暢 */
button {
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}
</style>