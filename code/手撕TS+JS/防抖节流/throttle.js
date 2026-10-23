// 节流JS

function debounce(fn, delay, ...presetArgs) {
  let startTime = 0;
  console.log("presetArgs:", presetArgs);

  return function (...callArgs) {
    console.log("callArgs:", callArgs);

    const endTime = Date.now();
    if (endTime - startTime < delay) return;

    startTime = endTime;
    // console.log(this);
    // console.log(...[...presetArgs, ...callArgs]);
    // console.log("回调函数的this:",this);

    /**这里为什么要透传 this 呢？
     * 因为 btn.addEventListener("click", debounce(sayHello,1000, "小明")); 执行时，
     * debounce 作为函数参数被传进去之后，返回了内部的 function 这个匿名函数，
     * 所以说，click 实际调用的是 function 这个匿名函数，
     * 并且 fn() 前并没有调用者，
     * 在非严格模式下，fn 的 this 会被默认为 window，
     * 所以，这里 function 这个匿名函数中的 this 就丢失了，
     * 也就造成了 button 丢失，
     * 当fn.apply(this, ...)之后，
     * fn 的 this 就会被显式绑定为 function 这个匿名函数的 this，
     * 也就是 button。
     * **/

    /**为什么这里写 [...presetArgs, ...callArgs] 就可以呢？
     * 因为 apply 函数会，自动将后面的数组进行展开，所以不需要再进行手写展开符，即"...[...presetArgs, ...callArgs]"
     * **/

    /**为什么这里要展开呢？
     * 如果不展开，那么传进去的参数，就会是一个数组。
     * 所以如果想要第一个“小明”的参数，那么你就需要展开，然后把第一个参数传进去即可。
     * 不然会打印出"[小明, PointerEvent]：你好"
     * **/

    /**那这个 PointerEvent 是谁传进来的呢？
     * 当然是浏览器在进行回调时传进来的，
     * btn.addEventListener("click", (e) => {
     *    console.log(e.type);          // "click"      事件类型
          console.log(e.target);        // 真正被点的元素
          console.log(e.currentTarget); // 绑定监听器的元素（= this）
          console.log(e.clientX, e.clientY); // 点击坐标
          console.log(e.ctrlKey);       // 当时有没有按着 Ctrl
     * })
       那么你返回的这个匿名函数 function(e) 当然也是一样的，也会被传进去 e 参数。
       所以说在理论上，不接受这个参数，也可以完成正常的打印“小明：你好”的功能。
     * **/
    fn.apply(this, [...presetArgs, ...callArgs]);
    // fn(presetArgs)
  };
}

function sayHello(name, ...args) {
  console.log(`%s：你好`, name);
  // console.log(...args);
  // console.log("sayHello的this:",this);
}

const btn = document.querySelector(".btn");
btn.addEventListener("click", debounce(sayHello, 1000, "小明"));
