<template>
  <div class="absolute inset-0 flex flex-col justify-center items-center space-y-4 pt-48 lg:pt-0 bg-custom-background">
    <CustomButton @click="goCarForm" variant="filled">
      汽車工單
    </CustomButton>
    <CustomButton @click="showComingSoon" variant="filled">
      貳輪工單
    </CustomButton>
  </div>
</template>

<script setup>
import CustomButton from "@/components/CustomButton.vue";
import { useModalStore } from '@/stores/modal';
import { useRouter } from "vue-router";

const router = useRouter();
const modal = useModalStore();

function goCarForm() {
  router.push('/CarFormStepOne');
}

function showComingSoon() {
  modal.openModal({
    modalTitle: '提醒',
    modalMessage: '貳輪工單功能尚未開放，敬請期待！',
    confirmCallback: () => {
      console.log('用戶點擊確定');
    }
  });
}
</script>