<template>
  <div class="sider-wrap">
    <a-tabs
      type="card"
      v-show="!sider.search"
      size="large"
      v-model:activeKey="activeKey"
    >
      <a-tab-pane
        key="1"
        :tab="tabsFirst.name"
        v-if="tabsFirst.type == 'periodical'"
      >
        <div class="sider-wrap-menu">
          <a-directory-tree
            v-if="treeData.length"
            v-model:selectedKeys="selectedKeys"
          >
            <a-tree-node
              :key="`s-${i}`"
              :title="item.name"
              v-for="(item, i) in treeData"
            >
              <a-tree-node
                :key="`s-${i}-${k}`"
                :title="p.name"
                v-for="(p, k) in item.periodicalList"
                @click="handleSelect"
                is-leaf
              />
            </a-tree-node>
          </a-directory-tree>
        </div>
      </a-tab-pane>
      <a-tab-pane
        key="2"
        :tab="tabsFirst.name"
        v-if="tabsFirst.type == 'catalogue'"
      >
        <div class="sider-wrap-menu">
          <a-directory-tree
            v-if="treeListData.length"
            v-model:selectedKeys="selectedKeysCatalogue"
          >
            <a-tree-node
              :key="`f-${i}`"
              :title="item.name"
              v-for="(item, i) in treeListData"
            >
              <a-tree-node
                :key="`f-${i}-${k}`"
                :title="p.name"
                v-for="(p, k) in item.periodicalList"
                is-leaf
              />
            </a-tree-node>
          </a-directory-tree>
        </div>
      </a-tab-pane>
      <a-tab-pane
        key="3"
        :tab="tabsFirst.name"
        v-if="tabsFirst.type == 'category'"
      >
        <div class="sider-wrap-menu">
          <a-directory-tree
            v-if="treeBookMarksData.length"
            v-model:selectedKeys="selectedTreeBookMarksKeys"
          >
            <a-tree-node
              :key="`tb-${i}`"
              :title="item.mark"
              v-for="(item, i) in treeBookMarksData"
              :is-leaf="!item.tree || item.tree.length == 0"
            >
              <a-tree-node
                :key="`tb-${i}-${k}`"
                :title="p.mark"
                v-for="(p, k) in item.tree"
                @click="handleSelect"
                is-leaf
              />
            </a-tree-node>
          </a-directory-tree>
        </div>
      </a-tab-pane>
      <a-tab-pane key="4" tab="书签">
        <a-list size="small" :data-source="[1]">
          <template #renderItem>
            <a-list-item>
              <a-button type="dashed" @click="showModal" block>
                添加书签
              </a-button>
            </a-list-item>
          </template>
        </a-list>
        <a-list size="small" bordered :data-source="bookmark">
          <template #renderItem="{ item, index }">
            <a-list-item
              class="book-mark-list"
              @click.stop="handleJumpBookMark(item)"
            >
              <img src="@/assets/image/shuqiantubiao_icon.png" />
              {{ item.name }}
              <template #actions>
                <a-popconfirm
                  title="确定删除书签吗?"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm.stop="handleRemoveBookMark(item, index)"
                >
                  <img
                    style="cursor: pointer"
                    src="@/assets/image/shanchu_icon.png"
                  />
                </a-popconfirm>
              </template>
            </a-list-item>
          </template>
        </a-list>
      </a-tab-pane>
      <a-tab-pane key="6" tab="标注">
        <a-list size="small" bordered :data-source="markData">
          <template #renderItem="{ item, index }">
            <a-list-item class="mark-list" @click="searchMark(item)">
              <a-space direction="vertical" size="small">
                <!--icon 原文 删除修改-->
                <p class="mark-item">
                  <i class="icon" style="width: 20px">
                    <img
                      src="@/assets/image/biaozhu_icon.png"
                      alt=""
                      srcset=""
                    />
                  </i>
                  <span class="title">原文:</span>
                  <span class="option">
                    <EyeOutlined @click.stop="handleDetailMark(item, index)" />
                    <img
                      src="@/assets/image/1_icon.png"
                      @click.stop="handleEditMark(item, index)"
                      alt=""
                      srcset=""
                    />
                    <img
                      @click.stop="handleRemoveMark(item, index)"
                      src="@/assets/image/shanchu_icon.png"
                      alt=""
                      srcset=""
                    />
                  </span>
                </p>
                <p class="mark-item">
                  <i class="icon" style="width: 20px"></i>
                  <a-typography-text ellipsis class="ellipsis">
                    {{ item.name }}
                  </a-typography-text>
                </p>
                <p class="mark-item">
                  <i class="icon" style="width: 20px"></i>
                  <span class="title">标注:</span>
                </p>

                <p class="mark-item">
                  <i class="icon" style="width: 20px"></i>
                  <a-typography-text ellipsis class="ellipsis">
                    {{ item.note }}
                  </a-typography-text>
                </p>
                <!-- 标注 -->
              </a-space>
            </a-list-item>
          </template>
        </a-list>
      </a-tab-pane>
    </a-tabs>
    <a-tabs
      type="card"
      v-show="sider.search"
      v-model:activeKey="activeKeySearch"
    >
      <a-tab-pane key="1" tab="文本搜索" class="text-search">
        <a-space
          direction="vertical"
          style="width: 100%"
          class="text-search-space"
        >
          <a-row class="text-search-input">
            <a-col span="24">
              <!-- <a-tooltip title="请输入关键字" placement="bottom"> -->
              <a-input-search
                v-model:value="textSearch"
                placeholder="请输入关键字"
                enter-button
                :loading="textSearchLoading"
                @search="handleTextSearch"
              />
              <!-- </a-tooltip> -->
            </a-col>
          </a-row>
          <a-row justify="end" class="text-search-button">
            <a-col>
              <a-space>
                <a-button @click="handleFindNext"> 上一个 </a-button>
                <a-button @click="handleFindPrevious"> 下一个 </a-button>
              </a-space>
            </a-col>
          </a-row>
          <a-list
            item-layout="horizontal"
            class="text-search-list"
            bordered
            :data-source="textSearchList"
            :loading="textSearchLoading"
          >
            <template #renderItem="{ item }">
              <a-list-item @click="handleTextSearchFun(item)">
                <a-typography-text ellipsis class="ellipsis">
                  {{ item.name }}
                </a-typography-text>
              </a-list-item>
            </template>
          </a-list>
        </a-space>
      </a-tab-pane>
      <a-tab-pane key="2" tab="文件搜索" force-render class="file-search">
        <a-space
          direction="vertical"
          style="width: 100%"
          class="text-search-space"
        >
          <a-row class="text-search-input">
            <a-col span="24">
              <a-tooltip
                title="输入专刊全称或全称加上期号（年-期数）搜索更为准确。"
                placement="bottom"
              >
                <a-input-search
                  v-model:value="fileSearch"
                  placeholder="输入专刊全称或全称加上期号（年-期数）搜索更为准确"
                  enter-button
                  :loading="fileSearchLoading"
                  @search="handleFileSearch"
                />
              </a-tooltip>
            </a-col>
          </a-row>

          <a-list
            item-layout="horizontal"
            class="text-search-list"
            bordered
            :data-source="fileSearchList"
            :loading="fileSearchLoading"
          >
            <template #renderItem="{ item }">
              <a-list-item @click="handleFileSearchFun(item)">
                {{ item.name }}
              </a-list-item>
            </template>
          </a-list>
        </a-space>
      </a-tab-pane>
    </a-tabs>
    <vxe-modal
      v-model="visible"
      title="添加书签"
      ok-text="确认"
      cancel-text="取消"
    >
      <template #default>
        <a-row :gutter="[20, 20]" type="flex" justify="end">
          <a-col :span="24">
            <a-textarea
              v-model:value="value2"
              placeholder="请输入书签名称"
              :auto-size="{ minRows: 2, maxRows: 5 }"
            />
          </a-col>
          <a-col :span="10">
            <a-space>
              <a-button
                type="primary"
                @click="handleOk"
                :disabled="addLodingValue2"
                :loading="addLodingValue2"
              >
                提交
              </a-button>
              <a-button type="reset" @click="visible = false">取消</a-button>
            </a-space>
          </a-col>
        </a-row>
      </template>
    </vxe-modal>
    <vxe-modal
      v-model="visibleAddMark"
      :title="visibleAddMarkTitle"
      width="50%"
      ok-text="确认"
      cancel-text="取消"
      @ok="handleAddMark"
      @cancel="handleCancelMark"
    >
      <template #default>
        <a-row :gutter="[20, 20]" type="flex" justify="end">
          <a-col :span="24">
            <a-form>
              <a-form-item label="原文">
                <a-textarea
                  v-model:value="addMark.original"
                  :auto-size="{ minRows: 2, maxRows: 5 }"
                  disabled
                />
              </a-form-item>
              <a-form-item label="标注">
                <a-textarea
                  v-model:value="addMark.markText"
                  :auto-size="{ minRows: 2, maxRows: 5 }"
                />
              </a-form-item>
            </a-form>
          </a-col>
          <a-col :span="5">
            <a-space>
              <a-button
                type="primary"
                @click="handleAddMark"
                :disabled="addMarkLoding"
                :loading="addMarkLoding"
              >
                提交
              </a-button>
              <a-button type="reset" @click="visibleAddMark = false">
                取消
              </a-button>
            </a-space>
          </a-col>
        </a-row>
      </template>
    </vxe-modal>
    <a-modal
      v-model:visible="visibleDetailMark"
      title="查看标注"
      width="50%"
      @ok="handleAddMark"
      @cancel="handleCancelMark"
    >
      <a-form>
        <a-form-item label="原文">
          <a-textarea
            v-model:value="addMark.original"
            :auto-size="{ minRows: 2, maxRows: 5 }"
            disabled
          />
        </a-form-item>
        <a-form-item label="标注">
          <a-textarea
            v-model:value="addMark.markText"
            :auto-size="{ minRows: 2, maxRows: 5 }"
            disabled
          />
        </a-form-item>
      </a-form>
      <template #footer><span></span> </template>
    </a-modal>
  </div>
