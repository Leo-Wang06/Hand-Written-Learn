function myAllSettled(iterable) {
  return new Promise((resolve) => {
    const results = [];
    let total = 0;
    let finished = 0;

    for (const item of iterable) {
      let index = total++;
      Promise.resolve(item)
        .then((value) => {
          // finished++;
          results[index] = {status: "fulfilled", value};

          // if (total === finished) {
          //   resolve(results)
          // }
        })
        .catch((reason) => {
          // finished ++
          results[index] = {status: "rejected", reason};
          // if (total === finished) {
          //   resolve(results)
          // }
        })
        .finally(() => {
          finished ++
          if (total === finished) {
            resolve(results)
          }
        })
        /**为什么要用 finally 做收尾呢？
         * 如果不用 finally 的话，
         * .then() 和 .catch 分支都会写重复的 finished ++ 和 total === finished 判断逻辑，
         * finally 分支一定会走到，
         * 所以用它做收尾再好不过了。
         */
    }

    if (total === 0) {
      resolve(results)
    }
  });
}

let Promise1 = new Promise(function (resolve) {
  resolve("Promise1成功了");
});
let Promise2 = new Promise(function (resolve) {
  resolve("Promise2成功了");
});
let Promise3 = new Promise(function (resolve, reject) {
  reject("Promise3失败了");
});

const result = myAllSettled([Promise1, Promise2, Promise3]);

result
  .then((value) => {
    console.log(value);
  })
  .catch((err) => {
    console.log(err);
  });
