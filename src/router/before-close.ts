import { MessageBox } from "element-ui";

interface BeforeClose {
  before_close_normal: Function;
}

const beforeClose: BeforeClose = {
  before_close_normal: (resolve: any) => {
    MessageBox.confirm("确定要关闭这一页吗", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        resolve(false);
      });
  },
};

export default beforeClose;
