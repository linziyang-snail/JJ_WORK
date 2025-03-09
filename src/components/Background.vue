<template>
  <!-- 全螢幕背景容器，背景色設定為黑灰白的高級色調 -->
  <div class="w-screen h-screen bg-custom-background absolute inset-0 overflow-hidden flex flex-col">
    <!-- LOGO 和標題的區域 -->
    <div class="flex flex-row space-x-8 justify-center items-center cursor-pointer space-y-4 " @click="toHome()">
      <!-- LOGO 圖片 -->
      <img src="@/assets/layout/jiejiang_logo.png" class="w-[150px] h-auto mt-6 z-50 lg:w-[200px]"
        alt="Jiejiang Logo" />
      <!-- 標題文字 -->
      <span class="text-2xl font-semibold z-50">
        電子工單系統
      </span>
    </div>
  </div>
  <!-- 插槽，包裹 Background 組件中的內容 -->
  <slot>

  </slot>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

// 點擊 LOGO 或標題返回首頁的功能
const toHome = () => {
  router.push("/");
};

// 檢查是否在首頁路由
const isHomeRoute = computed(() => route.name === "home");
</script>