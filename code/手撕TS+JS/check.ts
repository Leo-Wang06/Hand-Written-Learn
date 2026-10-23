// 判题脚本：跑 `node check.ts`，看每关是否通过。
// 你的实现写在 doubounce.ts 里，导出 debounce。
import { debounce } from "./doubounce.ts";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const results: string[] = [];

async function pass(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    results.push(`✅ ${name}`);
  } catch (e) {
    results.push(`❌ ${name}  —— ${(e as Error).message}`);
  }
}

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

// ───────────────── 第 1 关：核心防抖 ─────────────────
await pass("第1关 连续触发只执行最后一次", async () => {
  let calls = 0;
  let lastArg = 0;
  const d = debounce((n: number) => {
    calls++;
    lastArg = n;
  }, 200);

  for (let i = 0; i < 5; i++) {
    d(i);
    await sleep(30);
  }
  assert(calls === 0, `冷却期内不该执行，但已经执行了 ${calls} 次`);
  await sleep(300);
  assert(calls === 1, `停止触发后应只执行 1 次，实际 ${calls} 次`);
  assert(lastArg === 4, `应使用最后一次的参数 4，实际 ${lastArg}`);
});

// ───────────────── 第 2 关：this 与参数透传 ─────────────────
await pass("第2关 this 指向和参数透传正确", async () => {
  const obj = {
    name: "obj",
    shout(this: { name: string }, a: string, b: string) {
      assert(this.name === "obj", `this 应指向 obj，实际 ${this?.name}`);
      (this as any).got = a + b;
    } as any,
  };
  obj.shout = debounce(obj.shout, 100) as any;
  obj.shout("你", "好");
  await sleep(200);
  assert(obj.got === "你好", `参数透传错误，实际 ${obj.got}`);
});

// ───────────────── 第 3 关：cancel ─────────────────
await pass("第3关 .cancel() 能取消待执行的调用", async () => {
  let calls = 0;
  const d = debounce(() => calls++, 100) as any;
  d();
  d.cancel();
  await sleep(200);
  assert(calls === 0, `cancel 后不应再执行，实际执行了 ${calls} 次`);
});

// ───────────────── 第 4 关：immediate 立即执行模式 ─────────────────
await pass("第4关 immediate 模式：首次立即执行，冷却期内不再执行", async () => {
  let calls = 0;
  const d = debounce(() => ++calls, 200, { immediate: true }) as any;
  d();
  assert(calls === 1, `immediate 应立即执行，实际 ${calls} 次`);
  d();
  d();
  await sleep(100);
  assert(calls === 1, `冷却期内不应执行，实际 ${calls} 次`);
  await sleep(300);
  assert(calls === 1, `冷却期结束后不应补执行，实际 ${calls} 次`);
});

// ───────────────── 结算 ─────────────────
console.log("\n" + results.join("\n") + "\n");
const failed = results.filter((r) => r.startsWith("❌")).length;
console.log(failed === 0 ? "🎉 全部通过！" : `还有 ${failed} 关没过，继续加油。`);
