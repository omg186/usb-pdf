import { Row, Col, Space } from "ant-design-vue";
import { defineComponent } from "vue";
import gundongyuedu_icon from "@/assets/image/gundongyuedu_icon.png";
import fanyeyuedu_icon from "@/assets/image/fanyeyuedu_icon.png";
import fangda_icon from "@/assets/image/fangda_icon.png";
import suoxiao_icon from "@/assets/image/suoxiao_icon.png";
import "./index.less";
import { mapGetters, useStore } from "vuex";
export default defineComponent({
  setup() {
    const store = useStore();
    /**
     * 阅读方式
     */
    function readingMode(mode?: string) {
      const iframe = store.getters.iframe as Window;
      iframe.postMessage({ cmd: "spread", params: mode }, "*");
      let spreadMode = 1;
      if (!mode) {
        spreadMode = 0;
      }
      store.dispatch("changePdfOption", { spreadMode });
    }
    /**
     * 放大 缩小
     */
    function setScaleValue(mode?: string) {
      const iframe = store.getters.iframe as Window;
      iframe.postMessage({ cmd: "zoom", params: mode }, "*");
    }
    // const pdfOption = computed(() => store.getters.pdfOption);
    // console.log(pdfOption, "scaleValue:pdfOption.value. ");
    // const { scaleValue } = pdfOption.value;
    return {
      readingMode,
      setScaleValue,
      //   pdfOption: pdfOption,
      //   scaleValue: (pdfOption.value.scaleValue * 100).toFixed(),
    };
  },
  computed: {
    ...mapGetters(["pdfOption"]),
    scaleValue() {
      //@ts-ignore
      const value = this.pdfOption.scaleValue;
      if (value && Number.isFinite(value)) {
        return (value * 100).toFixed(0) + "%";
      }

      return null;
    },
  },
  render() {
    return (
      <Row class="usb-app-footer" justify="center">
        <Col span="8" push="2">
          <Space>
            <div
              class="usb-app-footer-page"
              onClick={() => {
                this.setScaleValue("zoomIn");
              }}
            >
              <img src={fangda_icon} alt="" srcset="" />
              <span>放大</span>
            </div>
            <div
              class="usb-app-footer-page"
              onClick={() => {
                this.setScaleValue("zoomOut");
              }}
            >
              <img src={suoxiao_icon} alt="" srcset="" />
              <span>缩小</span>
            </div>
            <p>{this.scaleValue}</p>
          </Space>
        </Col>
        <Col span="8" push="2">
          <Space>
            <div class="usb-app-footer-page" onClick={() => this.readingMode()}>
              <img src={gundongyuedu_icon} alt="" srcset="" />
              <span>单页视图</span>
            </div>
            <div
              class="usb-app-footer-page"
              onClick={() => this.readingMode("odd")}
            >
              <img src={fanyeyuedu_icon} alt="" srcset="" />
              <span>双页视图</span>
            </div>
          </Space>
        </Col>
      </Row>
    );
  },
});
