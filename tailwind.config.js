/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "noto-sans": ["Noto Sans TC", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
      backgroundImage: {
        // 保持背景使用淺灰色漸層
        "custom-background":
          "linear-gradient(180deg, #F7F7F7 0%, #E5E5E5 100%)",
      },
      colors: {
        // 主色與 LOGO 保持一致，為黑色
        primary: "#1F1F1F", // 黑色，用於標題或主要文字

        // 文字顏色
        primaryText: "#333333", // 深灰色文字，適合用於標題
        secondaryText: "#4F4F4F", // 稍淺的灰色文字，用於次要文字或說明

        // 區塊背景顏色
        secondary: "#F2F2F2", // 非常淺的灰色，適合用於區塊或卡片背景
        accentBackground: "#D9D9D9", // 更深一點的灰色，用於小型區隔元素或背景點綴

        // 互動顏色
        primaryHover: "#9A9A9A", // 按鈕懸停時的灰色，用於強調按鈕互動效果
        primaryPressed: "#BCBCBC", // 按鈕按下時的稍深灰色
        linkColor: "#1A73E8", // 藍色，用於連結和可點擊項目，專業且易讀

        // 禁用顏色
        disabledGray: "#C4C4C4", // 禁用按鈕或表單顏色，低對比度灰色

        // 錯誤顏色
        errorRed: "#D9534F", // 錯誤提示顏色，適合用於錯誤邊框或訊息

        // 表單背景顏色
        formBackground: "#FAFAFA", // 非常淺的灰色，保持表單填寫區域簡潔乾淨
        formBorder: "#E0E0E0", // 表單邊框，淡灰色，保持專業一致性
      },
    },
    plugins: [],
  },
};
