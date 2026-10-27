function myAll(iterable) {
  /**为什么要 new Promise?
   * 因为 Promise.all 最终会返回一个已经改变状态的 Promise
   */
  return new Promise((resolve, reject) => {
    // 用来存储成功的 Promise 的结果
    const results = [];
    // 这里用来判断是否所有的 Promise 已经全部返回结果了
    // 用来计总共的 Promise 的数量
    let total = 0;
    // 用来计成功的 Promise 的数量
    let finished = 0;

    for (const item of iterable) {
      const index = total++;

      /**为什么要用 Promise.resolve() 呢？
       * 首先，Promise.resolve(item)，
       * 当 item 为非 Promise ，那么直接会返回成功，结果是 item 本身，
       * 若为成功的 Promise ，那么会跟随它的成功，拿到它的结果，
       * 若为失败的 Promise ，那么会跟随它的失败，拿到它的错误原因，
       * 若为还未完成的 Promise ，那么会等待它完成。
       *
       * 所以，这里用 Promise.resolve() 的目的是，
       * 由于 item 并未全部都是 Promise 对象，
       * 以及非 Promise 对象的 item 没有 then() 方法，
       * 所以就调用 Promise.resolve() 来包装一个 Promise ，
       * 这样非 Promise 和 Promise 就都可以调用 .then() 方法了。
       */
      Promise.resolve(item).then(
        // value 是成功的 Promise 返回的结果值
        (value) => {
          results[index] = value;

          finished++;
          // 判断是否所有的 Promise 都返回成功结果了
          if (finished === total) {
            // 若为 true ，则调用最外层的 resolve() 方法，将最终的 Promise 的状态改为成功
            resolve(results);
          }
        },
        // 如果有其中一个 Pormise 返回了错误，则上面的 resolve() 就无法被调用，也就无法退出函数，则一定会执行 reject 来退出函数。
        reject,
      );
    }

    // 空输入没有任何 then 回调，需要直接兑现
    if (total === 0) {
      resolve(results);
    }
  });
}

let Promise1 = new Promise(function (resolve, reject) {
  resolve("Promise1成功了");
});
let Promise2 = new Promise(function (resolve, reject) {
  resolve("Promise2成功了");
});
let Promise3 = new Promise(function (resolve, reject) {
  reject("Promise3失败了");
});

let success = myAll([Promise1, Promise2]);
success
  .then((results) => {
    console.log("成功了", results);
  })
  .catch((err) => {
    console.log("失败了", err);
  });

let failure = myAll([Promise1, Promise3]);

failure
  .then((results) => {
    console.log("成功了", results);
  })
  .catch((err) => {
    console.log("失败了", err);
  });
