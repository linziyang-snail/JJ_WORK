import { defineStore } from "pinia";

export const Store = defineStore({
    id: "Store",
    state: () => ({
        formData: {
            date: "",
            plateNumber: "",
            carType: "",
            carDiagram: "", // 汽車塗鴉圖
            selectedServices: [],
            additionalNotes: "",
            paymentMethod: "",
            signatureDataUrl: "", // 客戶簽名
            customerName: "",
            phoneNumber: "",
            birthday: ""
        }
    }),
    actions: {
        setFormData(data) {
            this.formData = { ...this.formData, ...data };
        }
    }
});