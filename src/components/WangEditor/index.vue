<template>
  <div class="wang-editor">
    <div class="editor-content" :style="{ height: height }">
      <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor" :defaultConfig="toolbarConfig" :mode="mode" />
      <Editor
        :style="{ height: typeof height == 'string' ? height : `${height}px`, overflowY: 'hidden' }"
        v-model="content"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="onCreated"
        @onChange="onChange"
        v-bind="$attrs"
        v-on="$listeners"
        @customPaste="handlePaste"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { Boot, IEditorConfig, IToolbarConfig, DomEditor, IDomEditor } from "@wangeditor/editor";
import attachmentModule from "@wangeditor/plugin-upload-attachment"; // wangeditor 的附件插件
import { toolbarKeys } from "./config";

export type ImageInsertFnType = (url: string, alt: string) => void;

export type VideoInsertFnType = (url: string, poster: string) => void;

@Component({
  name: "WangEditor",
  components: { Editor, Toolbar },
})
export default class extends Vue {
  @Prop({ default: "" })
  public value!: string; // 编辑器内容
  @Prop({ default: () => [] })
  public toolbarKeys!: string[]; // 工具栏内容
  @Prop({ default: () => [] })
  public excludeKeys!: string[]; // 去除掉指定的工具类内容
  @Prop({ default: "auto" })
  public width!: string | number; // 编辑器宽度
  @Prop({ default: "400" })
  public height!: string; // 编辑器高度
  @Prop({ default: "default" })
  public mode!: "default" | "simple"; // 编辑器模式
  @Prop({ default: false })
  public disabled!: boolean; // 是否禁用编辑器

  public editor: any = null; // 编辑器对象
  public editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入内容...",
    readOnly: this.disabled, // 是否编辑编辑器
    hoverbarKeys: {
      image: {
        // 图片选题菜单
        menuKeys: [
          "imageWidth30",
          "imageWidth50",
          "imageWidth100",
          "editImage",
          "viewImageLink",
          "deleteImage",
          "|",
          "justifyLeft",
          "justifyRight",
          "justifyCenter",
        ],
      },
      attachment: {
        menuKeys: ["downloadAttachment"], // 下载附件菜单
      },
      paragraph: {
        menuKeys: ["uploadImage"],
      },
    },
    MENU_CONF: {
      // 配置上传图片
      uploadImage: {
        // 单个文件的最大体积限制，默认为 2M
        maxFileSize: 10 * 1024 * 1024, // 10M
        // 最多可上传几个文件，默认为 100
        // maxNumberOfFiles: 10,
        // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
        allowedFileTypes: ["image/*"],
        // 自定义上传
        customUpload: (file: File, insertFn: ImageInsertFnType) => {
          this.$emit("image-upload", file, insertFn);
        },
        onBeforeUpload: (file: File) => {
          this.$emit("image-before-upload", file);
        },
        onProgress: (progress: number) => {
          this.$emit("image-progress", progress);
        },
        onSuccess: (file: File, res: any) => {
          this.$emit("image-success", file, res);
        },
        onFailed: (file: File, res: any) => {
          this.$emit("image-failed", file, res);
        },
        onError: (file: File, err: any, res: any) => {
          this.$emit("image-error", file, err, res);
        },
      },
      uploadVideo: {
        // 300M
        maxFileSize: 300 * 1024 * 1024,
        allowedFileTypes: ["video/*"],
        customUpload: (file: File, insertFn: VideoInsertFnType) => {
          this.$emit("video-upload", file, insertFn);
        },
      },
      uploadAttachment: {
        // 10M
        maxFileSize: 10 * 1024 * 1024,
        onBeforeUpload: (file: File) => {
          this.$emit("file-before-upload", file);
        },
        customUpload: (file: File, insertFn: VideoInsertFnType) => {
          this.$emit("file-upload", file, insertFn);
        },
      },
    },
  };

  get content() {
    const editor = this.editor;
    if (editor == null) {
      return;
    }
    editor.setHtml(this.value);
    return this.value;
  }
  set content(value) {
    this.$emit("input", value);
  }

  get toolbarConfig(): Partial<IToolbarConfig> {
    return {
      toolbarKeys: this.toolbarKeys.length > 0 ? this.toolbarKeys : toolbarKeys, // 工具栏内容
      excludeKeys: this.excludeKeys, // 去除掉指定的工具类内容3
      // 插入哪些菜单
      insertKeys: {
        index: 22, // 自定义插入的位置
        keys: ["uploadAttachment"], // 上传附件菜单
      },
      // excludeKeys: ["group-video", "insertImage"],
    };
  }

  @Watch("disabled")
  public onDisabledChange() {
    if (this.editor) {
      this.disabled ? this.editor.disable() : this.editor.enable();
    }
  }

  public onCreated(editor: any) {
    Boot.registerModule(attachmentModule);
    this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
    if (this.editor) {
      this.disabled ? this.editor.disable() : this.editor.enable();
    }
    this.$emit("on-created", this.editor);
  }

  public onChange(editor: IDomEditor) {
    this.$emit("on-change", this.editor);
  }

  public handlePaste(editor: IDomEditor, event: ClipboardEvent) {
    this.$emit("on-paste", editor, event);
  }

  public getConfig() {
    const toolbar = DomEditor.getToolbar(this.editor);
    return toolbar?.getConfig();
  }

  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) {
      return;
    }
    editor.destroy(); // 组件销毁时，及时销毁编辑器
  }
}
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss" scoped>
.wang-editor {
  font-size: 16px;
  line-height: 1.4;
  .editor-content {
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    color: black;
  }
}
</style>
<style lang="scss">
.wang-editor {
  .w-e-full-screen-container {
    z-index: 2;
  }
}
</style>
