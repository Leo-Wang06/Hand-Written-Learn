function myRace(iterable) {
  /**为什么一次就够？
   * 因为，race 是谁先完成，
   * 就先返回谁的状态和值，
   * 所以当某一个 Promise 完成之后，
   * 就直接调用外层的 resolve 或者 reject 即可，
   * 就可以直接改变最外层 Promise 的状态以及返回值。
   */
  return new Promise((resolve, reject) => {
    for(const item of iterable) {
      Promise.resolve(item).then(resolve, reject)
    }
  })
}

myRace([
  new Promise(r => setTimeout(() => r('慢的'), 100)),
  new Promise(r => setTimeout(() => r('快的'), 10)),
]).then(v => console.log(v));   // "快的"

myRace([
  new Promise((_, rej) => setTimeout(() => rej('先失败'), 10)),
  new Promise(r => setTimeout(() => r('后成功'), 100)),
]).catch(e => console.log(e));   // "先失败"
