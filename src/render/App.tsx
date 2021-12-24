import { defineComponent } from "vue";
import { RouterView, useRoute } from "vue-router";
import AppLayout from "@/layout";
import UsbLayout from "./layout/usb";
import { ConfigProvider } from "ant-design-vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
export default defineComponent({
  setup() {
    const route = useRoute();
    return () => (
      <ConfigProvider locale={zhCN}>
        {route.path === "/login" || route.path === "/error" ? (
          <RouterView />
        ) : (
          <UsbLayout>
            <RouterView />
          </UsbLayout>
        )}
      </ConfigProvider>
    );
  },
});
