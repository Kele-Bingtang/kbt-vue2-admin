<template>
  <div :class="computedClasses" class="material-input__component">
    <div :class="{ iconClass: icon }">
      <i v-if="icon" :class="[icon]" class="material-input__icon" />
      <input
        v-if="type === 'email'"
        :id="id"
        v-model="valueCopy"
        type="email"
        class="material-input"
        :name="name"
        :placeholder="filledPlaceholder"
        :readonly="readonly"
        :disabled="disabled"
        :autocomplete="autoComplete"
        :required="required"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
      />
      <input
        v-if="type === 'url'"
        :id="id"
        v-model="valueCopy"
        type="url"
        class="material-input"
        :name="name"
        :placeholder="filledPlaceholder"
        :readonly="readonly"
        :disabled="disabled"
        :autocomplete="autoComplete"
        :required="required"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
      />
      <input
        v-if="type === 'number'"
        :id="id"
        v-model="valueCopy"
        type="number"
        class="material-input"
        :name="name"
        :placeholder="filledPlaceholder"
        :readonly="readonly"
        :disabled="disabled"
        :autocomplete="autoComplete"
        :max="max"
        :min="min"
        :step="step"
        :minlength="minlength"
        :maxlength="maxlength"
        :required="required"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
      />
      <input
        v-if="type === 'password'"
        :id="id"
        v-model="valueCopy"
        type="password"
        class="material-input"
        :name="name"
        :placeholder="filledPlaceholder"
        :readonly="readonly"
        :disabled="disabled"
        :autocomplete="autoComplete"
        :max="max"
        :min="min"
        :step="step"
        :required="required"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
      />
      <input
        v-if="type === 'tel'"
        :id="id"
        v-model="valueCopy"
        type="tel"
        class="material-input"
        :name="name"
        :placeholder="filledPlaceholder"
        :readonly="readonly"
        :disabled="disabled"
        :autocomplete="autoComplete"
        :required="required"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
      />
      <input
        v-if="type === 'text'"
        :id="id"
        v-model="valueCopy"
        type="text"
        class="material-input"
        :name="name"
        :placeholder="filledPlaceholder"
        :readonly="readonly"
        :disabled="disabled"
        :autocomplete="autoComplete"
        :minlength="minlength"
        :maxlength="maxlength"
        :required="required"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
      />
      <span class="material-input-bar" />
      <label class="material-label">
        <slot />
      </label>
    </div>
  </div>
</template>

<script lang="ts">
// Source: https://github.com/wemake-services/vue-material-input/blob/master/src/components/MaterialInput.vue
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({ name: "MaterialInput" })
export default class extends Vue {
  @Prop({ required: true })
  public value!: any;
  @Prop({ default: "text" })
  public type!: string;
  @Prop({ default: "" })
  public id!: string;
  @Prop({ default: "" })
  public icon!: string;
  @Prop({ default: "" })
  public name!: string;
  @Prop({ default: "" })
  public placeholder!: string;
  @Prop({ default: false })
  public readonly!: boolean;
  @Prop({ default: false })
  public disabled!: boolean;
  @Prop({ default: true })
  public required!: boolean;
  @Prop({ default: "off" })
  public autoComplete!: string;
  @Prop({ default: 0 })
  public min!: number | string;
  @Prop({ default: 10000 })
  public max!: number | string;
  @Prop({ default: 1 })
  public step!: number;
  @Prop({ default: 0 })
  public minlength!: number;
  @Prop({ default: 20 })
  public maxlength!: number;
  @Prop({ default: true })
  public validateEvent!: boolean;
  @Prop({ default: "#2196f3" })
  public activeColor!: string;
  @Prop({ default: "" })
  public theme!: string;

  public focus = false;
  public valueCopy = "";

  mounted() {
    this.valueCopy = this.value;
    let activeColor = this.themeColor ? this.themeColor : this.activeColor;
    document.styleSheets[0].insertRule(
      `.material-input__component.material--active .material-label { color: ${activeColor} !important}`,
      0
    );
  }

  @Watch("value")
  public onValueChange(value: any) {
    this.valueCopy = value;
  }

  get themeColor() {
    let theme = this.theme;
    if (theme === "blue") {
      return "#2196f3";
    } else if (theme === "grey") {
      return "#9e9e9e";
    } else if (theme === "grey-light") {
      return "#e0e0e0";
    } else if (theme === "red") {
      return "#f44336";
    }
    return "";
  }

