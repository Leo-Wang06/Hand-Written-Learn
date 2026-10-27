function myAll(iterable) {
  const results = []
  let total = 0
  let finished = 0

  return new Promise((resolve, reject) => {
    for (const item of iterable) {
      const index = total ++

      Promise.resolve(item).then(
        (value) => {
          results[index] = value
          finished ++

          if (total === finished) {
            resolve(results);
          }
        },
        reject
      )
    }

    if (total === 0) {
      resolve(results)
    }
  })
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
