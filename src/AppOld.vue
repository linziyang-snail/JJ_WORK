<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 shadow-md A4">

      <!-- Header Section -->
      <div class="flex flex-row justify-between mb-6">
        <div class="text-left">
          <h1 class="text-3xl font-bold">JieJiang Auto Detailing</h1>
          <h2 class="text-lg">捷匠汽車美容施工單</h2>
          <p class="text-sm text-gray-600">JIEJIANG CAR INSPECTION FORM</p>
        </div>

        <!-- Date, Brand, Model Section -->
        <div class="flex flex-col text-sm space-y-2">
          <label>日期: <input type="date" class="border-b border-gray-400 outline-none ml-2" /></label>
          <label>車牌: <input type="text" placeholder="輸入車牌" class="border-b border-gray-400 outline-none ml-2" /></label>
          <label>車型: <input type="text" placeholder="輸入車型" class="border-b border-gray-400 outline-none ml-2" /></label>
        </div>
      </div>

      <!-- Car Diagram Section with Background Image -->
      <div class="flex justify-center space-x-4 mb-6">
        <div class="w-full h-64 bg-center bg-contain bg-no-repeat border border-gray-400"
          :style="{ backgroundImage: `url(${carBlueprint2})` }"></div>
      </div>

      <!-- Service Items Section checkbox -->
      <div class="mb-6">
        <div class="text-center font-semibold bg-gray-200 py-1">施作項目</div>
        <textarea rows="4" placeholder="輸入施作項目" class="w-full border border-gray-400 p-2"></textarea>
        <!-- <input type="checkbox" name="基礎打蠟" >
          <input type="checkbox" name="精緻洗車" >
          <input type="text">
          <input type="text">
          <input type="text">
          <input type="text">
          <input type="text"> -->
      </div>

      <!-- 客戶勾選 免責聲明 -->

      <!-- Payment Term Section -->
      <div class="flex justify-between mb-6">
        <div class="w-1/2">
          <div class="text-center font-semibold bg-gray-200 py-1">付款方式</div>
          <div class="p-2 text-sm">
            <div><input type="radio" name="payment" /> 現金 Cash</div>
            <div><input type="radio" name="payment" /> 信用卡 Credit Card</div>
            <div><input type="radio" name="payment" /> 街口 JKO Pay</div>
          </div>
        </div>
        <!-- <div class="w-1/3 text-center">
          <div class="font-semibold bg-gray-200 py-1">累積消費可升級會員等級</div>
        </div> -->
        <!-- Signature Section -->
        <div class="w-1/2 text-center">
          <div class="font-semibold bg-gray-200 py-1">客戶簽名 Signature</div>
          <div class="h-12 border-t border-gray-400 mt-4 relative">
            <div v-if="signatureDataUrl" class="absolute inset-0 flex items-center justify-center">
              <img :src="signatureDataUrl" alt="Signature" class="h-full" />
            </div>
            <button @click="openSignaturePad" class="text-xs text-blue-500">簽名</button>
          </div>
        </div>
      </div>

      <!-- Customer Info Section -->
      <div class="flex justify-between text-sm">
        <label>姓名 Name: <input type="text" placeholder="輸入姓名"
            class="border-b border-gray-400 outline-none ml-2" /></label>
        <label>電話 Phone: <input type="tel" placeholder="輸入電話"
            class="border-b border-gray-400 outline-none ml-2" /></label>
        <label>生日 Birthday: <input type="date" class="border-b border-gray-400 outline-none ml-2" /></label>
      </div>
    </div>

    <!-- Signature Pad Modal -->
    <div v-if="showSignaturePad" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-4 rounded shadow-lg w-full max-w-xl h-auto flex flex-col">
        <h3 class="text-center font-semibold mb-2">簽名</h3>
        <canvas ref="canvas" width="620" height="160"
          class="border border-gray-300 flex-1 rounded-lg cursor-crosshair w-full"
          style="width: 100%; height: auto;"></canvas>
        <div class="flex justify-between mt-2">
          <button @click="clearSignature" class="bg-gray-500 text-white px-4 py-2 rounded">清除</button>
          <button @click="saveSignature" class="bg-blue-500 text-white px-4 py-2 rounded">確認</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue';
