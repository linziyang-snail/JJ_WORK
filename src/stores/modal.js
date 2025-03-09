// src/stores/modal.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useModalStore = defineStore('modal', () => {
    const isVisible = ref(false);
    const title = ref('');
    const message = ref('');
    const onConfirm = ref(null);

    function openModal({ modalTitle, modalMessage, confirmCallback }) {
        title.value = modalTitle;
        message.value = modalMessage;
        onConfirm.value = confirmCallback || null;
        isVisible.value = true;
    }

    function closeModal() {
        isVisible.value = false;
        title.value = '';
        message.value = '';
        onConfirm.value = null;
    }

    return { isVisible, title, message, onConfirm, openModal, closeModal };
});