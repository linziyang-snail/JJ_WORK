<template>
    <div class="absolute w-full flex justify-center items-center">
        <div class="flex items-center justify-center h-screen">
            <div class="bg-white p-8 shadow-md A4 mt-20 flex flex-col">
                <!-- ======== A4 內容開始 ======== -->
                <div class="flex-1">
                    <div class="flex flex-row justify-between mb-6">
                        <!-- 左側標題 -->
                        <div class="text-left">
                            <h1 class="text-2xl md:text-3xl font-bold">JieJiang Auto Detailing</h1>
                            <h2 class="text-base md:text-lg">捷匠汽車美容施工單</h2>
                            <p class="text-xs md:text-sm text-gray-600">JIEJIANG CAR INSPECTION FORM</p>
                        </div>
                        <!-- 右側 日期 / 車牌 / 車型 -->
                        <div class="flex flex-col text-sm space-y-2 border border-gray-300 p-2">
                            <p><strong>日期：</strong> {{ formData.date || "未填寫" }}</p>
                            <p><strong>車牌：</strong> {{ formData.plateNumber || "未填寫" }}</p>
                            <p><strong>車型：</strong> {{ getCarTypeName(formData.carType) }}</p>
                        </div>
                    </div>

                    <!-- 汽車圖示 -->
                    <div class="border border-gray-300 p-2">
                        <h3 class="text-base md:text-lg font-semibold bg-gray-200 py-1 text-center">車況標示</h3>
                        <div class="w-full h-64 flex items-center justify-center border border-gray-400 bg-gray-100">
                            <img v-if="formData.carDiagram" :src="formData.carDiagram" alt="Car Diagram"
                                class="max-w-full max-h-full object-contain" />
                            <p v-else class="text-gray-500">無標記</p>
                        </div>
                    </div>

                    <!-- 施作項目 -->
                    <div class="border border-gray-300 p-2">
                        <h3 class="text-base md:text-lg font-semibold bg-gray-200 py-1 text-center">施作項目</h3>
                        <ul v-if="formData.selectedServices.length" class="list-disc pl-5">
                            <li v-for="(service, index) in formData.selectedServices" :key="index">
                                {{ service }}
                            </li>
                        </ul>
                        <p v-else class="text-gray-500 text-center">未選擇</p>
                        <p v-if="formData.additionalNotes" class="mt-2">
                            <strong>備註：</strong>{{ formData.additionalNotes }}
                        </p>
                    </div>

                    <!-- 付款方式 & 簽名 -->
                    <div
                        class="border border-gray-300 p-2 flex flex-col md:flex-row md:justify-between space-y-4 md:space-y-0">
                        <div class="md:w-1/2">
                            <h3 class="text-base md:text-lg font-semibold bg-gray-200 py-1 text-center">
                                付款方式
                            </h3>
                            <p class="text-center mt-2">{{ getPaymentMethodName(formData.paymentMethod) }}</p>
                        </div>
                        <div class="md:w-1/2 text-center">
                            <h3 class="text-base md:text-lg font-semibold bg-gray-200 py-1">
                                客戶簽名
                            </h3>
                            <div class="h-16 flex items-center justify-center border border-gray-400 bg-gray-100">
                                <img v-if="formData.signatureDataUrl" :src="formData.signatureDataUrl" alt="Signature"
                                    class="max-h-full" />
                                <p v-else class="text-gray-500">未簽名</p>
                            </div>
                        </div>
                    </div>

                    <!-- 客戶資訊 -->
                    <div class="border border-gray-300 p-2">
                        <h3 class="text-base md:text-lg font-semibold bg-gray-200 py-1 text-center">客戶資訊</h3>
                        <p><strong>姓名：</strong>{{ formData.customerName || "未填寫" }}</p>
                        <p><strong>電話：</strong>{{ formData.phoneNumber || "未填寫" }}</p>
                        <p><strong>生日：</strong>{{ formData.birthday || "未填寫" }}</p>
                    </div>
                </div>
                <!-- ======== A4 內容結束 ======== -->
            </div>
        </div>

        <div class="absolute bottom-0 left-0 w-full flex justify-center space-x-4 p-4 z-50">
            <CustomButton variant="outline" @click="resetForm">重新填寫</CustomButton>
            <CustomButton @click="submitOrder">完成並上傳</CustomButton>
        </div>
    </div>
</template>

<script setup>
import CustomButton from "@/components/CustomButton.vue";
import { Store } from "@/stores/index";
import { getGoogleAccessToken } from "@/utils/googleAuth";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const store = Store();
const formData = computed(() => store.formData);

import { useModalStore } from '@/stores/modal';
const modal = useModalStore();

/** 付款方式對應名稱 */
function getPaymentMethodName(method) {
    const methods = {
        cash: "現金 (Cash)",
        credit_card: "信用卡 (Credit Card)",
        jko_pay: "街口支付 (JKO Pay)",
    };
    return methods[method] || "未選擇";
}

/** 車型對應名稱 */
function getCarTypeName(type) {
    const carTypes = {
        sedan: "轎車",
        suv: "休旅車",
        van: "箱型車",
        pickup: "皮卡",
    };
    return carTypes[type] || "未選擇";
}

/**
 * 產生 PDF Blob，**完整截取 `.A4` 所有內容**（含 overflow 之後的部分），
 * 並按需要將內容分多頁 (長度超過一頁時)。
 */
