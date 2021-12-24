

<template>
  <div class="app-pdf-container">
    <!-- <div id="viewerContainer" tabindex="0">
      <div id="viewer" class="pdfViewer"></div>
    </div> -->
    <iframe
      id="iframe"
      :src="'./static/pdfjs-dist/web/viewer.html?file=' + pdfUrl"
      style="width: 100%; height: 100%; border: none"
      ref="iframe"
      name="pdfJsHtml"
    ></iframe>
    <!-- <div class="page-container" v-if="pageBtnVisble">
      <img src="@/assets/image/shangyiye_icon.png" @click="handlePagePrev" />
      <img src="@/assets/image/xiayiye_icon.png" @click="handlePageNext" />
    </div> -->
  </div>
</template>

<script lang="ts">
// import { notification } from "ant-design-vue";
// import * as pdfjsLib from "pdfjs-dist";
// const fs = require("fs"); //引入node原生fs模块
// pdfjsLib.GlobalWorkerOptions.workerSrc =
//   "./static/pdfjs-dist/build/pdf.worker.js";

import { notification } from "ant-design-vue";
import { computed, defineComponent } from "vue";
import { mapActions, mapGetters, useStore } from "vuex";
export default defineComponent({
  setup() {
    const store = useStore();
    function changePdfOption(params: any, sendMessage = true) {
      store.dispatch("changePdfOption", { ...params });
    }
    function handlePagePrev() {
      const { page } = store.state.pdfOption;
      if (page === 1) {
        notification.info({
          message: "提示",
          description: "已经到了第一页了",
        });
        return false;
      }
      store.getters.iframe.postMessage({ cmd: "prevPage" }, "*");
      changePdfOption({ page: page - 1 });
    }
    function handlePageNext() {
      const { page, totalPage } = store.state.pdfOption;
      if (page >= totalPage) {
        notification.info({
          message: "提示",
          description: "已经到了最后一页了",
        });
        return false;
      }
      store.getters.iframe.postMessage({ cmd: "nextPage" }, "*");
      changePdfOption({ page: page + 1 });
    }
    return {
      handlePagePrev,
      handlePageNext,
      changePdfOption,
      pageBtnVisble: computed(() => store.getters.pageBtnVisble),
    };
  },
  data() {
    return {
      iframe: {} as any,
      addMark: { original: "", page: 0, markText: "" },
      visibleAddMark: false,
      // url: "http://192.168.1.141:8080/file/getPdf",
      // url: "/test.pdf",
      // url: distName + "/pdf/城市轨道交通工务概论97871132458180000.pdf",
    };
  },
  computed: {
    ...mapGetters(["pdfUrl", "beforeInitPdfRender"]),
  },
  mounted() {
    // const data = fs.readFileSync("E:/1.A/java/pdf/test.pdf");
    // const uint8Buffer = Uint8Array.from(data);
    // const bolb = new Blob([uint8Buffer]); //转为一个新的Blob文件流
    // console.log(bolb);
    // this.url = window.URL.createObjectURL(bolb); //转换为url地址并直接给到audio
    // (err, data: Buffer) => {
    // console.log(data);
    // // list.innerHTML = data; //将读取到的文件内容渲染到页面
    // const json = JSON.stringify({ blob: data.toString("base64") });
    // // console.log(json);
    // // this.url = URL.createObjectURL(json);
    // this.url = json;

    window.addEventListener("message", this.handleMessage);
    // this.init(this.url);
    //@ts-ignore
    this.iframe = this.$refs.iframe.contentWindow as Window;
    this.changeIframe(this.iframe);
    // setTimeout(() => {
    //   this.drawBboxes([[0, 0, 300, 200]], 1000, 0);
    // }, 3000);
  },
  watch: {
    "$store.state.pdfOption": function (newVal, oldVal) {
      console.log(newVal, "message");
      if (newVal.scale != oldVal.scale) {
        // this.changeScale(newVal.scale);
      } else if (newVal.rotate) {
        // this.changeRotate(newVal.rotate);
      } else if (newVal.page !== oldVal.page && newVal.send) {
        // this.changePdfOption(newVal.page, false);
        // this.iframe.postMessage({ cmd: "nextPage" }, "*");
      }
    },
  },
  methods: {
    ...mapActions(["changeIframe"]),
    sendMessage() {
      //   this.iframe.postMessage({ cmd: "nextPage" }, "*");
    },
    handleMessage(data: any) {
      //   console.log(data);
      const params = data.data;
      //   console.log(params.cmd);
      switch (params.cmd) {
        case "pageNumber":
          console.log(params);
          this.changePdfOption({ page: params.pageNumber, send: false });
          break;
        case "pageNumbers":
          console.log(params.cmd, params.numPages);
          this.changePdfOption({ totalPage: params.numPages, send: false });
          break;
        case "currentScaleValue":
          console.log(params);
          if (params.params) {
            this.changePdfOption({ scaleValue: params.params || 1 });
          }
        case "initRender":
          console.log(params, "initRender1");
          this.changePdfOption({ ...(params.params || {}) });
          this.beforeInitPdfRender();
          break;
        default:
          break;
      }
    },
    init(url: string) {},
    drawBboxes(bboxes: any, pagesize: number, pageno: number) {
      //获取 iframe
      this.drawColor(bboxes, pagesize, pageno);
    },
    drawColor(bboxes: any, pagesize: number, pageno: number) {
      function getRad(degree: number) {
        return (degree / 180) * Math.PI;
      }
      let pagewidth = 1020;
      let pageheight = 1320;
      // let pagenum = "page" + pageno;
      let pagenum = "page";

      //@ts-ignore
      const pagedom = document
        .getElementById("iframe")
        /**
      //@ts-ignore */
        .contentDocument?.getElementsByClassName(pagenum)[
        pageno
      ] as HTMLElement;
      console.log(pagedom);
      let canvas = pagedom.firstChild?.firstChild as HTMLCanvasElement;
      if (!canvas) {
        return false;
      }
      // this.iframe.contentDocument.getElementsByClassName(pagenum)[pageno];
      let orgwidth = canvas.width;
      let orgheight = canvas.height;
      let scaleXValue = orgwidth / pagewidth;
      let scaleYValue = orgheight / pageheight;
      let ctx = canvas.getContext("2d");
      if (!ctx) {
        return false;
      }
      ctx.translate(0, orgheight);
      ctx.rotate(getRad(180));
      ctx.scale(-1, 1);

      bboxes.forEach((item: Array<number>) => {
        const [x0, y0, x1, y1] = item;
        if (!ctx) {
          return false;
        }
        console.log(ctx, item, scaleXValue, scaleYValue, "----ctx-----");
        ctx.beginPath();
        ctx.moveTo(x0 * scaleXValue, y0 * scaleYValue);
        ctx.lineTo(x1 * scaleXValue, y0 * scaleYValue);
        ctx.lineTo(x1 * scaleXValue, y1 * scaleYValue);
        ctx.lineTo(x0 * scaleXValue, y1 * scaleYValue);
        ctx.closePath();
        ctx.fillStyle = "RGB(0, 100, 0,0.2)";
        ctx.fill();
        // fillColor(item);
      });
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    },
    // fillColor([x0, y0, x1, y1, lengX, lengY]: Array<number>) {},
  },
});
</script>

<style lang='less'>
.app-pdf-container {
  position: relative;
  height: 100%;
  .iframe {
    border: none;
  }
  .page-container {
    img {
      position: absolute;
      display: flex;
      width: 44px;
      height: 44px;
      top: 50%;
      cursor: pointer;
      &:first-child {
        left: 30px;
      }
      &:last-child {
        right: 50px;
      }
    }
  }
}
</style>