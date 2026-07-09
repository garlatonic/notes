# curry 구현하기

인자를 누적하여 원본 함수의 매개변수가 채워질 때까지 기다렸다가, 매개변수가 모두 전달되면 원본 함수를 실행하는 `curry` 함수를 구현해보는 문제를 다뤄보려고 한다. 물론 라이브코딩 스터디를 진행하며 출제할 문제이기도 하다.

## 문제

`curry` 함수를 구현하세요.

### 요구사항

- 함수를 인자로 받습니다.
- 원본 함수의 매개변수 개수가 모두 채워질 때까지 인자를 누적합니다.
- 한 번에 여러 개의 인자를 전달할 수 있어야 합니다.
- 매개변수가 모두 전달되면 원본 함수를 실행합니다.

### 테스트 코드

```js
function sum(a, b, c) {
  return a + b + c;
}

const curriedSum = curry(sum);

console.log(curriedSum(1)(2)(3)); // 6
console.log(curriedSum(1, 2)(3)); // 6
console.log(curriedSum(1)(2, 3)); // 6
console.log(curriedSum(1, 2, 3)); // 6
```

## 구현 아이디어

`curry` 함수를 구현하기 위해서는 원본 함수의 매개변수 개수를 알아야한다. 원본 함수의 매개변수 개수를 알아야, 매개변수가 모두 전달되었는지 확인할 수 있기 때문이다.

여기서 `Function.prototype.length`를 사용하면 원본 함수의 매개변수 개수를 알 수 있다. `Function.prototype.length`는 함수의 매개변수 개수를 반환하는 프로퍼티이다.

우선, 테스트 코드를 확인하면 curry 함수를 저장한 curriedSum을 호출할 때 sum 함수의 반환값이 나오도록 구현해야 한다. 따라서 curry 함수는 반환값으로 함수를 반환한다.

```js
function curry(fn, ...preArgs) {
  return function (...laterArgs) {};
}
```

여기서 매개변수를 누적하기 위해서 `curry` 함수, 그리고 반환하는 함수에서 매개변수를 저장해야한다. 이전에 전달된 매개변수는 `preArgs`에 저장하고, 이후에 전달된 매개변수는 `laterArgs`에 저장한다. 그리고 `preArgs`와 `laterArgs`를 합쳐서 새로운 배열을 만들어야 한다.

```js
const args = [...preArgs, ...laterArgs];
```

그리고 전달된 매개변수의 갯수와 원본 함수의 매개변수 개수를 비교하여, 매개변수가 모두 전달되었는지 확인해야 한다. 만약 매개변수가 모두 전달되었다면 원본 함수를 실행하고, 그렇지 않다면 다시 함수를 반환해야 한다.

```js
if (args.length >= fn.length) {
  return fn(...args);
} else {
  return curry(fn, ...args);
}
```

`args.length`가 `fn.length`보다 크거나 같으면 원본 함수를 실행하고, 그렇지 않으면 다시 `curry` 함수를 호출하여 매개변수를 누적한다. 이때, `preArgs`에 `args`를 전달하여 이전에 전달된 매개변수와 이후에 전달된 매개변수를 합친다.

### 최종 구현 코드 (테스트 코드 포함)

```js
function curry(fn, ...preArgs) {
  return function (...laterArgs) {
    const args = [...preArgs, ...laterArgs];

    if (args.length >= fn.length) return fn(...args);
    return curry(fn, ...args);
  };
}

function sum(a, b, c) {
  return a + b + c;
}

const curriedSum = curry(sum);

console.log(curriedSum(1)(2)(3)); // 6
console.log(curriedSum(1, 2)(3)); // 6
console.log(curriedSum(1)(2, 3)); // 6
console.log(curriedSum(1, 2, 3)); // 6
```

`args.length`가 `fn.length`보다 작으면 조건문에 걸리지 않기 때문에 바로 `return curry(fn, ...args)`가 실행된다. 조건문에 걸리면 해당 조건문 내에서 `return fn(...args)`가 실행되며, 원본 함수가 실행된다.

## 결론

이번 문제를 통해 `curry` 함수를 구현하는 방법을 배웠다. `Function.prototype.length`를 사용하여 원본 함수의 매개변수 개수를 확인할 수 있다는 점에서 새로운 사실을 알게 되었고, 괄호를 여러번 사용하는 방식으로도 함수가 실행될 수 있다는 점에서 흥미로웠다.