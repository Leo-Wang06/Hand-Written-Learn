// 节流 TS

function throttle(
  fn: (...presetArgs: any[]) => void, 
  delay: number, 
  ...presetArgs: any[]
): (this: unknown,...callArgs: any[]) => void {
  let startTime: number = 0;  
  return function(...callArgs) {
    const endTime: number = Date.now();
    if (endTime - startTime < delay) return;

    startTime = endTime;

    fn.apply(this, [...presetArgs, ...callArgs])
  }
}

function sayHello(name: string, ...args: any[]) {
  console.log(`%s: 你好`, name);
}

const btnThrottle = document.querySelector(".btn-throttle");
btnThrottle?.addEventListener("click", throttle(sayHello, 1000, "小明"))

export {}