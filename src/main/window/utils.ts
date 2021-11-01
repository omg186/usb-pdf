import path, { join } from "path";
import { BrowserWindow, ipcMain, app } from "electron";
export function getLoadURL() {
  return app.isPackaged
    ? `file://${join(__dirname, "../render/index.html")}` // vite 构建后的静态文件地址
    : `http://localhost:${process.env.PORT}`; // vite 启动的服务器地址
}
export const options: Electron.BrowserWindowConstructorOptions = {
  width: 1024,
  height: 768,
  webPreferences: {
    webSecurity: false,
    nodeIntegration: true,
    contextIsolation: false,
    enableRemoteModule: true,
    preload: join(__dirname, "../../src/preload/index.js"),
  },
  ...(app.isPackaged
    ? {
        // 生产配置
        icon: path.join(__dirname, "../render/favicon.ico"),
      }
    : {
        icon: `http://localhost:${process.env.PORT}/favicon.ico`,
        // 开发期配置
        // y: 0,
        // x: 0,
      }),
};
81768981;
export type EventCallback = (
  win: Electron.IpcMainInvokeEvent,
  params?: any
) => void;
/**
 * 给 BrowserWindow 提供订阅管理
 */
export class WinSubscribe {
  constructor(protected events: Record<string, Array<EventCallback>>) {}

  public subscribe(name: string, cb: EventCallback) {
    this.regHandle(name, cb); // 放在前面，配合 regHandle 中的判断
    if (!Array.isArray(this.events[name])) {
      this.events[name] = [];
    }
    this.events[name].push(cb);
    return () => this.unsubscribe(name, cb);
  }

  protected unsubscribe(name: string, cb: EventCallback) {
    if (!Array.isArray(this.events[name])) {
      return;
    }
    this.events[name] = this.events[name].filter((_) => _ !== cb);
  }

  // 注册到 ipcMain.handle 上面
  protected regHandle(name: string, cb: EventCallback) {
    // console.log(name, cb, "------name-----");
    // Error: Attempted to register a second handler for 'Login.LOGIN'
    // if (ipcMain.eventNames().includes(name)) { return } 用不了
    if (Array.isArray(this.events[name])) {
      return;
    } // 借助事件池判断
    ipcMain.handle(name, (event, args) => {
      // console.log(event, args, "------event-----");
      if (!Array.isArray(this.events[name])) {
        return;
      }
      this.events[name].forEach(() => {
        cb(event, args);
      });
    });
  }
}
