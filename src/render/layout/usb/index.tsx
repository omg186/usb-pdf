import { defineComponent } from "vue";
import { Layout, Menu } from "ant-design-vue";
import Sider from "./sider/index.vue";
import Header from "./header/index.vue";
import Footer from "./footer";
import "./index.less";
export default defineComponent({
  setup(props, ctx) {
    console.log(props);

    return () => (
      <Layout class="app-usb-layout h-100">
        <Header />
        <Layout>
          <Layout.Sider width={330}>
            <Sider />
          </Layout.Sider>
          <Layout.Content>
            {/* 内容区域 */}
            {/* 奇怪的写法: https://github.com/vuejs/composition-api/issues/84 */}
            {ctx?.slots?.default?.()}
          </Layout.Content>
        </Layout>
        <Layout.Footer>
          <Footer></Footer>
        </Layout.Footer>
      </Layout>
    );
  },
});
