<template>

  <codemirror
    ref="cmEditor"
    v-model="code"
    :options="cmOptions"
    @input="onCmCodeChange"
    @blur="onCmBlur"
    @paste.native="onPaste"
  ></codemirror>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { codemirror } from "vue-codemirror";
import { Editor } from "codemirror";
import "codemirror/lib/codemirror.css";
// 编辑的主题文件
import "codemirror/theme/ayu-mirage.css";
import "codemirror/addon/display/autorefresh";
import "./config.ts";
import "./theme.ts";
import "./mode.ts";

@Component({
  components: { codemirror },
})
export default class CodeMirror extends Vue {
  @Prop({ default: "" })
  public value!: string;
  @Prop({ default: "idea" })
  public cmTheme!: string;
  @Prop({ default: "application/json" })
  public cmMode!: string;
  @Prop({ default: 2 })
  public cmIndentUnit!: number;
  @Prop({ default: false })
  public autoFormatJson!: boolean;
  @Prop({ default: false })
  public readonly!: boolean;

  get code() {
    return this.value;
  }

  set code(value) {
    this.$emit("input", value);
  }

  get cm(): Editor {
    return (this.$refs.cmEditor as any).codemirror;
  }

  get cmOptions() {
    return {
      theme: this.cmTheme, // 主题
      mode: this.cmMode, // 代码格式
      tabSize: this.cmIndentUnit, // tab 的空格个数
      indentUnit: this.cmIndentUnit, // 一个代码块应缩进多少个空格，应该与 tabSize 保证一直
      smartIndent: true, // 是否智能缩进
      autocorrect: true, // 自动更正
      spellcheck: true, // 拼写检查
      lint: true, // 检查格式
      lineNumbers: true, // 是否显示行数
      lineWrapping: true, // 是否自动换行
      styleActiveLine: true, // 当前行高亮
      readOnly: this.readonly, // 只读
      // keyMap: 'sublime',  // sublime 编辑器效果
      matchBrackets: true, // 括号匹配提示
      autorefresh: true, // 自动刷新
      autoCloseBrackets: true, // 在键入时将自动关闭括号和引号
      matchTags: { bothTags: true }, // 将突出显示光标周围的标签
      foldGutter: true, // 可将对象折叠，与下面的 gutters 一起使用
      gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
      highlightSelectionMatches: {
        minChars: 2,
        style: "matchhighlight",
        showToken: true,
      },
      extraKeys: { Ctrl: "autocomplete" }, // 可以用于为编辑器指定额外的键绑定，以及 keyMap 定义的键绑定
    };
  }

  onCmCodeChange(newCode: string) {
    this.code = newCode;
    // this.resetLint();
  }
  // 失去焦点时处理函数
  onCmBlur(cm: any, event: Event) {
    try {
      let editorValue = cm.getValue();
      if (this.cmOptions.mode === "application/json" && editorValue) {
        if (!this.autoFormatJson) {
          return;
        }
        this.code = this.formatStrInJson(editorValue);
      }
      this.$emit("on-blur", this.code);
    } catch (e) {}
  }
  // 重置检查格式
  // public resetLint() {
  //   if (!this.cm.getValue()) {
  //     this.$nextTick(() => {
  //       this.cm.setOption("lint", false);
  //     });
  //     return;
  //   }
  //   this.cm.setOption("lint", false);
  //   this.$nextTick(() => {
  //     this.cm.setOption("lint", true);
  //   });
  // }

  // 按下键盘事件处理函数
  public onKeyDown(event: any) {
    const keyCode = event.keyCode || event.which || event.charCode;
    const keyCombination = event.ctrlKey || event.altKey || event.metaKey;
    if (!keyCombination && keyCode > 64 && keyCode < 123) {
      this.cm.showHint({ completeSingle: false });
    }
  }

  // 按下鼠标时事件处理函数
  public onMouseDown(event: Event) {
    this.cm.closeHint();
  }
  // 黏贴事件处理函数
  public onPaste(event: Event) {
    if (this.cmOptions.mode === "application/json") {
      try {
        let oldCode = this.code;
        this.code = this.formatStrInJson(this.code);
        this.$emit("on-paste", this.code, oldCode);
      } catch (e) {}
    }
  }
  // 格式化字符串为json格式字符串
  public formatStrInJson(strValue: string) {
    return JSON.stringify(JSON.parse(strValue), null, this.cmIndentUnit);
  }
}
</script>

<style lang="scss" scoped></style>
