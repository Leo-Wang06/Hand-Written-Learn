// 深拷贝 JS

function deepCopy(oriData, map = new WeakMap()) {
  if (oriData === null || typeof oriData !== "object") return oriData;

  /**判断是否是循环引用，如果是则直接返回 oriData？
   * 什么是循环引用？
   * const obj = { name: '小明' };
   * obj.self = obj;          // 自己指向自己
   *
   * console.log(obj.self.self.self === obj);   // true，可以无限套娃
   *
   * 下面 map.set(oriData, newData);
   * 设置一个map为 {oriData: newData}
   * 如果是循环引用，那么一定会进行深层遍历
   * 在第二次遍历时的 oriData 为 oriData[k]
   * 如果 map.has(oriData) === true
   * 那么说明情况为：
   * oriData === oriData[k] 为 true
   * 所以就可以判断为循环引用，就返回它的值即可(因为是循环引用，返回原数据，退出循环即可)
   */

  if (map.has(oriData)) return map.get(oriData);

  const newData = Array.isArray(oriData) ? [] : {};

  map.set(oriData, newData);

  for (const k in oriData) {
    // console.log(k);
    newData[k] = deepCopy(oriData[k], map);
  }
  return newData;
}

const oriArray = [1, 2, 3];

const newArray = deepCopy(oriArray);

console.log("Array是否相等", newArray === oriArray);
console.log("newArray:", newArray);

const oriObj = {
  name: "小明",
  Age: 12,
  firends: { name: "小红", Age: 14 },
};
