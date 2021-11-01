export enum SystemKey {
  windows,
  mac,
  linux,
}
/**
 * 判断是什么系统
 */
export default () => {
  if (process.platform == "darwin") {
    console.log("这是mac系统");
    return SystemKey.mac;
  }
  if (process.platform == "win32") {
    console.log("这是windows系统");
    return SystemKey.windows;
  }
  if (process.platform == "linux") {
    console.log("这是linux系统");
    return SystemKey.linux;
  }
};
