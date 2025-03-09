<template>
    <div class="w-full h-24 border border-gray-400 relative bg-white flex flex-col items-center justify-center">
        <canvas ref="signatureCanvas" class="absolute top-0 left-0 w-full h-full cursor-crosshair"></canvas>
        <div class="absolute bottom-1 right-2">
            <button class="px-3 py-1 bg-gray-500 text-white text-xs rounded" @click="clearSignature">清除</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";

const signatureCanvas = ref(null);
let ctx;
let drawing = false;
const signatureDataUrl = defineModel(); // 雙向綁定儲存簽名的 dataURL

// **初始化簽名畫布**
function initCanvas() {
    const canvasElement = signatureCanvas.value;

    canvasElement.width = canvasElement.clientWidth;
    canvasElement.height = canvasElement.clientHeight;

    ctx = canvasElement.getContext("2d");
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.lineCap = "round";

    // **綁定簽名事件**
    canvasElement.addEventListener("pointerdown", startSignature);
    canvasElement.addEventListener("pointerup", stopSignature);
    canvasElement.addEventListener("pointermove", drawSignature);
}

// **開始簽名**
function startSignature(e) {
    drawing = true;
    ctx.beginPath();
    const { x, y } = getCanvasCoordinates(e);
    ctx.moveTo(x, y);
}

// **停止簽名並儲存**
function stopSignature() {
    drawing = false;
    signatureDataUrl.value = signatureCanvas.value.toDataURL(); // 存成圖片
}

// **繪製簽名**
function drawSignature(e) {
    if (!drawing) return;
    const { x, y } = getCanvasCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
}

// **取得滑鼠或觸控位置**
function getCanvasCoordinates(e) {
    const canvasRect = signatureCanvas.value.getBoundingClientRect();
    return {
        x: (e.clientX - canvasRect.left) * (signatureCanvas.value.width / canvasRect.width),
        y: (e.clientY - canvasRect.top) * (signatureCanvas.value.height / canvasRect.height),
    };
}

// **清除簽名**
function clearSignature() {
    ctx.clearRect(0, 0, signatureCanvas.value.width, signatureCanvas.value.height);
    signatureDataUrl.value = null;
}

// **初始化畫布**
onMounted(() => {
    nextTick(() => {
        initCanvas();
    });
});
</script>

<style scoped>
canvas {
    pointer-events: auto;
    background: transparent;
}
</style>