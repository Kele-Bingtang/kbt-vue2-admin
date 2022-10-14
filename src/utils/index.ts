/**
 * 数据解耦后，再返回
 */
export function copyObj(obj: unknown) {
  return obj && JSON.parse(JSON.stringify(obj));
}
