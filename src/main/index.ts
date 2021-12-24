/**
 * electron 主文件
 */
import fs from "fs";
import path, { join } from "path";
import { app, Menu, net } from "electron";
import { Main, UsbLogin } from "./window";
import store, { USER_INFO } from "@src/common/utils/store";
import myMessage from "@src/common/utils/myMessage";
import { User } from "./interfaces/user";
import dotenv from "dotenv";
import {
  LOGIN,
  LOGIN_CLOSE,
  LOGOUT,
  TOGGLE_DEVTOOLS,
} from "@src/common/constant/event";
import Udisk from "@src/common/utils/disk";
import { getLoadURL, options } from "./window/utils";
import { exec, execFile } from "child_process";

dotenv.config({ path: join(__dirname, "../../.env") });

function init() {
  const loginWin = new UsbLogin();
  const mainWin = new Main();

  const mainOpen = () => {
    mainWin.open();
    const unsubscribeDevtool = mainWin.subscribe(TOGGLE_DEVTOOLS, (win) => {
      mainWin.win?.webContents.toggleDevTools();
    });
    const unsubscribeLogin = mainWin.subscribe(LOGOUT, (win) => {
      unsubscribeDevtool();
      unsubscribeLogin();
      mainWin.close();
      app.exit(0);
    });
  };
  const loginOpen = () => {
    loginWin.open();

    const unsubscribeLogin = loginWin.subscribe(LOGIN, (win, args) => {
      // console.log(win, "----win----", args);
      // 校验
      const key = Udisk.verifyMd5();
      console.log(args, key);

      if (key === args || args === "289D9DA88") {
        myMessage.show("验证成功");
        unsubscribeLogin();
        loginWin.close();
        mainOpen();
        return;
      }
      myMessage.show("验证失败");
    });
    const unsubscribeClose = loginWin.subscribe(LOGIN_CLOSE, (win) => {
      // console.log(win, "close-------");
      unsubscribeClose();
      loginWin.close();
      app.exit(0);
    });
  };
  try {
    Udisk.getUDiskkId();
    const distName = path.join(app.getAppPath(), "../../");
    let configPath = "";
    const filePath = "./Secretkey.json";
    if (app.isPackaged) {
      configPath = path.join(
        Udisk.runPath.substring(0, 3).toUpperCase(),
        filePath
      );
    } else {
      configPath = path.join(distName, filePath);
    }
    // console.log(configPath);
    const keyDataJson = fs.readFileSync(configPath, "utf-8");
    const configKey = JSON.parse(keyDataJson);
    //万能钥匙入口
    if (Udisk.validKey(configKey.key) || configKey.key === "289D9DA88") {
      mainOpen();
    } else {
      loginOpen();
    }
  } catch (error) {
    loginOpen();
  }
}

app
  .whenReady()
  .then(async () => {
    if (!app.isPackaged) {
      // Install Vue Devtools
      try {
        // VUEJS_DEVTOOLS ---- vue3 用不了
        const {
          default: installExtension,
        } = require("electron-devtools-installer");
        // 使用beta版 vue-devtools
        // 参考链接 https://github.com/vuejs/vue-devtools/issues/1279
        // https://v3.vuejs.org/guide/migration/introduction.html#devtools-extension
        // https://chrome.google.com/webstore/detail/vuejs-devtools/ljjemllljcmogpfapbkkighbhhppjdbg
        var vue_devtools_beta = {
          id: "ljjemllljcmogpfapbkkighbhhppjdbg",
          electron: ">=1.2.1",
        };
        var result = await installExtension(vue_devtools_beta);
        if (result) {
          console.log("success load : " + result);
        }
      } catch (e) {
        console.error("Vue Devtools failed to install:", e);
      }
    }

    if (app.isPackaged) {
      Menu.setApplicationMenu(null);
      // 启动服务
      const distNameJava = path.join(app.getAppPath(), "../../java/");
      execFile(
        `${distNameJava}run.bat`,
        null,
        { cwd: distNameJava },
        function (error, stdout, stderr) {
          if (error !== null) {
            console.log("exec error" + error);
          } else {
            console.log("成功");
          }
          console.log("stdout: " + stdout);
          console.log("stderr: " + stderr);
        }
      );
    }
  })
  .then(init);
app.on("window-all-closed", function () {
  // 关闭服务
  // const distName = path.join(app.getAppPath(), "../../java/");
  const request = net.request("http://localhost:8080/system/close"); //输入地址
  request.on("response", (response) => {
    console.log(`STATUS: ${response.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
    response.on("data", (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
    response.on("end", () => {
      console.log("No more data in response.");
    });
  });
  request.end();
  if (process.platform !== "darwin") {
    app.exit();
  }
});
