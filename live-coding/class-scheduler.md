# 스케줄러 구현하기

저번에 동시 작업 제한을 구현하는 문제를 풀었는데, 그때는 클래스로 풀지않았다. 이번에는 클래스로 구현하는 문제를 준비해봤다.

## 문제

동시에 실행 가능한 작업 수를 제한하는 `Scheduler` 클래스를 구현하세요.

### 요구사항

- 생성자에서 동시에 실행 가능한 최대 작업 개수(limit)를 전달받습니다.
- `add(task)` 메서드를 구현하세요.
- `task`는 `Promise`를 반환하는 함수입니다.
- 실행 중인 작업 수가 `limit`에 도달하면 이후 작업은 대기해야 합니다.
- 작업이 완료되면 대기 중인 작업을 즉시 실행합니다.
- `add()`는 `Promise`를 반환해야 합니다.
- 작업이 실패(`reject`)하더라도 다음 작업은 계속 실행되어야 합니다.
- 작업은 등록된 순서대로 대기열에 들어가야 합니다.

### 테스트 코드

```js
const timeout = (time, value, shouldReject = false) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldReject) {
        reject(value);
      } else {
        resolve(value);
      }
    }, time);
  });

const scheduler = new Scheduler(2);
scheduler
  .add(() => timeout(1000, "A"))
  .then(console.log)
  .catch((error) => console.log("실패한 작업:", error));

scheduler
  .add(() => timeout(500, "B", true))
  .then(console.log)
  .catch((error) => console.log("실패한 작업:", error));

scheduler
  .add(() => timeout(300, "C"))
  .then(console.log)
  .catch((error) => console.log("실패한 작업:", error));

scheduler
  .add(() => timeout(400, "D"))
  .then(console.log)
  .catch((error) => console.log("실패한 작업:", error));
```

### 예상 출력

```
실패한 작업: B
C
A
D
```

## 구현 아이디어

일단 이전에 동시 작업 제한을 구현했던 방법을 떠올려보면, 작업을 등록할 때 실행 중인 작업 수를 확인하고, 제한에 도달하면 대기열에 넣고, 작업이 완료되면 대기열에서 다음 작업을 실행하는 방식이었다.

당시에는 `worker`라는 함수를 만들어서 작업을 실행하고, `Promise`를 반환하는 방식으로 구현했었다. 이번에는 클래스로 구현해야 하므로, `Scheduler` 클래스의 인스턴스 변수로 실행 중인 작업 수와 대기열을 관리해야 한다.

클래스를 구현할 때엔 `constructor`를 통해 초기화가 이루어진다. 따라서 `constructor`에서 `limit`를 받아서 인스턴스 변수로 저장하고, 실행 중인 작업 수와 대기열을 초기화해야 한다.

```js
class Scheduler {
  constructor(limit) {
    this.limit = limit;
    this.running = 0;
    this.queue = [];
  }
}
```

`Scheduler` 클래스에는 `add` 메서드가 존재해야한다.

`add` 메서드는 Promise를 반환하는 함수인 `task`를 인자로 받는다. 그리고 `add` 메서드의 경우 `Promise`를 반환해야 하므로, `add` 메서드 내부에서 새로운 `Promise`를 생성하고 반환해야 한다.

```js
add(task) {
  return new Promise((resolve, reject) => {});
}
```

만약 실행중인 작업수가 `limit`보다 작으면 바로 `task`를 실행하고, 실행중인 작업수를 증가시켜야한다. 이후 `task`가 완료되면 `resolve`를 호출하고, 실행중인 작업수를 감소시켜야한다.

대기열에 작업이 존재하면 대기열에서 다음 작업을 꺼내서 실행해야하므로, `try-catch-finally` 블록 또는 `then().catch().finally()`를 사용한다.

```js
if (this.running < this.limit) {
  try {
    this.running++;
    const result = await task();
    resolve(result);
  } catch (error) {
    reject(error);
  } finally {
    this.running--;
    if (this.queue.length > 0) {
      const nextTask = this.queue.shift();
      nextTask();
    }
  }
}
```

여기서 `else` 문을 작성해야하는데, `queue`에 작업을 추가하고, `queue`에 추가된 작업을 실행시켜야한다. 코드가 반복되므로 기존에 작성한 코드를 `runTask`라는 함수로 만들어서 재사용하면 된다.

`runTask` 함수는 `task`를 실행하고, 실행중인 작업수를 증가시키고, `task`가 완료되면 `resolve`를 호출하고, 실행중인 작업수를 감소시키고, 대기열에 작업이 존재하면 대기열에서 다음 작업을 꺼내서 실행하는 역할을 한다.

```js
const runTask = async () => {
  try {
    this.running++;
    const result = await task();
    resolve(result);
  } catch (error) {
    reject(error);
  } finally {
    this.running--;
    if (this.queue.length > 0) {
      const nextTask = this.queue.shift();
      nextTask();
    }
  }
};
if (this.running < this.limit) {
  runTask(task, resolve, reject);
} else {
  this.queue.push(() => runTask(task, resolve, reject));
}
```

최종적으로 Scheduler 클래스는 다음과 같이 구현할 수 있다.

### 최종 구현 코드 (async/await 사용)

```js
class Scheduler {
  constructor(limit) {
    this.limit = limit;
    this.running = 0;
    this.queue = [];
  }

  add(task) {
    return new Promise((resolve, reject) => {
      const runTask = async () => {
        try {
          this.running++;
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.running--;

          const nextTask = this.queue.shift();
          if (nextTask) nextTask();
        }
      };

      if (this.running < this.limit) {
        runTask();
      } else {
        this.queue.push(runTask);
      }
    });
  }
}
```

### 최종 구현 코드 (Promise 사용)

```js
class Scheduler {
  constructor(limit) {
    this.limit = limit;
    this.running = 0;
    this.queue = [];
  }
  add(task) {
    return new Promise((resolve, reject) => {
      const runTask = () => {
        this.running++;
        Promise.resolve()
          .then(task)
          .then(resolve)
          .catch(reject)
          .finally(() => {
            this.running--;

            const nextTask = this.queue.shift();
            if (nextTask) nextTask();
          });
      };

      if (this.running < this.limit) {
        runTask();
      } else {
        this.queue.push(runTask);
      }
    });
  }
}
```

## 결론

이번 문제를 통해 클래스로 동시 작업 제한을 구현하는 방법을 배웠다.

이전에 함수형으로 구현했던 방식과 달리, 클래스로 구현하면 상태를 인스턴스 변수로 관리할 수 있다는 점에서 장점이 있었다. 또한 `async/await`와 `Promise`를 사용하여 비동기 작업을 처리하는 방법을 다시 한번 복습할 수 있었다.
