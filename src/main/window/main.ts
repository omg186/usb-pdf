import { app, BrowserWindow, Screen } from "electron";
import { options, getLoadURL, WinSubscribe, EventCallback } from "./utils";

export class Main extends WinSubscribe {
  public static events: Record<string, Array<EventCallback>> = {};

  public win: BrowserWindow | null = null;

  public url = getLoadURL();

  constructor(private opts?: Electron.BrowserWindowConstructorOptions) {
    super(Main.events);
  }

  public open() {
    this.win = new BrowserWindow({
      ...options,
      width: 1280,
      height: 768,
      // frame: !app.isPackaged, // 打包后去掉边框
      ...this.opts,
    });
    this.win.loadURL(this.url);
    // 窗口居中
    this.win.center();
  }

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
