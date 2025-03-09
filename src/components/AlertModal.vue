<!-- src/components/AlertModal.vue -->
<template>
    <div v-if="modal.isVisible"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div class="bg-white rounded-lg shadow-lg w-11/12 max-w-md overflow-hidden">
            <div class="px-6 py-4 border-b border-formBorder">
                <h3 class="text-lg font-bold text-primaryText">{{ modal.title }}</h3>
            </div>
            <div class="px-6 py-4 text-secondaryText">
                {{ modal.message }}
            </div>
            <div class="px-6 py-4 flex justify-end space-x-2 bg-secondary">
                <button @click="handleConfirm"
                    class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primaryHover active:bg-primaryPressed transition">
                    確定
                </button>
                <button @click="modal.closeModal"
                    class="px-4 py-2 border border-formBorder text-secondaryText rounded-md bg-white hover:bg-secondary transition">
                    關閉
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useModalStore } from '@/stores/modal';

const modal = useModalStore();

function handleConfirm() {
    if (modal.onConfirm) modal.onConfirm();
    modal.closeModal();
}
</script>