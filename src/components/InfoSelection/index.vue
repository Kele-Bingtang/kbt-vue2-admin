<template>
  <div class="info-selection-component">
    <el-select
      ref="select"
      v-model="selectValue"
      filterable
      remote
      :reserve-keyword="reserveKeyword"
      :placeholder="placeholder"
      :remote-method="remoteMethod"
      :loading="loading"
      @blur="onBlur"
      @focus="onFocus"
      v-bind="$attrs"
      v-on="$listeners"
      style="width: 100%"
    >
      <el-option v-for="item in options" :key="item.id" :label="item.label" :value="item.label">
        <slot v-bind:option="getOptionFromList(item)"></slot>
      </el-option>
    </el-select>
  </div>
</template>

<script lang="ts">
import { Input, Select } from "element-ui";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

interface Selection {
  id: number;
  employeeNo: string;
  username: string;
  nickname: string;
  age: number;
  address: string;
}

interface Option {
  id: string | number;
  label: string;
}

@Component({})
export default class InfoSelection extends Vue {
  @Prop({ required: true })
  public list!: Array<Selection>; // 完整数据
  @Prop({ required: true })
  public id!: string; // 数据里的唯一 key
  @Prop({ required: true, default: () => [] })
  public showInfo!: string[]; // 显示的数据
  @Prop({ default: "请输入关键词" })
  public placeholder!: string; // 文本框为空时的提示
  @Prop({ default: " " })
  public separator!: string; // 数据之间的分割线
  @Prop({ default: false, type: Boolean })
  public reserveKeyword!: boolean; // 是否在选中一个选项后保留当前的搜索关键词
  @Prop({ default: false, type: Boolean })
  public onlySearch!: boolean; // 只能搜索出内容
  @Prop({ default: false, type: Boolean })
  public selectShowAll!: boolean; // 选择至少一个值后，才显示全部下拉值，只在 onlySearch 为 true 生效

  public selectValue: string[] = [];
  public loading = false;
  public options: Array<Option> = [];
  public tempOptions: Array<Option> = [];

  @Watch("list", { immediate: true })
  public onListChange() {
    let { id, showInfo, separator } = this;
    this.tempOptions = [];
    this.list.forEach(item => {
      let l: any = item;
      let label = "";
      showInfo.forEach(s => {
        label = label + l[s] + separator;
      });
      if (label) {
        this.tempOptions.push({
          id: l[id],
          label: label.slice(0, label.length - separator.length),
        });
      }
    });
    this.initOption();
  }

  public getOptionFromList(option: Option) {
    let { list } = this;
    for (let i = 0; i < list.length; i++) {
      let item = list[i];
      if (item && item.id === option.id) {
        return item;
      }
    }
  }

  public remoteMethod(query: string) {
    if (query !== "") {
      this.loading = true;
      this.options = this.tempOptions.filter(item => {
        return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
      });
      this.loading = false;
    } else {
      this.loading = true;
      this.onListChange();
      this.loading = false;
    }
  }

  public onFocus(e: Event) {
    // el-select 自带的 @blur 有时候无法触发的问题，而 focus 可以，所以这里手动触发 blur
    let input = (this.$refs.select as Select).$refs.input as Input;
    if (input) {
      input.blur = () => {
        this.onBlur(e);
      };
    }
    this.$emit("on-focus", e);
  }

  public onBlur(e: Event) {
    let input = (this.$refs.select as Select).$refs.input as Input;
    let { reserveKeyword, selectValue } = this;
    if (selectValue.length === 0 || (input && input.value)) {
      // 延迟初始化是因为先让下拉框隐藏，再初始化，否则还没隐藏就初始化，视觉上能看到下拉框内容发生改变
      setTimeout(() => {
        this.initOption();
      }, 500);
    } else {
      !reserveKeyword
        ? setTimeout(() => {
            this.initOption();
          }, 500)
        : "";
    }
    this.$emit("on-blur", e);
  }

  public initOption() {
    let { onlySearch, selectShowAll, selectValue } = this;
    onlySearch
      ? selectShowAll && selectValue.length > 0
        ? (this.options = this.tempOptions)
        : (this.options = [])
      : (this.options = this.tempOptions);
  }
}
</script>

<style lang="scss" scoped>
.info-selection-component {
  width: 100%;
}
</style>
