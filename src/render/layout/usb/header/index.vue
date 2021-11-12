


<template>
  <a-layout-header>
    <a-row justify="space-around">
      <a-col :flex="0.5" class="header-left" @click="gotoHome">
        <img src="@/assets/image/logo_icon.png" />
        <!-- <select
          class="header-right-select"
          style="width: 120px; height: 30px"
          placeholder="目录分类"
          @change="handlerChange"
        >
          <option key="aa" value="">请选择</option>
          <option v-for="item in pdfData" :key="item.id" :value="item.id">
            {{ item.name }}
          </option>
        </select> -->
      </a-col>
      <a-col :flex="1">
        <a-row class="header-center">
          <a-col
            v-for="p in Menu"
            :id="p.id + 'name-menu'"
            :key="p.name"
            @click="handleToolbar(p)"
            class="header-center-box"
            :class="
              toolbarActiveMenu.get(p.typeClick)?.id == p.id ? 'active' : ''
            "
          >
            <img class="header-center-box-img" :src="p.icon" />
            <span>{{ p.name }}</span>
          </a-col>
        </a-row>
      </a-col>
      <!-- <a-col :flex="0.2" class="header-right">
        <img
          class="zuo_icon"
          src="@/assets/image/zuo_icon.png"
          @click="handlePrev"
        />
        <div class="header-right-input">
          <input v-model="page" @blur="handleBlurPage" />
          <span>/{{ pdfOption.totalPage }}</span>
        </div>
        <img
          class="you_icon"
          src="@/assets/image/you_icon.png"
          @click="handleNext"
        />
      </a-col> -->
    </a-row>
    <!-- <a-button type="primary" @click="showModal">Open Modal</a-button> -->
    <a-modal
      v-model:visible="visible"
      title="帮助"
      @ok="handleOk"
      width="100%"
      wrapClassName="full-modal"
      :footer="null"
    >
      <HelpPage />
    </a-modal>
  </a-layout-header>
</template>


<script lang='ts'>
import HelpPage from "@/pages/help.vue";
import { computed, createVNode, defineComponent, onMounted, ref } from "vue";
import { IMenu, Menu } from "./Menu";
import { mapActions, mapGetters, useStore } from "vuex";
import { Modal, notification } from "ant-design-vue";
import axios from "axios";
import { ipcMain, ipcRenderer } from "electron";
import { LOGOUT } from "@src/common/constant/event";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";

