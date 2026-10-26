// 深拷贝 TS

/**这里为什么需要泛型 <T> ？
 * 因为这样可以让oriData的类型保持一致，
 * 否则就需要用 any，
 * any 会丢失类型检查，不建议用。
 */
function deepCopy<T>(
  oriData: T, 
  map: WeakMap<object, unknown> = new WeakMap()
): T {
    if (oriData === null || typeof oriData !== 'object') return oriData

    /**这里需要进行类型断言，
     * 因为 map: WeakMap<object, unknown>,
     * 所以要保证 键为 object,
     * 重新定义纯粹是为了少几次类型断言而已。
     */
    const key = oriData as object;
    if (map.has(key)) return map.get(key) as T;

    /**为什么需要Record<string, any>?
     * 如果没有的话，会被 TS 解析为 never[] | {}，
     * {} 没有索引签名，
     * 下面访问 newData[k] 时，会报错。
     */
    const newData: Record<string, any> = Array.isArray(oriData) ? [] : {}

    map.set(oriData, newData);

    for(const k in oriData) {
      newData[k] = deepCopy(oriData[k])
    }

    return newData as T
}

const oriArray: number[] = [1, 2, 3]
const newArray = deepCopy(oriArray)

console.log("是否相等：", oriArray === newArray);
console.log(newArray);

export {}