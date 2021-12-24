const isdev = window.APP_ENV === "development";

import { createApp } from "vue";
import App from "./App";
import router from "./router";

import os from "os";
import fs from "fs";

import Antd from "ant-design-vue";
import store from "./store";
import { ipcRenderer, remote } from "electron";
import Store from "electron-store";
import axios from "axios";
// axios.defaults.baseURL = "http://192.168.1.141:8080";
axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";
// import Vue3Resize from "vue3-resize";
// 开发期 electron、electron-store 会被 script/plugins/index.ts -> esm2cjs 编译成 commonjs
// const { ipcRenderer } = require('electron')
// const Store = require('electron-store')

// 开发期全部引入 antd.css 打包期用 babel-plugin-import 按需引入样式
// isdev && require('ant-design-vue/dist/antd.css')
import "ant-design-vue/dist/antd.css";

import "@/assets/style/boot4-part.less";
import "./index.less";
import "xe-utils";
import VXETable from "vxe-table";
import "vxe-table/lib/style.css";
console.log("os:", os);
console.log("fs:", fs);
console.log("ipcRenderer:", ipcRenderer);
console.log("remote:", remote);
console.log("electron-store:", new Store());
// app.use(Antd);
// function useTable (app: App) {
//   app.use(VXETable)

//   // 给 vue 实例挂载内部对象，例如：
//   // app.config.globalProperties.$XModal = VXETable.modal
//   // app.config.globalProperties.$XPrint = VXETable.print
//   // app.config.globalProperties.$XSaveFile = VXETable.saveFile
//   // app.config.globalProperties.$XReadFile = VXETable.readFile
// }
createApp(App)
  .use(router)
  .use(store)
  // .use(Vue3Resize)
  .use(Antd)
  .use(VXETable)
  .mount("#app")
  .$nextTick(window.ClosePreloadLoading);
