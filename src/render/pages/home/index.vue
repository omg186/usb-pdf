<template>
  <div class="app-pdf-container">
    <!-- <canvas id="the-canvas"></canvas> -->
    <div id="viewerContainer" className="viewerContainer" ref="containerRef">
      <div className="pdfViewer" id="innerContainer" />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
} from "@vue/runtime-core";

import * as pdfjsLib from "pdfjs-dist";
import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist/types/display/api";
//@ts-ignore
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
//@ts-ignore
import * as pdfjsViewer from "pdfjs-dist/web/pdf_viewer.js";
//@ts-ignore
import * as pdfjsCursorTools from "pdfjs-dist/web/pdf_cursor_tools.js";

// import { TextLayerBuilder } from 'pdfjs-dist/web/pdf_viewer';
import "pdfjs-dist/web/pdf_viewer.css";
import {
  PDFLinkService,
  PDFFindController,
  PDFViewer,
  /*@ts-ignore*/
} from "pdfjs-dist/web/pdf_viewer";

import "pdfjs-dist/web/pdf_viewer.css";
import { useStore } from "vuex";
// pdfjsLib.GlobalWorkerOptions.workerSrc =
//   "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.9.359/build/pdf.worker.min.js";
//pdfjsWorker;

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "/static/pdfjs-dist/build/pdf.worker.js";

const eventBus = new pdfjsViewer.EventBus();
const CMAP_URL = "pdfjs-dist/cmaps/";
const CMAP_PACKED = true;
const DEFAULT_URL = "/static/test.pdf";
export default defineComponent({
  setup() {
    const store = useStore();
    // const scale = computed(() => store.getters.pdfOption);
    const pdf = ref<PDFDocumentProxy>();
    const dispatchPage = ref(false);
    const pageNum = ref<number>(1);
    const containerRef = ref<HTMLElement>();
    const findControllerRef = ref<any>();
    const viewer = ref<any>();
    // eventBus.on(
    //   "pagechanging",
    //   function (evt: any) {
    //     const page = evt.pageNumber;
    //     const numPages = pdf.value?.numPages;
    //     console.log(page, numPages, "-----page----numPges");
    //     // document.getElementById("pageNumber").value = page;
    //     // document.getElementById("previous").disabled = page <= 1;
    //     // document.getElementById("next").disabled = page >= numPages;
    //   },
    //   true
    // );

    const changePage = (num: number, dispatch = true) => {
      console.log("改变分页");
      // dispatchPage.value = dispatch;
      if (viewer.value.currentPageNumber === num) return false;
      viewer.value.currentPageNumber = num;
      // pageNum.value = num;
      // if (dispatch) {
      //   changePdfOption({ page: num });
      // }
    };
    const changeScale = (val: string | number) => {
      // const newScale = e.target.value
      console.log("缩放");
      viewer.value.currentScaleValue = val || "page-actual";
      // console.log(viewer.value);
      // setScale(newScale)
    };

    function changeRotate(delta: number) {
      console.log("旋转", viewer.value.pagesRotation);
      viewer.value.pagesRotation = viewer.value.pagesRotation + delta;
    }
    const initialViewer = (url: string) => {
      const linkService = new PDFLinkService();
      const findController = new PDFFindController({
        linkService,
        eventBus,
      });
      findControllerRef.value = findController;
      //PDFSinglePageViewer 单页模式
      const newViewer = new pdfjsViewer.PDFViewer({
        container: containerRef.value,
        linkService,
        // useOnlyCssZoom: false,
        textLayerMode: 1,
        eventBus,
        findController,
        enableScripting: false,
      });
      linkService.setViewer(newViewer);
      // 设置初始缩放
      // newViewer.currentScaleValue = "page-fit";
      const loadingTask = pdfjsLib.getDocument({
        url,
        cMapUrl: CMAP_URL,
        cMapPacked: true,
      });

      loadingTask.promise.then((pdf) => {
        console.log(pdf, "pdf");
        if (pdf) {
          // pdf.getViewerPreferences
          const nums = pdf.numPages;
          changePdfOption({ totalPage: nums, page: 1 });
          pageNum.value = nums;
          newViewer.setDocument(pdf);
          linkService.setDocument(pdf);

          viewer.value = newViewer;

          // // 判断是否已经渲染完毕
          // const interval = setInterval(() => {
          //   loadPdf();
          // }, 1000);
          function loadPdf() {
            if (newViewer.pageViewsReady) {
              // ... 渲染完成操作
              // console.log("渲染完成");
            }
          }
        }
      });
    };
    function changePdfOption(params: any) {
      store.dispatch("changePdfOption", { ...params });
    }
    function setDefaultOption() {
      viewer.value.currentScaleValue = 1;
      findControllerRef.value.executeCommand("find", { query: "Mozilla" });
    }
    function pageChange(evt: any) {
      console.log(evt, "-------evt-----");
      if (dispatchPage) {
        changePdfOption({ page: evt.pageNumber });
      }
    }
    onMounted(() => {
      //   initPdf();
      initialViewer(DEFAULT_URL);
      console.log(containerRef.value);
      eventBus.on("pagesinit", setDefaultOption);
      eventBus.on("pagechanging", pageChange);
      setTimeout(() => {
        // changePage(10);
        // changeRotate(90);
        // changeScale();
      }, 3000);
    });
    onUnmounted(() => {
      eventBus.off("pagesinit", setDefaultOption);
      eventBus.off("pagesinit", pageChange);
    });
    // console.log(store.state.pdfOption, "store.state.pdfOption");
    // watchEffect(() => {
    //   if()
    //   console.log("count改变了", store.state.pdfOption);
    // });
    // watch(scale, (val) => {
    //   console.log("count----改变了", val);
    // });
    return { containerRef, changeScale, changeRotate, changePage };
  },
  watch: {
    "$store.state.pdfOption": function (newVal, oldVal) {
      console.log(newVal, "message");
      if (newVal.scale != oldVal.scale) {
        this.changeScale(newVal.scale);
      } else if (newVal.rotate) {
        this.changeRotate(newVal.rotate);
      } else if (newVal.page !== oldVal.page) {
        this.changePage(newVal.page, false);
      }
    },
  },
});
</script>

<style lang='less'>
.app-pdf-container {
  position: relative;
  height: 100%;
  // overflow: auto;
  #viewerContainer {
    position: absolute;
    overflow: auto;
    width: 100%;
    top: 3rem;
    bottom: 1rem;
    left: 0;
    right: 0;
  }
  // #innerContainer {
  //   // height: 100%;
  //   // overflow: auto;
  // }
}
</style>