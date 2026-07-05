# Promise.myAll() 구현하기

문제를 내면서 나도 공부하는 live coding... 문제 출제는 gpt에게 맡기고 나도 직접 풀어보았다.

## 문제

`Promise.myAll`을 구현하세요.

### 요구사항

- `Promise` 배열을 인자로 받습니다.
- 모든 `Promise`가 성공하면 결과 배열을 반환합니다.
- 하나라도 실패하면 즉시 `reject`되어야 합니다.
- 결과는 입력 순서를 유지해야 합니다.

### 테스트 코드

```javascript
Promise.myAll([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3),
]).then(console.log);

// [1, 2, 3]

Promise.myAll([
  Promise.resolve(1),
  Promise.reject("error"),
  Promise.resolve(3),
]).catch(console.error);

// error
```

## 구현 아이디어

우선 `Promise.myAll`은 `Promise.all`과 동일한 동작을 해야 한다.

`Promise.all`은 내부적으로 `Promise` 배열을 순회하며, 각 `Promise`가 완료될 때까지 기다린다. 모든 `Promise`가 완료되면 결과를 배열로 반환하고, 하나라도 실패하면 즉시 `reject`된다.

여기서 몰랐던 내용이 있는데 `Promise.all`은 정적 메서드다. 즉, `Promise.all`은 `Promise` 생성자 함수에 직접 연결되어 있는 메서드이므로, `Promise.all`을 호출할 때는 `Promise` 생성자 함수를 통해 호출해야 한다.

```js
Promise.myAll = function (promises) {};
```

myAll이 반환해야하는 값은 `Promise`이므로, `Promise` 생성자 함수를 사용하여 새로운 `Promise`를 반환해야 한다.

```js
Promise.myAll = function (promises) {
  return new Promise(); // Promise.all()은 Promise 객체를 반환하므로, 반환하는 값을 새로운 Promise 객체로 감싸서 반환해야 한다.
};
```

Promise는 콜백 함수를 인자로 받는데, 이 콜백함수는 `resolve`와 `reject` 함수를 인자로 받는다.

```js
Promise.myAll = function (promises) {
  return new Promise((resolve, reject) => {
    // 각각의 자리에 내가 지정한 식별자가 들어가는 것이기 때문에 굳이 resolve, reject라고 이름짓지 않아도 된다. 하지만 헷갈리기도 하고 관례상 resolve, reject라고 이름을 붙이는 것이 좋다.
  });
};
```

그 다음 해결해야하는 문제는 `promises` 배열을 순회하는 것이다. `promise`가 완료되면 결과를 `Promise` 객체로 이루어진 배열에 담아야하기 때문에 `new Array(promises.length)`로 결과를 담을 배열을 만들어주고, 하나의 `promise`가 완료되면 해당 인덱스에 결과를 담아주면 된다.

각각의 `promise`는 `then()`과 `catch()`를 사용하여 완료되었을 때와 실패했을 때를 처리할 수 있다. 하나라도 실패하면 즉시 `reject`되어야 하므로, `catch()`에서 `reject`를 호출하면 된다. 작업이 성공했을 경우 `then(value => { ... })`에서 결과를 배열에 담아주면 된다.

```js
Promise.myAll = function (promises) {
  return new Promise((resolve, reject) => {
    const results = new Array(promises.length); // 결과를 담을 배열을 만들어준다.

    promises.forEach((promise, index) => {
      promise
        .then((result) => {
          results[index] = result; // 결과를 일치하는 인덱스에 담아준다.
        })
        .catch(reject); // 하나라도 실패하면 reject를 호출한다.
    });
  });
};
```

여기서 모든 작업이 완료되었는지 확인해야한다. 모든 작업이 완료되었는지 확인하는 방법은 `results` 배열에 모든 요소가 채워졌는지 확인하는 것이다. 이를 위해서 `completedCount` 변수를 만들어서, `then()`이 호출될 때마다 `completedCount`를 증가시키고, `completedCount`가 `promises.length`와 같아지면 모든 작업이 완료된 것이므로 `resolve(results)`를 호출하면 된다.

```js
Promise.myAll = function (promises) {
  return new Promise((resolve, reject) => {
    const results = new Array(promises.length);
    let completedCount = 0;

    promises.forEach((promise, index) => {
      promise
        .then((result) => {
          results[index] = result;
          completedCount++;

          if (completedCount === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
};
```

여기서 만약 `promises` 배열이 비어있는 경우가 있을 수 있다. 그런 경우에는 `Promise.myAll([])`을 호출하면 즉시 `resolve([])`를 반환하도록 구현해야 한다. 이를 위해서 `promises.length`가 0인 경우를 처리하는 조건문을 추가하면 된다.

### 최종 코드 (테스트 코드 포함)

```js
Promise.myAll = function (promises) {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) {
      resolve([]);
      return;
    }

    const results = new Array(promises.length);
    let completedCount = 0;

    promises.forEach((promise, index) => {
      promise
        .then((result) => {
          results[index] = result;
          completedCount++;

          if (completedCount === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
};

Promise.myAll([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3),
]).then(console.log);

// [1, 2, 3]

Promise.myAll([
  Promise.resolve(1),
  Promise.reject("error"),
  Promise.resolve(3),
]).catch(console.error);

// error
```

## 결론

문제를 출제하는 사람 또한 해당 문제가 어떻게 구현되어야 하는지 이해가 필요하다. 이전엔 항상 비동기 처리 로직은 API 호출로만 사용해왔고, `const res = await data` 이런식으로만 해왔기 때문에 `Promise` 객체를 다루는 법과 `Promise.all()`의 동작 방식에 대해 깊이 이해하지 못하고 있었다. 이번 문제를 통해 `Promise`의 동작 방식과 `Promise.all()`의 동작 방식을 이해할 수 있었다.

---

## 참고

- [Promise.all() - JavaScript | MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
