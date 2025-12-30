import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "marriage-quiz",
  brand: {
    displayName: "예비부부 모의고사",
    primaryColor: "#2563EB",
    icon: "https://static.toss.im/appsintoss/6371/ac90029e-49cb-4577-9493-7a584a387b86.png",
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
