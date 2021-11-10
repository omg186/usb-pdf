import qikanliebiao_icon from "@/assets/image/qikanliebiao_icon.png";
import mulufenlei_icon from "@/assets/image/mulufenlei_icon.png";
import shou_icon from "@/assets/image/shou_icon.png";
import wenbenxuanze_icon from "@/assets/image/wenbenxuanze_icon.png";
import heshiyemian_icon from "@/assets/image/heshiyemian_icon.png";
import heshikuandu_icon from "@/assets/image/heshikuandu_icon.png";
import heshigaodu_icon from "@/assets/image/heshigaodu_icon.png";
import shunshizheng_icon from "@/assets/image/shunshizheng_icon.png";
import nishizheng_icon from "@/assets/image/nishizheng_icon.png";
import sousuo_icon from "@/assets/image/sousuo_icon.png";
import bangzhu_icon from "@/assets/image/bangzhu_icon.png";
import qikanfenlei from "@/assets/image/qikanfenlei.png";
import dayin from "@/assets/image/dayin.png";
import shouye_icon from "@/assets/image/shouye_icon.png";
import tuichudenglu_icon from "@/assets/image/tuichudenglu_icon.png";
export interface IMenu {
  id: number;
  name: string;
  icon: any;
  typeClick?:
    | "HOME"
    | "NONE"
    | "PDF"
    | "MENU"
    | "PDFROTATE"
    | "PDFTOOL"
    | "PDFFIND"
    | "PRINT"
    | "QUIT";
  params?: any;
}
export const Menu: IMenu[] = [
  { id: 0, name: "首页", typeClick: "HOME", icon: shouye_icon, params: "home" },
  {
    id: 1,
    name: "时间排序",
    typeClick: "MENU",
    icon: qikanliebiao_icon,
    params: "periodical",
  },
  {
    id: 2,
    name: "分类排序",
    typeClick: "MENU",
    icon: qikanfenlei,
    params: "catalogue",
  },
  {
    id: 12,
    name: "目录排序",
    typeClick: "MENU",
    icon: mulufenlei_icon,
    params: "category",
  },
  {
    id: 10,
    name: "搜索",
    typeClick: "PDFFIND",
    params: "pageFind",
    icon: sousuo_icon,
  },
  {
    id: 3,
    name: "手型工具",
    typeClick: "PDFTOOL",
    icon: shou_icon,
    params: "cursorHandTool",
  },
  {
    id: 4,
    name: "文本选择",
    typeClick: "PDFTOOL",
    icon: wenbenxuanze_icon,
    params: "cursorSelectTool",
  },
  {
    id: 5,
    name: "适合页面",
    typeClick: "PDF",
    icon: heshiyemian_icon,
    params: { scale: "page-actual" },
  },
  {
    id: 6,
    name: "适合宽度",
    typeClick: "PDF",
    icon: heshikuandu_icon,
    params: { scale: "page-width" },
  },
  {
    id: 7,
    name: "适合高度",
    typeClick: "PDF",
    icon: heshigaodu_icon,
    params: { scale: "page-fit" },
  },
  {
    id: 8,
    name: "顺时针旋转",
    typeClick: "PDFROTATE",
    icon: shunshizheng_icon,
    params: "pageRotateCw",
  },
  {
    id: 9,
    name: "逆时针旋转",
    typeClick: "PDFROTATE",
    icon: nishizheng_icon,
    params: "pageRotateCcw",
  },
  {
    id: 10,
    name: "打印",
    typeClick: "PRINT",
    params: "print",
    icon: dayin,
  },

  {
    id: 11,
    name: "帮助",
    icon: bangzhu_icon,
  },
  {
    id: 12,
    name: "退出",
    typeClick: "QUIT",
    icon: tuichudenglu_icon,
  },
];