  get computedClasses() {
    return {
      "material--active": this.focus,
      "material--disabled": this.disabled,
      "material--raised": Boolean(this.focus || this.valueCopy),
    };
  }

  get filledPlaceholder() {
    if (this.focus) {
      return this.placeholder;
    }
    return "";
  }

  public handleInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.$emit("input", value);
    if ((this.$parent as any).$options.name === "ElFormItem") {
      if (this.validateEvent) {
        // See https://github.com/ElemeFE/element/blob/dev/packages/form/src/form-item.vue#L293
        // eslint-disable-next-line vue/custom-event-name-casing
        (this.$parent as any).$emit("el.form.change", [value]);
      }
    }
  }

  public handleFocus(event: FocusEvent) {
    this.focus = true;
    this.$emit("focus", event);
  }

  public handleBlur(event: FocusEvent) {
    this.focus = false;
    this.$emit("blur", event);
    if ((this.$parent as any).$options.name === "ElFormItem") {
      if (this.validateEvent) {
        // See https://github.com/ElemeFE/element/blob/dev/packages/form/src/form-item.vue#L292
        // eslint-disable-next-line vue/custom-event-name-casing
        (this.$parent as any).$emit("el.form.blur", [this.valueCopy]);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// Fonts:
$font-size-base: 16px;
$font-size-small: 14px;
$font-size-smallest: 12px;
$font-weight-normal: normal;
$font-weight-bold: bold;

// Utils
$spacer: 10px;
$transition: 0.2s ease all;
$index-has-icon: 30px;

// Theme:
$color-white: white;
$color-grey: #9e9e9e;
$color-grey-light: #e0e0e0;
$color-blue: #2196f3;
$color-red: #f44336;
$color-black: black;

// Base clases:
%base-bar-pseudo {
  content: "";
  height: 1px;
  width: 0;
  bottom: 0;
  position: absolute;
  transition: $transition;
}

// Mixins:
@mixin slided-top() {
  top: -($font-size-base + $spacer);
  left: 0;
  font-size: $font-size-base;
  font-weight: $font-weight-bold;
}

// Component:
.material-input__component {
  margin-top: 45px;
  position: relative;
  // Active state:
  &.material--active {
    .material-label {
      color: $color-blue;
    }
  }
  * {
    box-sizing: border-box;
  }

  .iconClass {
    .material-input__icon {
      position: absolute;
      left: 0;
      line-height: $font-size-base;
      color: $color-blue;
      top: $spacer;
      width: $index-has-icon;
      height: $font-size-base;
      font-size: $font-size-base;
      font-weight: $font-weight-normal;
      pointer-events: none;
    }

    .material-label {
      left: $index-has-icon;
    }

    .material-input {
      text-indent: $index-has-icon;
    }
  }

  .material-input {
    font-size: $font-size-base;
    padding: $spacer $spacer $spacer $spacer / 2;
    display: block;
    width: 100%;
    border: none;
    border-radius: 0;

    &:focus {
      outline: none;
      border: none;
      border-bottom: 1px solid transparent; // fixes the height issue
    }
  }

  .material-label {
    font-size: $font-size-small;
    font-weight: $font-weight-normal;
    position: absolute;
    pointer-events: none;
    left: 0;
    top: 0;
    transition: $transition;
  }

  .material-input-bar {
    position: relative;
    display: block;
    width: 100%;

    &:before {
      @extend %base-bar-pseudo;
      left: 50%;
    }

    &:after {
      @extend %base-bar-pseudo;
      right: 50%;
    }
  }

  // Disabled state:
  &.material--disabled {
    .material-input {
      border-bottom-style: dashed;
    }
  }

  // Raised state:
  &.material--raised {
    .material-label {
      @include slided-top();
    }
  }

  // Active state:
  &.material--active {
    .material-input-bar {
      &:before,
      &:after {
        width: 50%;
      }
    }
  }

  // Errors:
  .material-errors {
    position: relative;
    overflow: hidden;

    .material-error {
      font-size: $font-size-smallest;
      line-height: $font-size-smallest + 2px;
      overflow: hidden;
      margin-top: 0;
      padding-top: $spacer / 2;
      padding-right: $spacer / 2;
      padding-left: 0;
    }
  }
}

.material-input__component {
  background: $color-white;

  .material-input {
    background: none;
    color: $color-black;
    border-bottom: 1px solid $color-grey-light;
  }

  .material-label {
    color: $color-grey;
  }

  .material-input-bar {
    &:before,
    &:after {
      background: $color-blue;
    }
  }
}
</style>
