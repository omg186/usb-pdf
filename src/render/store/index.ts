//@ts-nocheck
import store from "@src/common/utils/store";

const { remote } = require("electron");
var path = require("path");
var exePath = path.dirname(__dirname);
console.log(exePath, "exePath", remote.app.getAppPath());
// const distName = exePath.substr(0, 1).toUpperCase() + ":/usbPdf/pdf/";
// const distName = exePath.substr(0, 1).toUpperCase() + "../../";
const distName = path.join(remote.app.getAppPath(), "../../");
console.log(distName, "-----distName----");
import { createApp } from "vue";
import { createStore } from "vuex";
function restToolBarActiveMenu() {
  const toolbarActiveMenu = new Map();
  toolbarActiveMenu.set("PDFTOOL", { id: 4, active: true });
  toolbarActiveMenu.set("MENU", { id: 1, active: true });
  return toolbarActiveMenu;
}
// 创建一个新的 store 实例
const storeVuex = createStore({
  state() {
    return {
      pdfType: {
        id: 1,
        name: "期刊排序",
        type: "periodical",
      },
      pdfOption: {
        scale: "",
        rotate: 0,
        page: 0,
        totalPage: 0,
        spreadMode: -1,
        send: true,
      },
      pdfName: "",
      pdfUrl: "", //distName + "/pdf/城市轨道交通工务概论97871132458180000.pdf",
      toolbarActiveMenu: restToolBarActiveMenu(),
      iframe: {},
      sider: { search: false },
      beforeInitPdfRender: () => {},
    };
  },
  getters: {
    sider: (state) => state.sider,
    beforeInitPdfRender: (state) => state.beforeInitPdfRender,
    pageBtnVisble: (state) => {
      if (state.pdfUrl && state.pdfOption.spreadMode == 0) {
        return true;
      }
      return false;
    },
    pdfType(state) {
      return state.pdfType;
    },
    toolbarActiveMenu(state) {
      return state.toolbarActiveMenu;
    },
    pdfOption(state) {
      return state.pdfOption;
    },
    iframe(state) {
      return state.iframe;
    },
    pdfUrl(state) {
      return state.pdfUrl;
    },
    pdfName(state) {
      return state.pdfName;
    },
  },
  mutations: {
    increment(state) {
      state.count++;
    },
    changePdfType(state, val) {
      state.pdfType = val;
      store.set("PDFTYPE", val);
    },
    changePdfOption(state, val) {
      state.pdfOption = val;
    },

    changeSider(state, val) {
      state.sider = val;
    },
    restToobarHover(state) {
      state.toolbarActiveMenu = restToolBarActiveMenu();
    },
    changeToobarHover(state, val) {
      state.toolbarActiveMenu.set(val.key, val);
    },
    changeIframe(state, val) {
      state.iframe = val;
    },
    changePdfUrl(state, val) {
      state.pdfUrl = val.url;
      state.pdfName = val.name;
    },
    changeBeforeInitPdfRender(state, val) {
      state.beforeInitPdfRender = val;
    },
  },
  actions: {
    changeIframe(context, val) {
      context.commit("changeIframe", val);
    },
    changePdfType(context, val) {
      context.commit("changePdfType", val);
    },
    changePdfOption(context, val) {
      let op = { ...context.state.pdfOption, ...val };

      context.commit("changePdfOption", op);
    },
    changePdfUrl(context, val) {
      let url = "";
      let name = "";
      if (val) {
        url = distName + "pdf/" + val + ".pdf";
        name = val + ".pdf";
      }
      context.commit("changePdfUrl", { url, name });
    },
    changeToobarHover(context, val) {
      context.commit("changeToobarHover", val);
    },
    changeSider(context, val) {
      context.commit("changeSider", val); // state.sider = val;
    },
    gotoHome(context, val) {
      context.commit("changePdfType", {
        id: 1,
        name: "期刊排序",
        type: "periodical",
      });
      context.commit("changePdfUrl", { url: "", name: "" });
      context.commit("restToobarHover");
      context.commit("changePdfOption", {
        scale: "",
        rotate: 0,
        page: 0,
        totalPage: 0,
        send: true,
      });
      context.commit("changeSider", { search: false });
    },
    changeBeforeInitPdfRender(context, val) {
      context.commit("changeBeforeInitPdfRender", val);
    },
  },
});

// 将 store 实例作为插件安装
export default storeVuex;