export default defineComponent({
  name: "header",
  components: { HelpPage },
  setup() {
    const visible = ref<boolean>(false);

    const showModal = () => {
      visible.value = true;
    };

    const handleOk = (e: MouseEvent) => {
      console.log(e);
      visible.value = false;
    };
    return {
      visible,
      showModal,
      handleOk,
    };
  },
  data() {
    return {
      Menu,
      pdfData: [],
      page: 0,
      selectType: "",
    };
  },
  computed: {
    ...mapGetters([
      "pdfType",
      "pdfOption",
      "pdfUrl",
      "iframe",
      "toolbarActiveMenu",
    ]),
  },
  watch: {
    "pdfOption.page"(newVal) {
      console.log(newVal, "------pdfOption.page----");
      this.page = this.pdfOption.page;
    },
  },
  mounted() {
    // this.selectType = this.pdfType?.id || 1;
    this.getPeriodicalType();
  },
  methods: {
    ...mapActions([
      "changePdfType",
      "changePdfOption",
      "changeToobarHover",
      "changeSider",
      "gotoHome",
    ]),
    // 获取分类列表
    async getPeriodicalType() {
      const { data } = await axios.get("periodicalType/list");
      console.log(data, "----获取分类列表---");
      this.pdfData = data;
      /*@ts-ignore*/
      // this.pdfData = this.pdfData.concat(data, [{ name: "分类2", id: "3" }]);
      console.log(this.pdfData, "----pdfData---");
    },
    handleBlurPage(val: number) {
      console.log(val, "handleBlurPage");
      this.changePage(this.page);
    },
    changePage(now: number) {
      const { totalPage } = this.pdfOption;
      if (now > 0 && now <= totalPage) {
        this.changePdfOption({
          page: Number(now),
        });
        this.iframe.postMessage(
          { cmd: "pageChange", params: Number(now) },
          "*"
        );
      } else {
        notification.error({
          message: "失败",
          description: "输入的页码错误",
        });
      }
    },
    handlePrev() {
      const { page } = this.pdfOption;
      if (page === 1) {
        notification.info({
          message: "提示",
          description: "已经到了第一页了",
        });
        return false;
      }
      this.iframe.postMessage({ cmd: "prevPage" }, "*");
      this.changePdfOption({
        ...this.pdfOption,
        page: this.pdfOption.page - 1,
      });
    },
    handleNext() {
      const { page, totalPage } = this.pdfOption;
      if (page >= totalPage) {
        notification.info({
          message: "提示",
          description: "已经到了最后一页了",
        });
        return false;
      }

      this.iframe.postMessage({ cmd: "nextPage" }, "*");
      this.changePdfOption({
        ...this.pdfOption,
        page: this.pdfOption.page + 1,
        send: true,
      });
    },
    handlerChange(val: number) {
      // const mode = this.pdfData.find((p) => p.id == val);
      const key = document.getElementsByClassName(
        "header-right-select"
      )[0] as HTMLSelectElement;
      console.log(key);
      /*@ts-ignore*/
      const mode = this.pdfData.find((p) => p.id == key.value);
      console.log(mode);
      if (mode) {
        /*@ts-ignore*/
        this.changePdfType({ name: mode.name, id: mode.id, type: "category" });
      }
    },
    handleToolbar(p: IMenu) {
      switch (p.typeClick) {
        case "MENU":
          const menuMode = this.toolbarActiveMenu.get(p.typeClick);
          if (menuMode) menuMode.active = false;
          this.changeToobarHover({ key: p.typeClick, id: p.id, active: true });
          this.changePdfType({ ...p, type: p.params });
          // const findMode = this.toolbarActiveMenu.get("PDFFIND");
          this.changeToobarHover({
            key: "PDFFIND",
            id: 0,
            active: false,
          });
          this.changeSider({ search: false });
          break;
        case "PDF":
          if (this.pdfUrl) {
            this.changeToobarHover({
              key: p.typeClick,
              id: p.id,
              active: true,
            });
            this.iframe.postMessage({ cmd: p?.params.scale }, "*");
          }
          break;
        case "PDFROTATE":
          if (this.pdfUrl) {
            this.changePdfOption({ ...p });
            this.iframe.postMessage({ cmd: p.params }, "*");
          }
          break;
        case "PDFTOOL":
          if (this.pdfUrl) {
            this.changeToobarHover({
              key: p.typeClick,
              id: p.id,
              active: true,
            });
            this.iframe.postMessage({ cmd: p.params }, "*");
          }
          break;
        case "PDFFIND":
          const mode = this.toolbarActiveMenu.get(p.typeClick);
          let active = true;
          if (mode && mode.id == p.id) {
            active = !mode.active;
          }
          this.changeToobarHover({
            key: p.typeClick,
            id: active ? p.id : 0,
            active: active,
          });
          this.changeSider({ search: active });
          break;
        case "PRINT":
          if (this.pdfUrl) {
            this.iframe.postMessage(
              {
                cmd: p.params,
              },
              "*"
            );
          }
          break;
        case "HELP":
          this.showModal();
          break;
        case "QUIT":
          Modal.confirm({
            title: "退出",
            centered: true,
            icon: createVNode(ExclamationCircleOutlined),
            content: "确认退出U盘书系统吗？",
            okText: "确认",
            cancelText: "取消",
            onOk() {
              ipcRenderer.invoke(LOGOUT);
            },
          });

          break;
        case "HOME":
          this.gotoHome();
          break;
        default:
          break;
      }
    },
  },
});
</script>
<style lang="less">
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    // height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}
</style>
<style lang="less">
.app-usb-layout {
  .ant-layout-header {
    height: var(--header-height);
    background-color: #fff;
    padding: 10px 10px;
    border-bottom: 2px solid rgba(226, 227, 228, 0.75);
    line-height: normal;
    .header-right,
    .header-center,
    .header-left {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
    .header-center {
      &-box {
        width: 70px;
        height: 70px;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        cursor: pointer;
        margin: 2px;
        &.active,
        &:hover {
          background: #e9ecf0;
        }
        &-img {
          max-width: 32px;
          max-height: 32px;
          margin-bottom: 5px;
        }
        span {
          font-weight: bold;
          font-size: 14px;
        }
      }
    }
    .header-right {
      .you_icon,
      .zuo_icon {
        cursor: pointer;
      }
      &-input {
        display: flex;
        flex: 1;
        align-items: baseline;
        border: 1px solid #e1e3e6;
        border-radius: 2px;
        width: 100%;
        text-align: center;
        margin: 2px 14px;
        height: 24px;
        line-height: 24px;
        min-width: 50px;
        input,
        span {
          border: none;
          outline: none;
          text-align: right;
          flex: 1;
          height: 90%;
          width: 0px;
        }
        span {
          text-align: left;
        }
      }
    }
  }
}
</style>