import carBlueprint2 from '/src/assets/car_blueprint.png'; // 引入圖片

const showSignaturePad = ref(false);
const signatureDataUrl = ref('');
const canvas = ref(null);
let ctx;
let drawing = false;
let mousePos = { x: 0, y: 0 };
let lastPos = mousePos;

// 開啟簽名面板
function openSignaturePad() {
  showSignaturePad.value = true;
  nextTick(() => {
    if (canvas.value) {
      ctx = canvas.value.getContext('2d');
      ctx.strokeStyle = '#222222';
      ctx.lineWidth = 4;

      console.log('Canvas dimensions:', canvas.value.getBoundingClientRect()); // 確認尺寸
      // 綁定事件
      canvas.value.addEventListener('mousedown', startDrawing);
      canvas.value.addEventListener('mouseup', stopDrawing);
      canvas.value.addEventListener('mousemove', draw);
      canvas.value.addEventListener('mouseleave', stopDrawing);

      canvas.value.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startDrawing(e.touches[0]);
      });
      canvas.value.addEventListener('touchmove', (e) => {
        e.preventDefault();
        draw(e.touches[0]);
      });
      canvas.value.addEventListener('touchend', stopDrawing);
    } else {
      console.error("Canvas element is not available.");
    }
  });
}

// 初始化 Canvas 和事件
onMounted(async () => {
  await nextTick();
  if (canvas.value) {
    ctx = canvas.value.getContext('2d');
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 4;

    // 綁定事件
    canvas.value.addEventListener('mousedown', startDrawing);
    canvas.value.addEventListener('mouseup', stopDrawing);
    canvas.value.addEventListener('mousemove', draw);
    canvas.value.addEventListener('mouseleave', stopDrawing);

    // 觸控事件
    canvas.value.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startDrawing(e.touches[0]);
    });
    canvas.value.addEventListener('touchmove', (e) => {
      e.preventDefault();
      draw(e.touches[0]);
    });
    canvas.value.addEventListener('touchend', stopDrawing);

    // 禁止觸控滾動
    document.body.addEventListener('touchmove', (e) => {
      if (e.target === canvas.value) e.preventDefault();
    }, { passive: false });
  }
});

// 開始繪製簽名
function startDrawing(event) {
  drawing = true;
  lastPos = getCanvasCoordinates(event);
  ctx.beginPath(); // 確保新的路徑從這裡開始
  ctx.moveTo(lastPos.x, lastPos.y);
}

// 停止繪製
function stopDrawing() {
  drawing = false;
}

// 繪製過程
function draw(event) {
  if (!drawing) return;
  mousePos = getAdjustedCoordinates(event);
  ctx.lineTo(mousePos.x, mousePos.y);
  ctx.stroke();
  lastPos = mousePos;
}

// 計算點擊位置的相對座標
function getAdjustedCoordinates(event) {
  const rect = canvas.value.getBoundingClientRect();
  const scaleX = canvas.value.width / rect.width;
  const scaleY = canvas.value.height / rect.height;

  const x = (event.clientX ?? event.touches[0].clientX) - rect.left;
  const y = (event.clientY ?? event.touches[0].clientY) - rect.top;

  return {
    x: x * scaleX,
    y: y * scaleY
  };
}

// 取得畫布內的精確座標
function getCanvasCoordinates(event) {
  const rect = canvas.value.getBoundingClientRect();
  const x = (event.clientX ?? event.touches[0].clientX) - rect.left;
  const y = (event.clientY ?? event.touches[0].clientY) - rect.top;
  return { x, y };
}

// 清除簽名
function clearSignature() {
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
  signatureDataUrl.value = '';
}

// 儲存簽名
function saveSignature() {
  signatureDataUrl.value = canvas.value.toDataURL();
  showSignaturePad.value = false;
}
</script>

<style scoped>
/* 保持 A4 尺寸，不管是直向還是橫向 */
.A4 {
  width: 210mm;
  height: 297mm;
  max-width: 100vw;
  max-height: 100vh;
  overflow: auto;
}

/* 打印模式設置 */
@media print {
  .A4 {
    width: 210mm;
    height: 297mm;
  }
}
</style>