</template>

<script lang='ts'>
import { EyeOutlined } from "@ant-design/icons-vue";
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  watch,
  reactive,
} from "vue";
import { mapActions, mapGetters, useStore } from "vuex";
import axios from "axios";
import qs from "qs";
import { notification } from "ant-design-vue";
import { debounce } from "lodash";
export interface SiderMenu {
  title?: string;
  icon?: JSX.Element | null;
  path: string;
  render?: Function;
}
interface IMarkData {
  id: string;
  page: number;
  name: string;
  note: string;
  periodId: string;
}
interface IMarkDataAdd {
  page: number;
  name: string;
  note: string;
  periodId: string;
}
interface IBookMark {
  id: string;
  name: string;
  page: number;
  periodId: string;
}
interface IBookMarkAdd {
  periodId: string;
  name: string;
  page: string;
}
export default defineComponent({
  name: "Sider",
  components: { EyeOutlined },
  setup() {
    const store = useStore();
    const expandedKeys = ref<string[]>([]);
    const selectedKeys = ref<string[]>([]);
    const selectedKeysCatalogue = ref<string[]>([]);
    const selectedTreeBookMarksKeys = ref<string[]>([]);
    const checkedKeys = ref<string[]>([]);
    const treeData = ref<any[]>([]);
    const treeListData = ref<Object[]>([]);
    const treeBookMarksData = ref<any[]>([]);
    const treeCateGoryData = ref<Object[]>([]);
    const editMark = ref<string>();
    const activeKeySearch = ref<string>("1");
    let bookmark = ref<IBookMark[]>([]);
    let currentBookId = ref<string>("");
    const markData = ref<IMarkData[]>([]);
    const visibleAddMark = ref<boolean>(false);
    const visibleAddMarkTitle = ref<string>("增加标注");
    const visibleDetailMark = ref<boolean>(false);
    const addMark = ref({ original: "", page: 0, markText: "" });
    const visible = ref<boolean>(false);
    const addLodingValue2 = ref<boolean>(false);
    const addMarkLoding = ref<boolean>(false);
    const value2 = ref<string>("");
    const textSearch = ref<string>("");
    const fileSearch = ref<string>("");
    const fileSearchLoading = ref<boolean>(false);
    const fileSearchList = ref<string[]>([]);
    const textSearchList = ref<string[]>([]);
    const textSearchLoading = ref<boolean>(false);
    const showModal = () => {
      visible.value = true;
    };
    function handleFindPrevious() {
      store.getters.iframe.postMessage({ cmd: "findNext" }, "*");
    }
    function handleFindNext() {
      store.getters.iframe.postMessage({ cmd: "findPrevious" }, "*");
    }
    async function handleFileSearch() {
      fileSearchLoading.value = true;
      await NetSearchList(fileSearch.value);
      // setTimeout(() => {
      fileSearchLoading.value = false;
      // }, 3000);
    }
    async function handleTextSearch() {
      textSearchLoading.value = true;
      await NetluceneSearchList(textSearch.value).catch(() => {
        textSearchLoading.value = false;
      });
      // setTimeout(() => {
      textSearchLoading.value = false;
      // }, 3000);
    }
    // 跳转到标签
    function handleJumpBookMark(val: IBookMark) {
      store.getters.iframe.postMessage(
        { cmd: "pageChange", params: val.page },
        "*"
      );
    }
    // 删除书签
    function handleRemoveBookMark(val: IBookMark, i: number) {
      // bookmark.splice(i, 1);
      NetBookMarkDel(val.id);
    }
    async function handleRemoveMark(val: IMarkData, i: number) {
      console.log(i);
      markData.value.splice(i, 1);

      const res = await axios.post("tagging/del?id=" + val.id);
      const { success } = res.data;
      if (success) {
        // NetTaggingList(currentBookId.value);
        initMark(true);
      }
    }
    function handleCancelMark() {
      editMark.value = "";
      visibleDetailMark.value = false;
      visibleAddMark.value = false;
    }
    function handleDetailMark(val: IMarkData, index: number) {
      editMark.value = val.id;
      visibleDetailMark.value = true;
      addMark.value.original = val.name;
      addMark.value.markText = val.note;
      addMark.value.page = val.page;
    }
    function handleEditMark(val: IMarkData, index: number) {
      editMark.value = val.id;
      addMarkFun({
        page: val.page,
        text: val.name,
        markText: val.note,
      });
    }
    async function handleAddMark() {
      const { page, original, markText } = addMark.value;
      addMarkLoding.value = true;
      if (editMark.value) {
        await NetTaggingPut(editMark.value, markText);
      } else {
        await NetTaggingAdd({
          page,
          name: original.replace(/\n/g, ""),
          note: markText,
          periodId: currentBookId.value,
        });
      }
      addMarkLoding.value = false;
      visibleAddMark.value = false;
      editMark.value = "";
      addMark.value = { page: 0, original: "", markText: "" };
      // initMark(true);
    }
    function addMarkFun(params: any) {
      console.log(params, editMark.value);
      addMark.value.markText = "增加标注";
      if (editMark.value) {
        visibleAddMarkTitle.value = "修改标注";
        addMark.value.markText = params.markText;
      }
      if (params.text) {
        visibleAddMark.value = true;
        addMark.value.original = params.text;
        addMark.value.page = params.page;

        return false;
      }
      notification.error({
        message: "没有找到文本",
        description: "请在PDF中选中一段文本",
      });
    }
    // 初始化标注
    function initMark(render: boolean = false) {
      // console.log(store.getters.iframe, "----store.getters.iframe---");
      // console.log(JSON.stringify(markData), "----JSON.stringify(markData)---");
      store.getters.iframe.postMessage(
        {
          cmd: "initMark",
          params: {
            value: JSON.stringify(
              markData.value.map((p) => ({ original: p.name }))
            ),
            render,
          },
        },
        "*"
      );
    }
    // 搜索标注
    function searchMark(val: any) {
      store.getters.iframe.postMessage(
        { cmd: "pageChange", params: val.page },
        "*"
      );
    }
    const handleOk = (e: MouseEvent) => {
      if (!value2.value) {
        notification.error({
          message: "提示",
          description: "请输入书签内容",
        });
        return false;
      }
      const page = store.getters.pdfOption.page;
      const pdfUrl = store.getters.pdfUrl;
      const text = value2.value;
      if (!page || !text || !pdfUrl) {
        notification.error({
          message: "提示",
          description: "没有找到页码或者没有输入书签内容",
        });
        return false;
      }
      addLodingValue2.value = true;
      // bookmark.push({ id: "20", name: text, page });
      NetBookMarkAdd({ name: text, page, periodId: currentBookId.value });
      value2.value = "";
      visible.value = false;
      addLodingValue2.value = false;
    };
    function treeChangePdf(first: string, dataSourse: any[]) {
      if (!first) {
        return false;
      }
      const splitArr = first.split("-");
      if (splitArr.length === 3) {
        const mode = dataSourse[Number(splitArr[1])];
        const child = mode.periodicalList[Number(splitArr[2])];
        currentBookId.value = child.id;
        store.dispatch("changePdfUrl", child.name);
      }
    }

    watch(selectedTreeBookMarksKeys, () => {
      const [first] = selectedTreeBookMarksKeys.value;
      // treeChangePdf(first, treeBookMarksData.value);
      const splitArr = first.split("-");
      if (splitArr.length > 1) {
        const mode = treeBookMarksData.value[Number(splitArr[1])];
        console.log(mode, "mode------");
        if (!mode.tree || mode.tree.length === 0) {
          if (mode.path == "null") {
            notification.warning({
              message: "路径丢失",
              description: `文件路径为空`,
            });
            return false;
          }
          currentBookId.value = mode.id;
          store.dispatch("changePdfUrl", mode.path);
          return false;
        }
        const child = mode.tree[Number(splitArr[2])];
        if (child && child.path) {
          currentBookId.value = child.id;

          store.dispatch("changePdfOption", {
            page: Number(child.page),
          });
          store.getters.iframe.postMessage(
            { cmd: "pageChange", params: Number(child.page) },
            "*"
          );
          store.dispatch("changePdfUrl", child.path);
          store.dispatch("changeBeforeInitPdfRender", () => {
            console.log("加载完成，’--------");
            setTimeout(() => {
              store.dispatch("changePdfOption", {
                page: child.page,
              });
              store.getters.iframe.postMessage(
                { cmd: "pageChange", params: child.page },
                "*"
              );
            }, 1000);
          });
        }
      }
      console.log(
        "selectedTreeBookMarksKeys",
        selectedTreeBookMarksKeys,
        selectedTreeBookMarksKeys.value
      );
    });
    watch(selectedKeys, () => {
      const [first] = selectedKeys.value;
      treeChangePdf(first, treeData.value);
      console.log("selectedKeys", selectedKeys, selectedKeys.value);
    });
    watch(selectedKeysCatalogue, () => {
      const [first] = selectedKeysCatalogue.value;
      treeChangePdf(first, treeListData.value);
      console.log(
        "checkedKeys",
        selectedKeysCatalogue,
        selectedKeysCatalogue.value
      );
    });
    // 期刊列表
    async function NetRequest() {
      const res = await axios.get("/periodical/list");
      const { success, data } = res.data;
      if (success) {
        treeData.value = data;
      }
    }
    /**
     * 增加书签列表
     */
    async function NetTaggingAdd(mode: IMarkDataAdd) {
      const res = await axios.post("tagging/add", qs.stringify({ ...mode }));
      const { success, data } = res.data;
      if (success) {
        notification.success({
          message: "成功",
          description: "增加标注成功！",
        });
        NetTaggingList(currentBookId.value);
        return false;
      }
      notification.error({
        message: "失败",
        description: "增加标注失败，" + JSON.stringify(data),
      });
    }
    /**
     * 修改批注列表
     */
    async function NetTaggingPut(id: string, note: string) {
      const res = await axios.post(
        "tagging/update",
        qs.stringify({ id, note })
      );
      const { success, data } = res.data;
      console.log(success, "NetTaggingList");
      if (success) {
        notification.success({
          message: "成功",
          description: "修改标注成功！",
        });
        NetTaggingList(currentBookId.value);
        return false;
      }
      notification.error({
        message: "失败",
        description: "修改标注失败，" + JSON.stringify(data),
      });
    }
    /**
     * 获取批注列表
     */
    async function NetTaggingList(id: string) {
      markData.value = [];
      const res = await axios.get("tagging/list?id=" + id);
      const { success, data } = res.data;
      console.log(success, "NetTaggingList");
      if (success) {
        console.log(data, "NetTaggingList");
        // Object.assign(bookmark, data);
        markData.value = data;
        setTimeout(() => {
          initMark();
        }, 1000);
      }
    }
    /**
     * 增加书签列表
     */
    async function NetBookMarkAdd(mode: IBookMarkAdd) {
      const res = await axios.post("bookMark/add", qs.stringify({ ...mode }));
      const { success, data } = res.data;
      if (success) {
        notification.success({
          message: "成功",
          description: "增加书签成功！",
        });
        NetBookMarkList(currentBookId.value);
        return false;
      }
      notification.error({
        message: "失败",
        description: "增加书签失败，" + JSON.stringify(data),
      });
    }
    /**
     * 珊瑚书签列表
     */
    async function NetBookMarkDel(id: string) {
      const res = await axios.post("bookMark/del?id=" + id);
      const { success, data } = res.data;
      if (success) {
        notification.success({
          message: "成功",
          description: "删除书签成功！",
        });
        NetBookMarkList(currentBookId.value);
        return false;
      }
      notification.error({
        message: "失败",
        description: "删除书签失败，" + JSON.stringify(data),
      });
    }
    /**
     * 获取书签列表
     */
    async function NetBookMarkList(id: string) {
      bookmark.value = [];
      const res = await axios.get("bookMark/list?id=" + id);
      const { success, data } = res.data;
      console.log(success, "NetBookMarkList");
      if (success) {
        console.log(data, "NetBookMarkList");
        // Object.assign(bookmark, data);
        bookmark.value = data;
      }
    }
    // 这个是目录分类
    async function NetTypeList() {
      const res = await axios.get("periodical/typeList");
      console.log(res, "res");
      const { success, data } = res.data;
      if (success) {
        treeListData.value = data;
      }
    }
    // 这个是期刊分类
    async function NetCategoryTypeList(id: string, name: string) {
      // const res = await axios.get("periodical/typeByIdList?typeId=" + id);
      // if (!store.getters.pdfName) {
      //   treeData.value = [];
      //   return false;
      // }
      const res = await axios.get("file/getPdfBookMarks");
      console.log(res, "res");
      const { success, data } = res.data;
      if (success) {
        /*@ts-ignore*/
        treeBookMarksData.value = data;
      }
    }
    function handleMessage(data: any) {
      const params = data.data;
      switch (params.cmd) {
        case "addMark":
          addMarkFun(params.params);
          break;
      }
    }

    /**
     * 获取文件
     */
    async function NetSearchList(name: string) {
      if (!fileSearch.value) {
        return false;
      }
      const res = await axios.get("periodical/select?name=" + fileSearch.value);
      const { success, data } = res.data;
      console.log(success, "NetTaggingList");
      if (success) {
        console.log(data, "NetTaggingList");
        fileSearchList.value = data;
      }
    }
    /**
     * 获取文字
     */
    async function NetluceneSearchList(name: string) {
      if (!textSearch.value) {
        return false;
      }
      // if (textSearch.value.length > 13) {
      //   notification.warning({
      //     message: "搜索",
      //     description: "请在13个字以内进行搜索",
      //     placement: "topLeft",
      //   });
      //   return false;
      // }
      const res = await axios.get(
        "luceneSearch/select?name=" + textSearch.value
      );
      const { success, data } = res.data;
      console.log(success, "NetTaggingList");
      if (success) {
        console.log(data, "NetTaggingList");
        textSearchList.value = data;
        // Object.assign(bookmark, data);
      }
    }
    onMounted(() => {
      window.addEventListener("message", handleMessage);
      NetRequest();
      // 标注
      // setTimeout(() => {
      //   initMark();
      // }, 1000);
    });
    return {
      addMarkLoding,
      addLodingValue2,
      treeListData,
      selectedTreeBookMarksKeys,
      treeBookMarksData,
      selectedKeysCatalogue,
      handleFindNext,
      handleFindPrevious,
      visibleDetailMark,
      visibleAddMarkTitle,
      handleCancelMark,
      handleDetailMark,
      textSearchList,
      NetBookMarkList,
      fileSearchList,
      textSearchLoading,
      activeKeySearch,
      handleJumpBookMark,
      handleRemoveMark,
      handleEditMark,
      addMark,
      handleAddMark,
      visibleAddMark,
      handleRemoveBookMark,
      searchMark,
      markData,
      value2,
      treeCateGoryData,
      visible,
      handleFileSearch,
      fileSearch,
      fileSearchLoading,
      showModal,
      handleTextSearch,
      textSearch,
      handleOk,
      NetTaggingList,
      currentBookId,
      bookmark,
      treeData,
      expandedKeys,
      selectedKeys,
      checkedKeys,
      NetTypeList,
      NetRequest,
      initMark,
      NetCategoryTypeList,
      sider: computed(() => store.getters.sider),
      tabsFirst: computed(() => store.getters.pdfType),
    };
  },
  watch: {
    textSearch: function (val) {
      console.log(val, "------textSearch-----");
      if (val && this.pdfUrl) {
        this.sendTextSearchCmdDebunce();
      }
    },
    pdfUrl: function (node) {
      // console.log("------initMark----");
      this.markData = [];
      this.bookmark = [];
      // this.initMark();
      if (node) {
        // this.currentBookId = node.id;
        console.log(this.currentBookId, "   console.log(this.currentBookId);");
        this.NetBookMarkList(this.currentBookId);
        this.NetTaggingList(this.currentBookId);
      }
    },
    tabsFirst: function (newVal, oldVal) {
      if (newVal.type === "catalogue") {
        this.NetTypeList();
        this.activeKey = "2";
      } else if (newVal.type === "periodical") {
        this.NetRequest();
        this.activeKey = "1";
      } else if (newVal.type === "category") {
        this.activeKey = "3";
        /*@ts-ignore*/
        this.NetCategoryTypeList(newVal.id);
      }
    },
    activeKey(val) {
      if (this.iframe) {
        if (val == "6") {
          this.iframe.postMessage({ cmd: "markeStatus", params: true }, "*");
          return false;
        }
        this.iframe.postMessage({ cmd: "markeStatus", params: null }, "*");
      }
    },
  },
  computed: {
    ...mapGetters(["pdfUrl", "iframe"]),
    // tabsFirst() {
    //   return tabsData.find((p) => p.id == this.pdfType.id);
    // },
  },
  data() {
    return { activeKey: "1", sendTextSearchCmdDebunce: () => {} };
  },
  mounted() {
    window.addEventListener("message", this.handleMessage);
    this.sendTextSearchCmdDebunce = debounce(this.sendTextSearchCmd, 500);
  },
  methods: {
    ...mapActions(["changePdfUrl"]),
    handleMessage(data: any) {
      //   console.log(data);
      const params = data.data;
      console.log(params.cmd, "params.cmd-----");
      switch (params.cmd) {
        case "initRender":
          console.log("initRender");
          this.sendTextSearchCmdDebunce();
          break;
      }
    },
    sendTextSearchCmd() {
      console.log("-----发送-----");
      this.iframe.postMessage(
        { cmd: "searchText", params: { value: this.textSearch } },
        "*"
      );
    },
    handleFileSearchFun(item: IMarkData) {
      // open
      this.currentBookId = item.id;
      this.changePdfUrl(item.name);
      // this.NetBookMarkList(node.id);
      // this.NetTaggingList(node.id);
      // 高亮文字
    },
    handleTextSearchFun(item: IMarkData) {
      this.currentBookId = item.id;
      this.changePdfUrl(item.name);
      // this.iframe.postMessage(
      //   { cmd: "searchText", params: { value: this.textSearch } },
      //   "*"
      // );
    },
    handleSelect(selectedKeys: any, e: any) {
      if (e.selected && e.selectedNodes[0]) {
        const node = e.selectedNodes[0].props;
        if (!node.periodicalList || node.periodicalList.length == 0) {
          this.currentBookId = node.id;
          this.changePdfUrl(node.name);
          return;
        }
      }
      // if(this.tabsFirst.type==='periodical'){
      //   const index = this.selectedKeys.indexOf(selectedKeys[0]);
      //   if(index > -1) {
      //     !e.selected ? this.selectedKeys.splice(index,1):this.selectedKeys.push(selectedKeys[0])
      //   }
      // }
      // console.log(
      //   selectedKeys,
      //   e.selected,
      //   "----selectedKeys----",
      //   this.selectedKeys,
      //   this.selectedKeysCatalogue
      // );
    },
  },
});
</script>