async function createPdfBlob() {
    // 滾動到最上方，避免截圖時只抓到視窗可視範圍
    window.scrollTo(0, 0);

    const a4Element = document.querySelector(".A4");
    if (!a4Element) throw new Error("找不到 .A4 容器，請確認存在");

    // 1. 暫時移除 overflow, 固定高度，讓元素展開到完整高度
    const originalOverflow = a4Element.style.overflow;
    const originalHeight = a4Element.style.height;

    a4Element.style.overflow = "visible"; // 先讓它可撐開
    a4Element.style.height = "auto";      // 內容再高都能展開

    // 用 scrollHeight, scrollWidth 取得「實際所有內容」的大小
    const fullWidth = a4Element.scrollWidth;
    const fullHeight = a4Element.scrollHeight;

    // 使用 html2canvas 擷取「完整展開」後的內容
    const canvas = await html2canvas(a4Element, {
        scale: 2.5,      // 放大倍數(解析度)，可自行調整
        scrollX: 0,
        scrollY: -window.scrollY,
        width: fullWidth,
        height: fullHeight,
        useCORS: true,
    });

    // 2. 截完圖後，恢復原本樣式(不影響畫面顯示)
    a4Element.style.overflow = originalOverflow;
    a4Element.style.height = originalHeight;

    // 轉成圖片
    const imgData = canvas.toDataURL("image/png");

    // 準備 jsPDF
    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    // A4 寬 / 高 (mm)
    const pageWidth = 210;   // A4寬
    const pageHeight = 297;  // A4高

    // 按照比例計算圖片在 PDF 中的實際高度
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // 如果實際高度超過一頁，就自動切分成多頁
    if (imgHeight > pageHeight) {
        let position = 0;
        let heightLeft = imgHeight;

        // 第一頁
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // 繼續新增頁面直到放完
        while (heightLeft > 0) {
            pdf.addPage();
            position = position - pageHeight; // 往上偏移
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
    } else {
        // 一頁就能容納
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    }

    // 輸出成 Blob
    return pdf.output("blob");
}

/** 上傳 PDF 到 Google Drive
 *  資料夾結構： 電子工單 ➜ 今日日期 ➜ 檔案
 */
async function uploadPDFToGoogleDrive() {
    const accessToken = await getGoogleAccessToken();
    const pdfBlob = await createPdfBlob();
    const todayFolderName = new Date().toISOString().slice(0, 10);

    // 1. 檢查或建立「電子工單」資料夾
    const mainFolderId = await ensureFolderExists(accessToken, '電子工單');

    // 2. 檢查或建立「今日日期」資料夾
    const dateFolderId = await ensureFolderExists(accessToken, todayFolderName, mainFolderId);

    // 3. 上傳 PDF 檔案到「今日日期」資料夾
    const metadata = {
        name: `${formData.value.plateNumber || "未填車牌"}.pdf`,
        mimeType: "application/pdf",
        parents: [dateFolderId]
    };

    const form = new FormData();
    form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    form.append("file", pdfBlob);

    const res = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: form,
    });

    const result = await res.json();

    if (!result.id) {
        throw new Error(JSON.stringify(result));
    }
}

/** 檢查資料夾是否存在，不存在則建立並回傳 folderId */
async function ensureFolderExists(accessToken, folderName, parentFolderId = null) {
    const query = parentFolderId
        ? `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false and '${parentFolderId}' in parents`
        : `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`;

    // 搜尋資料夾
    let res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    let result = await res.json();

    if (result.files?.length > 0) {
        // 資料夾已存在
        return result.files[0].id;
    } else {
        // 資料夾不存在，建立新資料夾
        res = await fetch("https://www.googleapis.com/drive/v3/files", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: folderName,
                mimeType: "application/vnd.google-apps.folder",
                parents: parentFolderId ? [parentFolderId] : undefined
            })
        });

        result = await res.json();
        return result.id;
    }
}
/** 重新填寫 */
function resetForm() {
    store.setFormData({
        date: new Date().toISOString().split("T")[0],
        plateNumber: "",
        carType: "",
        carDiagram: null,
        selectedServices: [],
        additionalNotes: "",
        paymentMethod: "",
        signatureDataUrl: null,
        customerName: "",
        phoneNumber: "",
        birthday: "",
    });
    router.push("/CarFormStepOne");
}

/** 完成工單並上傳 */
async function submitOrder() {
    modal.openModal({
        modalTitle: '上傳中',
        modalMessage: '📸 正在擷取表單並上傳，請稍候...',
    });

    try {
        await uploadPDFToGoogleDrive();

        modal.openModal({
            modalTitle: '✅ 上傳成功',
            modalMessage: '工單已成功上傳至 Google Drive！',
            confirmCallback: () => {
                // 成功後清空表單並返回首頁
                store.setFormData({
                    date: new Date().toISOString().split("T")[0],
                    plateNumber: "",
                    carType: "",
                    carDiagram: null,
                    selectedServices: [],
                    additionalNotes: "",
                    paymentMethod: "",
                    signatureDataUrl: null,
                    customerName: "",
                    phoneNumber: "",
                    birthday: "",
                });
                router.push("/");
            }
        });
    } catch (error) {
        modal.openModal({
            modalTitle: '❌ 上傳失敗',
            modalMessage: `發生錯誤：${error.message}`,
        });
    }
}
</script>

<style scoped>
/* 你原本的 A4 樣式，完全保留 */
.A4 {
    width: 210mm;
    height: 297mm;
    max-width: 85vw;
    max-height: 85vh;
    overflow: auto;
}

/* 打印模式，也保留 */
@media print {
    .A4 {
        width: 210mm;
        height: 297mm;
    }
}
</style>