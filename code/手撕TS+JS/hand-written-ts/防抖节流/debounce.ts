// 防抖

function debounce(
  fn: (...presetArgs: any[]) => void,
  delay: number,
  ...presetArgs: any[]
): (this: unknown,...callArgs: any[]) => void { 
  /**this 为什么是 unknown 类型？
   * 这个防抖函数谁知道将来会被挂到哪？
   * 可能是按钮、可能是 div、可能某个对象的方法，也可能没人绑、直接调用（严格模式下 this 就是 undefined）。
   * 所以 this 的类型无法确定，写 unknown 就是在诚实地表达这一点。
   * unknown：我不知道你是什么，所以我不碰你。
   * **/

  /**timer 的类型又是如何来的？ 
   * 准确来说，这不是一个类型推断，而是自己定义的显示注解，
   * typeof setTimeout：取的是 setTimeout 那一整串函数重载签名，
   * ReturnType<T>: 接收的是一个函数类型 T，提取出这个函数类型调用后的返回值类型，
   * 所以最终的类型是，setTimeout 的返回值类型。
   * 再解释一下 undefined：
   * 这里的两种类型，代表的是 timer 再运行状态中的两种类型，即当定时器还未开启，或者 clearTimeout(timer) 之后时，
   * timer 的类型就是 undefined。
   * **/
  let timer: ReturnType<typeof setTimeout> | undefined;
  return function(...callArgs) {
    if(timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, [...presetArgs, ...callArgs])
    }, delay)
  }
}

function printName(name: string): void {
  console.log(`姓名: %s`, name);
}

const btnDebounce = document.querySelector<HTMLButtonElement>('.btn-debounce')
btnDebounce?.addEventListener('click', debounce(printName, 1000, '小明'))

export { };

