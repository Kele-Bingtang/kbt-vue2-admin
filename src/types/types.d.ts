/**
 * 将对象的某个属性变为可选，如：

interface User {
  name: string;
  age: string;
  gender: string;
}

// gender 变为可选
let user: PartialKey<User, "gender"> = {
  name: "",
  age: "",
};
// age 和 gender 变为可选
let user: PartialKey<User, "age" | gender"> = {
  name: "",
};

 */
type PartialKey<T, U extends keyof T> = Pick<T, Exclude<keyof T, U>> & Partial<Pick<T, U>>;

/**
 * 指定的属性为必选，其他属性都变为可选
 *
 * 如 RequiredKey<User, "name">
 * 则只有 name 是必填，age 和 gender 变为可选
 */
type RequiredKey<T, U extends keyof T> = Partial<Pick<T, Exclude<keyof T, U>>> & Required<Pick<Text, U>>;
