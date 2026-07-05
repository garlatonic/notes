# 비동기 작업 동시성 제어 구현하기

스터디 당일 아예 손도 대지 못했던 문제였다. 프로젝트를 진행할 때에는 그렇게 대규모 데이터가 아니었어서 항상 `Promise.all`을 사용했는데, 경력자분들께서 이러한 문제를 내주셨다.

## 문제

프론트엔드에서 수십, 수백 개의 이미지를 다운로드하거나 API를 호출해야 할 때 `Promise.all`을 쓰면 한 번에 수백 개의 요청이 날아가 브라우저나 서버가 뻗을 수 있습니다. 동시에 실행되는 비동기 작업의 최대 개수를 제한하는 큐(Queue) 시스템을 직접 구현하는 문제입니다.

### 요구사항

- `runWithConcurrency(tasks, limit)` 함수를 작성하세요.
- `tasks`는 프로미스를 반환하는 비동기 함수들의 배열입니다.
- `limit`은 동시에 실행할 수 있는 최대 작업 개수입니다.
- 하나의 작업이 끝나면, 대기 중인 다음 작업이 즉시 실행되어야 합니다.
- 모든 작업이 끝나면 완료된 결과값들을 배열로 반환해야 합니다 (결과의 순서는 원본 `tasks`의 순서와 같아야 합니다).

### 예시 코드

```js
// 가상의 비동기 작업 생성 함수 (수정 금지)
const makeTask = (id, time) => () =>
  new Promise((resolve) => {
    console.log(`[시작] Task ${id}`);
    setTimeout(() => {
      console.log(`[완료] Task ${id}`);
      resolve(`결과 ${id}`);
    }, time);
  });

const tasks = [
  makeTask(1, 1000),
  makeTask(2, 500),
  makeTask(3, 800),
  makeTask(4, 300),
  makeTask(5, 1200),
];

// TODO: 동시성을 제어하는 함수를 구현하세요.
async function runWithConcurrency(tasks, limit) {
  // 코드를 작성하세요.
}

// 실행 테스트 (최대 2개씩만 동시에 실행되어야 함)
runWithConcurrency(tasks, 2).then((results) => {
  console.log("모든 작업 완료:", results);
});
```

## 구현 아이디어

우선 해당 문제를 해결하기 위해서 큐를 구현하는 방법도 있지만, 작업을 처리하는 `worker`를 만들어서 동시에 실행되는 작업의 수를 제한하는 방법으로 생각해볼 수도 있다.

`limit`만큼의 `worker`를 만들고, 각 `worker`들이 `tasks` 배열에서 작업을 하나씩 가져와서 실행하도록 한다. `worker`가 작업을 가져가면 `index`를 증가시키고, 작업이 끝나면 다음 작업을 가져오도록 해야한다.

```js
const worker = async () => {
  while (index < tasks.length) {
    // 현재 작업을 가져오고 다른 worker가 같은 작업을 가져가지 않도록 index를 증가시킨다.
    const taskIndex = index++;
    // 작업을 실행하는데, tasks[taskIndex]는 비동기 함수이므로 실행하면 Promise를 반환한다. 그러므로 await를 붙여서 결과를 기다린다.
    const result = await tasks[taskIndex]();
  }
};
```

여기서 `result`가 `await`로 기다려야하는 이유는 `tasks[taskIndex]()`가 비동기 함수이기 때문에, 해당 작업이 끝날 때까지 기다려야 다음 작업을 가져올 수 있기 때문이다.

만약 `await`를 붙이지 않으면, `worker`는 바로 다음 작업을 가져가게 되고, `limit`보다 많은 작업이 동시에 실행될 수 있다. 그리고 `worker` 내부에 `await`가 존재하기 때문에 `async`를 붙여야한다.

```js
const workers = Array.from({ length: limit }, () => worker()); // limit만큼의 worker를 생성한다.
await Promise.all(workers); // 모든 worker가 끝날 때까지 기다린다.
```

worker가 끝나면, 모든 작업이 끝난 것이므로 `Promise.all`로 모든 worker가 끝날 때까지 기다린다. 그리고 결과값을 배열로 반환해야 하는데, 이때 결과값이 빠르게 끝난 작업이 먼저 들어오게 되므로, 결과값을 저장할 배열은 `[]`로 초기화한다.

```js
const results = [];
```

이를 조합한 최종 구현은 다음과 같다.

```js
async function runWithConcurrency(tasks, limit) {
  const results = [];
  let index = 0;

  const worker = async () => {
    while (index < tasks.length) {
      const taskIndex = index++;
      const result = await tasks[taskIndex]();

      results.push(result);
    }
  };

  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () =>
    worker(),
  );

  await Promise.all(workers);
  return results;
}
```

실행 결과는 다음과 같이 나온다.

```text
[시작] Task 1
[시작] Task 2
[완료] Task 2
[시작] Task 3
[완료] Task 1
[시작] Task 4
[완료] Task 3
[시작] Task 5
[완료] Task 4
[완료] Task 5
모든 작업 완료: [ '결과 2', '결과 1', '결과 3', '결과 4', '결과 5' ]
```

## 결론

`queue`를 통해서 구현하는 방법도 있지만, queue에 넣고 빼는 과정보다 동시성만 제한하는 것이 목적이므로, `worker`를 만들어서 동시에 실행되는 작업의 수를 제한하는 방법이 더 간단하고 직관적이었다.

초반에는 `queue`를 구현하는 방법으로 접근했었는데, `task`가 `Promise`를 반환하는데도 아무런 `await` 없이 `queue`에 넣고 빼는 방식으로 구현했더니, 동시에 실행되는 작업의 수가 제한되지 않았었다.

비동기 함수를 다루는 방법은 아직 익숙하지 않아서, 이번 문제를 통해 `async/await`의 동작 방식과, 동시에 실행되는 작업의 수를 제한하는 방법에 대해 다시 한 번 생각해볼 수 있는 좋은 기회였다.
