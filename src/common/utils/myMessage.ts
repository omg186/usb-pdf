import { Notification } from "electron";
export default class MyMessage {
  constructor() {
    // super();
  }
  static show(body: string, options?: Electron.NotificationConstructorOptions) {
    new Notification({ body, ...options, timeoutType: "default" }).show();
  }
}
