// 防抖JS

// 简单说：开启一个定时器，并且 timer 接受，当再次点击时，若 timer 存在，那就清除，再开一个。

function debounce(fn, delay, ...presetArgs) {
  let timer;
  return function (...callArgs) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, [...presetArgs, ...callArgs]);
    }, delay);
  };
}

function printName(name) {
  console.log(`名字：%s`, name);
  // console.log(this);
  
}

const btnDebounce = document.querySelector(".btn-debounce");
btnDebounce.addEventListener("click", debounce(printName, 1000, "小明"));
