import { app, BrowserWindow } from "electron";
import { EventCallback, getLoadURL, options, WinSubscribe } from "./utils";

export class UsbLogin extends WinSubscribe {
  public static events: Record<string, Array<EventCallback>> = {};
  public win: BrowserWindow | null = null;
  public url = getLoadURL();
  constructor(private opts?: Electron.BrowserWindowConstructorOptions) {
    super(UsbLogin.events);
  }
  /**
   * 打开usb登录窗口
   */
  public open() {
    this.win = new BrowserWindow({
      ...options,
      title: "U盘验证",
      width: 438,
      height: 484,
      resizable: false, // 不让缩放
      // frame: !app.isPackaged, // 打包后去掉边框
      ...this.opts,
    });
    this.win.loadURL(`${this.url}#/error`); // 这里使用 hash 模式，确保打包后正常加载
    // 窗口居中
    this.win.center();
  }
  /**
   * 关闭usb登录窗口
   * @returns
   */
  public close() {
    if (!this.win) {
      return;
    }
    if (this.win.isClosable()) {
      this.win.close();
      this.win = null;
    }
  }
}
