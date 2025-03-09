<template>
    <div class="relative w-screen h-screen">
        <Background />
        <AlertModal />
        <router-view></router-view>
    </div>
</template>

<script setup>
import AlertModal from '@/components/AlertModal.vue';
import Background from "@/components/Background.vue";
</script>