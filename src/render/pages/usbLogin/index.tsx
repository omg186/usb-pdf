import { defineComponent, reactive, ref, toRaw } from "vue";
import logo from "@/assets/image/denglulogo_icon.png";
import { KeyOutlined, LockTwoTone } from "@ant-design/icons-vue";

import "./index.less";
import { Card, Form, Input, Button } from "ant-design-vue";
import { ipcRenderer } from "electron";
import { LOGIN } from "@src/common/constant/event";
export default defineComponent({
  name: "UsbLogin",
  setup() {
    let values = reactive({
      key: "",
    });

    const submitForm = () => {
      console.log(values);
      ipcRenderer.invoke(LOGIN, values.key).then(() => {
        console.log("1111");
      });
    };
    return () => (
      <div class="usb-login-wrap">
        {/* <Card> */}
        <div class="usb-login">
          <p class="usb-login-logo">
            <img src={logo} />
          </p>
          <p class="usb-login-title">U盘书验证</p>
          {/* <p>key:{values.key}</p> */}
          {/* <Input v-model={[modelRef.name, "value"]}></Input> */}
          <Form
            layout="vertical"
            model={values}
            onFinish={submitForm}
            class="usb-login-form"
          >
            <Form.Item name="key">
              <Input
                v-model={[values.key, "value"]}
                placeholder="请输入验证码"
              />
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                block
                disabled={!values.key}
                type="primary"
                class="usb-login-form-btn"
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
        {/* </Card> */}
      </div>
    );
  },
  //   render() {
  //     return (
  //       <div class="usb-login-wrap">
  //         <Card>
  //           <div class="usb-login">
  //             <p class="usb-login-logo">
  //               <img src={logo} />
  //             </p>
  //             <p class="usb-login-title">U盘书验证</p>
  //             <p>key:{this.modelRef.name}</p>
  //             <Form>
  //               <Form.Item name="name" rules={this.rulesRef.name} hasFeedback>
  //                 <Input v-model={[this.modelRef.name, "value"]}></Input>
  //               </Form.Item>
  //             </Form>
  //           </div>
  //         </Card>
  //       </div>
  //     );
  //   },
});
