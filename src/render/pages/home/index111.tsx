import { defineComponent, onMounted, reactive, ref } from "vue";
// @ts-ignore
import * as pdfjsViewer from "pdfjs-dist/web/pdf_viewer.js";
import * as pdfjsLib from "pdfjs-dist";
//@ts-ignore
import * as pdfjsWorker from "pdfjs-dist/lib/pdf.worker.js";
import "pdfjs-dist/web/pdf_viewer.css";
import "./index.less";
import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist/types/display/api";
const CMAP_URL = "pdfjs-dist/cmaps/";
const CMAP_PACKED = true;

const DEFAULT_URL = "/static/test.pdf";
const PAGE_TO_VIEW = 1;
console.log(pdfjsWorker);
// pdfjsLib.GlobalWorkerOptions
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.9.359/build/pdf.worker.min.js";
//importScripts('pdfjs-dist/lib/pdf.worker.js') pdfjsWorker.WorkerMessageHandler;
// "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.9.359/build/pdf.worker.min.js";

const eventBus = new pdfjsViewer.EventBus();
export default defineComponent({
  setup() {
    const pageContainer = ref<HTMLElement>();
    const pageContainerCanvasBox = ref<HTMLElement>();
    const pageContainerCanvas = ref<HTMLCanvasElement>();
    const pageNumPending = ref<number | null>();
    const pdfDoc = ref<PDFDocumentProxy>();
    // const container = document.getElementById("pageContainer");
    const page = reactive({ pageNum: 1 });
    const pageRendering = ref<boolean>(false);
    onMounted(() => {
      // pdfToCanvas();
      initPdf();
      // setTimeout(() => {
      //   nextPage();
      // }, 3000);
    });
    /**
     * 翻页
     */
    function nextPage() {
      console.log("下一页");
      page.pageNum = 10;
      renderPage(3);
    }
    function initPdf() {
      const loadingTask = pdfjsLib.getDocument({
        url: DEFAULT_URL,
        cMapUrl: CMAP_URL,
        cMapPacked: CMAP_PACKED,
      });
      loadingTask.promise.then(function (pdfDocument) {
        // Document loaded, retrieving the page.
        pdfDoc.value = pdfDocument;
        renderPage(pageNumPending.value || 1);
        // renderPDF(1);
        // console.log(pdfDocument);
      });
    }
    function renderPage(num: number = 1) {
      const container = pageContainerCanvas.value;
      // console.log(pageContainer);
      const ctx = container?.getContext("2d");
      if (!ctx || !container) {
        console.error("没有获取到canvas");
        return false;
      }
      pageRendering.value = true;
      // Using promise to fetch the page
      pdfDoc.value?.getPage(num).then(function (page) {
        var CSS_UNITS = 96.0 / 72.0;
        var unscaledViewport = page.getViewport({ scale: 1 });
        var scale = Math.min(
          1000 / unscaledViewport.height,
          1000 / unscaledViewport.width
        );
        console.log(scale, "scale", container.height, unscaledViewport.height);

        var viewport = page.getViewport({ scale });
        // var viewport = page.getViewport({ scale: 1.5 });
        container.setAttribute("id", "page-" + num);
        container.setAttribute("style", "position: relative");
        container.height = 1000;
        container.width = 1000;

        // Render PDF page into canvas context
        var renderContext = {
          // transform: [CSS_UNITS, 0, 0, CSS_UNITS, 0, 0],
          canvasContext: ctx,
          viewport: viewport,
        };
        var renderTask = page.render(renderContext);
        // Wait for rendering to finish
        renderTask.promise
          .then(function () {
            pageRendering.value = false;
            if (pageNumPending.value !== null) {
              // New page rendering is pending
              renderPage(pageNumPending.value || 1);
              pageNumPending.value = null;
            }
            return page.getTextContent();
          })
          .then((textContent) => {
            if (textContent) {
              console.log(textContent);
              // const textContent = page.getTextContent();
              // 创建文本图层div
              const textLayerDiv = document.createElement("div");
              textLayerDiv.setAttribute("class", "textLayer");

              // const height = Math.floor(viewport.height - 200);
              // const width = Math.floor(viewport.width - 200);
              // textLayerDiv.setAttribute(
              //   "style",
              //   `height: ${height}px;width:${width}px;transform: scaleX(1.333);`
              // );
              // 将文本图层div添加至每页pdf的div中
              pageContainerCanvasBox.value?.appendChild(textLayerDiv);
              // 创建新的TextLayerBuilder实例
              var textLayer = new pdfjsViewer.TextLayerBuilder({
                textLayerDiv: textLayerDiv,
                pageIndex: page.pageNumber,
                viewport: viewport,
                // transform: [CSS_UNITS, 0, 0, CSS_UNITS, 0, 0],
                eventBus: {
                  _on: () => {
                    console.log("222", arguments);
                  },
                  dispatch: () => {
                    console.log("dispatch", arguments);
                  },
                },
              });

              textLayer.setTextContent(textContent);

              textLayer.render();
            }
          });
        // page.render(renderContext);
      });
      // Update page counters
      // document.getElementById('page_num').textContent = num;
    }
    function renderPDF(num: number) {
      pdfDoc.value?.getPage(num).then((page) => {
        var scale = 1.5;
        var viewport = page.getViewport({ scale });
        const pageDiv = document.createElement("div");
        pageDiv.setAttribute("id", "page-" + (page.pageNumber + 1));
        pageDiv.setAttribute("style", "position: relative");
        pageContainer.value?.appendChild(pageDiv);
        var canvas = document.createElement("canvas");
        pageDiv.appendChild(canvas);
        const context = canvas.getContext("2d");
        if (context) {
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          var renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          page
            .render(renderContext)
            .promise.then(() => {
              return page.getTextContent();
            })
            .then((textContent) => {
              // 创建文本图层div
              const textLayerDiv = document.createElement("div");
              textLayerDiv.setAttribute("class", "textLayer");
              // 将文本图层div添加至每页pdf的div中
              pageDiv.appendChild(textLayerDiv);

              // 创建新的TextLayerBuilder实例
              var textLayer = new pdfjsViewer.TextLayerBuilder({
                textLayerDiv: textLayerDiv,
                pageIndex: page.pageNumber,
                viewport: viewport,
              });

              textLayer.setTextContent(textContent);

              textLayer.render();
            });
          // page.render(renderContext);
        }
      });
    }
    return () => (
      <div class="app-pdf-container">
        <div class="app-pdf-container-box" ref={pageContainerCanvasBox}>
          <canvas
            id="viewer"
            class="pdfViewer"
            ref={pageContainerCanvas}
          ></canvas>
          {/* <div id="viewerContainer" ref={pageContainer}></div> */}
        </div>
      </div>
    );
  },
});
function pdfToCanvas() {
  return new Promise(async (resolve, reject) => {
    const pdfData = pdfjsLib.getDocument(DEFAULT_URL);
    console.log("pdfToCanvas", pdfData);
    pdfData.promise.then((p) => {
      console.log("pdfToCanvas-promise", p);
    });
    // const fragment = document.createDocumentFragment();

    // const canvasBox = this.;
    // const numPages = pdfData.numPages;

    // for (let i = 1; i <= numPages; i++) {
    //   let canvas = document.createElement("canvas");
    //   let scale = 1;
    //   let page = await pdfData.getPage(i);
    //   let viewport = page.getViewport(scale); // reference canvas via context

    //   canvas.id = "pageNum" + i;
    //   canvas.width = viewport.width;
    //   canvas.height = viewport.height;
    //   canvas.style.width = "100%";
    //   canvas.style.height = "100%";

    //   let renderContext = {
    //     canvasContext: canvas.getContext("2d"),
    //     viewport: viewport,
    //   };
    //   page.render(renderContext);

    //   fragment.appendChild(canvas);
    // }
    // canvasBox.appendChild(fragment);
    // setTimeout(() => {
    //   resolve(); //防止 canvas 没有绘制完
    // }, 5000);
  });
}