<style lang="less">
.app-usb-layout {
  // .text-search-input,
  // .text-search-button,
  // .text-search-list {
  //   position: absolute;
  //   width: 100%;
  // }
  // .text-search-list {
  //   top: 150px;
  //   height: 100%;
  // }
  .sider-wrap {
    height: 100%;
    padding: 0 27px;
    background-color: #fff;

    box-shadow: 0px 2px 20px 0px rgba(226, 227, 228, 0.75);
    .ant-tabs,
    .ant-tabs-tabpane,
    .ant-tabs-content {
      height: 100%;
    }
    &-menu {
      background: #f5f7f9;
      // border: 1px solid #d7d9de;
      border-radius: 2px;
      width: 100%;
      height: 100%;
      overflow: auto;
      .ant-tree-title {
        font-size: 16px;
        font-weight: bold;
      }

      .ant-tree-node-selected {
        background-color: #1890ff !important;
      }
    }
    .ant-tabs-tab-active {
      background: #1890ff !important;
      color: #fff !important;
    }
    .ant-tabs-tabpane {
      overflow: auto;
      padding-bottom: 20px;
      &.text-search {
        overflow: hidden;
        .text-search-space {
          height: 100%;
          .ant-space-item:nth-child(3) {
            height: 80%;
            overflow-y: auto;
          }
        }
      }
      &.file-search {
        overflow: hidden;
        .text-search-space {
          height: 100%;
          .ant-space-item:nth-child(2) {
            height: 80%;
            overflow-y: auto;
          }
        }
      }
    }
    .book-mark-list {
      cursor: pointer;
      &:hover {
        background-color: rgba(223, 225, 229, 1);

        .ant-list-item-action {
          visibility: visible;
        }
      }
      .ant-list-item-action {
        visibility: hidden;
      }
    }
    .ant-list-item {
      cursor: pointer;
    }
    .mark-list {
      cursor: pointer;
      &:hover {
        background-color: rgba(223, 225, 229, 1);
      }
      .mark-item {
        .icon {
          display: inline-block;
          width: 20px;
        }

        .title {
          color: rgba(153, 153, 153, 1);
        }
        .option {
          float: right;
          img {
            margin: 0 5px;
          }
        }
      }
    }
  }
  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    width: 220px;
    white-space: nowrap;
  }
}
</style>
