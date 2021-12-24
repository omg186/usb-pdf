import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { HomeOutlined, UserOutlined } from "@ant-design/icons-vue";

export interface RouteMeta {
  icon?: JSX.Element;
  name?: string;
  [key: string]: any;
}

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/pages/test/index.vue"),
    meta: {
      icon: <HomeOutlined />,
      name: "首页",
    } as RouteMeta,
  },
  {
    path: "/usblogin",
    component: () => import("@/pages/usbLogin"),
  },
  {
    path: "/error",
    component: () => import("@/pages/error.vue"),
  },
  {
    path: "/login",
    component: () => import("@/pages/usbLogin"),
  },
  {
    path: "/about",
    component: () => import("@/pages/about"),
    meta: {
      icon: <UserOutlined />,
      name: "关于作者",
    } as RouteMeta,
  },
];

export default createRouter({
  routes,
  history: createWebHashHistory(), // 这里使用 hash 模式，确保打包后正常加载
});
