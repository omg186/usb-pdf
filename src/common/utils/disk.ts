import CryptoJS from "crypto-js";
import iconv from "iconv-lite";
import { exec, execSync, ExecSyncOptions } from "child_process";
import isSystem, { SystemKey } from "./isSystem";
import { Notification, app } from "electron";
import store, { KEY } from "./store";
/**
 * u盘帮助方法
 */
export default class Udisk {
  static binaryEncoding: BufferEncoding | null = "binary";
  static option: ExecSyncOptions | undefined = {
    encoding: Udisk.binaryEncoding,
  };
  static runPath = app.getAppPath();
  static currentDriveInfo?: IDisk;
  static getUDiskkId() {
    const issys = isSystem();
    // new Notification({
    //   title: "路径",
    //   body: `当前app运行路径：${this.runPath}`,
    // }).show();
    if (issys === SystemKey.windows) {
      this.getWinDisk();
    } else if (issys === SystemKey.mac) {
      this.getMacDisk();
    }
    // });
  }
  /**
   * 加密
   */
  static verifyMd5(): string {
    // console.log(this.currentDriveInfo);
    //#region 开发环境 ...
    // if (!app.isPackaged) {
    //   return "289D9DA88";
    // }
    //#endregion
    // return "289D9DA88";
    if (!this.currentDriveInfo) {
      new Notification({ title: "提示", body: "设备验证失败" }).show();
      return "";
    }
    console.log(this.currentDriveInfo, "--this.currentDriveInfo--");
    var des = CryptoJS.DES.encrypt(
      this.currentDriveInfo.volumeSerialNumber,
      CryptoJS.enc.Utf8.parse("www.crphdm.com"),
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    ).toString();
    const md5 = CryptoJS.MD5(des).toString().toUpperCase();
    const num =
      "" +
      md5[0] +
      md5[3] +
      md5[7] +
      md5[11] +
      md5[15] +
      md5[19] +
      md5[23] +
      md5[27] +
      md5[31];
    console.log(num);
    store.set(KEY, num);
    // new Notification({ title: "密码", body: num }).show();
    return num;
  }
  public static validKey(num: string) {
    return this.verifyMd5() === num;
  }
  /**
   * 提取运行环境的盘符
   * @returns 返回盘符
   */
  public static getRunAppDrive(disk: IDisk[]): string {
    let path = this.runPath;
    const current = path.substring(0, 1).toUpperCase();
    //#region 开发环境 ...
    if (!app.isPackaged) {
      this.currentDriveInfo = disk[0];
      return "";
    }
    //#endregion
    const currentMode = disk.find((c) => c.drive.toUpperCase() === current);
    this.currentDriveInfo = currentMode;
    return current;
  }
  /**
   * win 获取u盘
   * @returns
   */
  private static getWinDisk() {
    let processData = execSync(
      "wmic LogicalDisk where DriveType=2 get Name,VolumeSerialNumber / value",
      { ...this.option }
    );
    const decodeData = iconv.decode(processData, "utf-8").split("\r\n");
    // console.log(decodeData.toString());
    const data = decodeData
      .map(function (s: string) {
        return s && s.trim();
      })
      .filter((s) => s);

    // if (data == null || data.length < 2) {
    //   new Notification({ title: "提示", body: "没有发现设备" }).show();
    //   return;
    // }
    let drive = "";
    let volumeSerialNumber = "";
    const diskList: Array<IDisk> = [];
    data.forEach((p, i) => {
      let itemArray = p.split("=");
      if (itemArray[0] === "Name") {
        // drive
        drive = itemArray[1].substring(0, itemArray[1].length - 1);
      } else if (itemArray[0] === "VolumeSerialNumber") {
        // volumeSerialNumber
        volumeSerialNumber = itemArray[1];
      }
      if (i !== 0 && i % 2 !== 0) {
        diskList.push({ volumeSerialNumber, drive });
      }
    });
    console.log(diskList);
    this.getRunAppDrive(diskList);
  }
  /**
   * 获取macos当前运行磁盘
   */
  private static getMacDisk() {
    let processData = execSync("ls /Volumes/", { ...this.option });
    // workerProcess.buffer.
    console.log(processData);
    const decodeData = iconv.decode(processData, "utf-8").split("\r\n");
    const result = [];
    decodeData.forEach((p) => {
      console.log(p);
    });
    //  let array = data.split("\n");
  }
}
/**
 * u盘接口
 */
interface IDisk {
  /**
   * 盘符
   */
  drive: string;
  /**
   * 标识
   */
  volumeSerialNumber: string;
}
