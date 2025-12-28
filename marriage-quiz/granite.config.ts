import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "marriage-quiz",
  brand: {
    displayName: "예비부부 모의고사", // 화면에 노출될 앱의 한글 이름으로 바꿔주세요.
    primaryColor: "#2563EB", // 화면에 노출될 앱의 기본 색상으로 바꿔주세요.
    icon: "https://static.toss.im/tds/favicon/favicon-32x32.png", // 화면에 노출될 앱의 아이콘 이미지 주소로 바꿔주세요.
  },
  web: {
    host: "localhost",
    port: 5173,
    commands: {
      dev: "vite",
      build: "tsc -b && vite build",
    },
  },
  permissions: [],
  outdir: "dist",
});
