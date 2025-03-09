<template>
    <div class="relative w-full h-96 border border-gray-300 bg-gray-100 flex flex-col items-center">
        <!-- 圖片和畫布 -->
        <div class="relative w-full h-full flex items-center justify-center">
            <img ref="imageElement" :src="imageSrc" alt="Editable Car Diagram"
                class="absolute top-0 left-0 w-full h-full object-contain select-none" />
            <canvas ref="canvas" class="absolute top-0 left-0 w-full h-full cursor-crosshair"></canvas>
        </div>
    </div>
</template>

<script setup>
import { defineEmits, nextTick, onMounted, ref } from "vue";

const props = defineProps({
    imageSrc: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(["update:image"]);
const canvas = ref(null);
const imageElement = ref(null);
let ctx;
let drawing = false;

// **初始化 Canvas**
function initCanvas() {
    const canvasElement = canvas.value;
    const imgElement = imageElement.value;

    if (!imgElement.complete) {
        imgElement.onload = () => {
            setCanvasSize();
            drawBackground();
        };
    } else {
        setCanvasSize();
        drawBackground();
    }

    ctx = canvasElement.getContext("2d");

    // **綁定畫圖事件**
    canvasElement.addEventListener("pointerdown", startDrawing);
    canvasElement.addEventListener("pointerup", stopDrawing);
    canvasElement.addEventListener("pointermove", draw);
}

// **確保 Canvas 尺寸與圖片匹配**
function setCanvasSize() {
    const canvasElement = canvas.value;
    const imgElement = imageElement.value;

    canvasElement.width = imgElement.clientWidth;
    canvasElement.height = imgElement.clientHeight;
}

// **畫背景圖片**
function drawBackground() {
    const img = new Image();
    img.src = props.imageSrc;
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
        ctx.drawImage(img, 0, 0, canvas.value.width, canvas.value.height);
        emit("update:image", props.imageSrc);
    };
}

// **開始繪製**
function startDrawing(e) {
    drawing = true;
    ctx.beginPath();
    const { x, y } = getCanvasCoordinates(e);
    ctx.moveTo(x, y);
}

// **停止繪製**
function stopDrawing() {
    drawing = false;
    mergeCanvasWithImage();
}

// **繪製**
function draw(e) {
    if (!drawing) return;
    const { x, y } = getCanvasCoordinates(e);

    ctx.lineTo(x, y);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
}

// **修正滑鼠定位**
function getCanvasCoordinates(e) {
    const canvasRect = canvas.value.getBoundingClientRect();
    const x = (e.clientX - canvasRect.left) * (canvas.value.width / canvasRect.width);
    const y = (e.clientY - canvasRect.top) * (canvas.value.height / canvasRect.height);
    return { x, y };
}

// **合併圖片與塗鴉並傳遞**
function mergeCanvasWithImage() {
    const canvasElement = canvas.value;
    const mergedCanvas = document.createElement("canvas");
    mergedCanvas.width = canvasElement.width;
    mergedCanvas.height = canvasElement.height;

    const mergedCtx = mergedCanvas.getContext("2d");
    const img = new Image();
    img.src = props.imageSrc;

    img.onload = () => {
        mergedCtx.drawImage(img, 0, 0, mergedCanvas.width, mergedCanvas.height);
        mergedCtx.drawImage(canvasElement, 0, 0);
        emit("update:image", mergedCanvas.toDataURL());
    };
}

// **初始化畫布**
onMounted(() => {
    nextTick(() => {
        initCanvas();
    });
});
</script>

<style scoped>
.relative img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
}

.relative canvas {
    width: 100%;
    height: 100%;
    object-fit: contain;
    z-index: 2;
}
</style>