<template>
    <div class="absolute w-full flex justify-center items-center">
        <div class="flex items-center justify-center h-screen">
            <div class="bg-white p-8 shadow-md A4 mt-20 flex flex-col">
                <div class="flex-1">
                    <!-- Header -->
                    <div class="flex flex-row justify-between mb-6">
                        <div class="text-left">
                            <h1 class="text-3xl font-bold">JieJiang Auto Detailing</h1>
                            <h2 class="text-lg">捷匠汽車美容施工單</h2>
                            <p class="text-sm text-gray-600">JIEJIANG CAR INSPECTION FORM</p>
                        </div>

                        <!-- 日期 / 車牌 / 車型 -->
                        <div class="flex flex-col text-sm space-y-2">
                            <label>日期:
                                <input v-model="formData.date" type="date"
                                    class="border-b border-gray-400 outline-none ml-2" />
                            </label>
                            <label>車牌:
                                <input v-model="formData.plateNumber" type="text" placeholder="輸入車牌"
                                    class="border-b border-gray-400 outline-none ml-2" />
                            </label>
                            <label>車型:
                                <select v-model="formData.carType" class="border-b border-gray-400 outline-none ml-2">
                                    <option value="" disabled selected>選擇車型</option>
                                    <option value="sedan">轎車</option>
                                    <option value="suv">休旅車</option>
                                    <option value="van">箱型車</option>
                                    <option value="pickup">皮卡</option>
                                </select>
                            </label>
                        </div>
                    </div>

                    <!-- 汽車圖示 -->
                    <div class="mb-6">
                        <EditableCarDiagram :imageSrc="formData.carDiagram || carBlueprint2"
                            @update:image="updateCarDiagram" />
                    </div>

                    <!-- 施作項目 -->
                    <div class="mb-6">
                        <div class="text-center font-semibold bg-gray-200 py-1">施作項目</div>
                        <div class="p-2 border border-gray-400">
                            <div v-for="(service, index) in serviceOptions" :key="index"
                                class="flex items-center space-x-2">
                                <input type="checkbox" :id="'service-' + index" v-model="formData.selectedServices"
                                    :value="service" />
                                <label :for="'service-' + index" class="text-sm">{{ service }}</label>
                            </div>
                            <textarea v-model="formData.additionalNotes" rows="3" placeholder="輸入額外的備註..."
                                class="w-full border border-gray-400 p-2 mt-2"></textarea>
                        </div>
                    </div>

                    <!-- 付款方式 -->
                    <div class="flex justify-between mb-6">
                        <div class="w-1/2">
                            <div class="text-center font-semibold bg-gray-200 py-1">付款方式</div>
                            <div class="p-2 text-sm">
                                <div><input type="radio" name="payment" v-model="formData.paymentMethod" value="cash" />
                                    現金 Cash</div>
                                <div><input type="radio" name="payment" v-model="formData.paymentMethod"
                                        value="credit_card" /> 信用卡</div>
                                <div><input type="radio" name="payment" v-model="formData.paymentMethod"
                                        value="jko_pay" /> 街口支付</div>
                                <div><input type="radio" name="payment" v-model="formData.paymentMethod"
                                        value="line_pay" /> Line Pay</div>
                            </div>
                        </div>

                        <!-- 客戶簽名 -->
                        <div class="w-1/2 text-center">
                            <div class="font-semibold bg-gray-200 py-1">客戶簽名</div>
                            <CustomerSignature :modelValue="formData.signatureDataUrl"
                                @update:modelValue="updateSignature" />
                        </div>
                    </div>

                    <!-- 客戶資訊 -->
                    <div class="flex justify-between text-sm">
                        <label>姓名 Name: <input v-model="formData.customerName" type="text"
                                class="border-b border-gray-400 outline-none ml-2" /></label>
                        <label>電話 Phone: <input v-model="formData.phoneNumber" type="tel"
                                class="border-b border-gray-400 outline-none ml-2" /></label>
                        <label>生日 Birthday: <input v-model="formData.birthday" type="date"
                                class="border-b border-gray-400 outline-none ml-2" /></label>
                    </div>
                </div>

                <div class="w-full flex flex-col items-center mt-8">
                    <CustomButton @click="validateAndSubmit">下一步</CustomButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import CustomButton from "@/components/CustomButton.vue";
import CustomerSignature from "@/components/CustomerSignature.vue";
import EditableCarDiagram from "@/components/EditableCarDiagram.vue";
import { Store } from "@/stores/index";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import carBlueprint2 from "../assets/carBlueprint2.JPG?url";

const router = useRouter();
const store = Store();
const showSignatureWarning = ref(false);

// **將 `Pinia Store` 的資料放到本地變數**
const formData = ref({ ...store.formData });

// **預設當天日期**
const today = computed(() => {
    return new Date().toISOString().split("T")[0];
});

// **如果日期沒有填寫，預設為當天**
if (!formData.value.date) {
    formData.value.date = today.value;
}

// **可選的施作項目**
const serviceOptions = ref([
    "漆面維護",
    "精緻洗車",
    "基礎漆面護理",
    "手作棕梠蠟",
    "精製漆面護理",
    "鍍膜塗層",
    "漆面氧化處理"
]);

// **更新汽車圖**
function updateCarDiagram(image) {
    formData.value.carDiagram = image;
}

// **更新客戶簽名**
function updateSignature(signature) {
    formData.value.signatureDataUrl = signature;
}

// **提交**
function validateAndSubmit() {
    if (!formData.value.signatureDataUrl) {
        showSignatureWarning.value = true;
        return;
    }

    // 🚀 **保留 `carDiagram` 和 `signatureDataUrl`，不要清空**
    store.setFormData({ ...formData.value });

    router.push("/CarFormStepTwo");
}
</script>

<style scoped>
/* A4 尺寸 */
.A4 {
    width: 210mm;
    height: 297mm;
    max-width: 85vw;
    max-height: 85vh;
    overflow: auto;
}

/* 打印模式 */
@media print {
    .A4 {
        width: 210mm;
        height: 297mm;
    }
}
</style>