# myBind() 메서드 구현하기

## 문제

`myBind` 함수를 구현하세요.

### 요구사항

- `this`를 지정한 새로운 함수를 반환해야 합니다.
- 부분 적용(Partial Application)을 지원해야 합니다.
- 호출 시 전달한 인자와 미리 전달한 인자를 모두 사용할 수 있어야 합니다.

### 추가 조건

- `call` 또는 `apply`를 사용할 수 있습니다.
- 생성자(`new`)로 호출되는 경우는 고려하지 않아도 됩니다.

### 테스트 코드

```js
const person = { name: "철수" };

function introduce(age, city) {
  return `${this.name} / ${age} / ${city}`;
}

const bound = introduce.myBind(person, 20);
console.log(bound("서울")); // 철수 / 20 / 서울
```

## 구현 아이디어

이 문제는 `bind()` 메서드를 아는지 모르는지에 따라서 난이도가 달라질 수 있는 문제다. 일단 나는 `bind()` 메서드를 설명하기 어렵다... 그러므로 `Function` 객체부터 다시 톺아보는 것이 좋을 것 같다.

### Function

`Function` 객체는 함수의 메서드를 제공한다. 사실 모든 함수는 `Function` 객체의 인스턴스이므로, `Function` 객체의 메서드를 사용할 수 있는 것이다.

여기서 다뤄야하는 `Function`의 인스턴스 메서드는 `bind()`, `call()`, `apply()`이다. 이 세 가지 메서드는 모두 `this`를 바인딩하는 역할을 한다.

#### bind()

`bind()` 메서드를 호출하면 새로운 함수를 생성하고, 받게 되는 첫번째 인자의 `value`는 `this`로 지정된다. 이어지는 인자들은 바인딩된 함수의 인자로 전달된다. 즉, `bind()` 메서드는 `this`를 바인딩하고, 부분 적용을 지원하는 새로운 함수를 반환한다.

```js
Function.prototype.bind = function (thisArg, ...args) {};
```

MDN 문서에서는 `bind(thisArg[, arg1[, arg2[, ...]]])`와 같이 표기되어 있는데, 여기서 `thisArg`는 바인딩할 `this`를 의미하고, `arg1`, `arg2`, ...는 바인딩된 함수의 인자로 전달될 값들을 의미한다. 헷갈리니 나는 `bind(thisArg, ...args)`라고 표기하는 것이 더 직관적인 것 같다.

#### call()

`call()` 메서드는 `bind()`와 달리 새로운 함수를 반환하지 않고, 즉시 호출한다. 첫번째 인자는 `this`로 지정되고, 이어지는 인자들은 호출되는 함수의 인자로 전달된다.

```js
Function.prototype.call = function (thisArg, ...args) {};
```

#### apply()

`apply()` 메서드는 `call()`과 거의 동일하지만, 이어지는 인자들을 배열로 전달한다는 점이 다르다.

나는 아무 이유없이 `apply()`를 더 많이 사용했는데, `call()`과 `apply()`의 차이를 잘 이해하지 못하고 있었던 것 같다. `apply()`는 배열을 인자로 전달해야하므로, `...args`와 같은 가변인자를 사용할 수 없고, 배열을 전달해야한다. 따라서, `apply()`는 인자의 개수가 동적으로 변할 수 있는 경우에 유용하게 사용할 수 있다.

```js
Function.prototype.apply = function (thisArg, args) {};
```

어느정도 `bind()`, `call()`, `apply()` 메서드의 동작 방식을 이해했다면, 이제 `myBind()` 메서드를 구현할 수 있다. `myBind()` 메서드는 `bind()` 메서드와 동일한 동작을 해야 한다.

우선 `myBind()` 메서드가 함수에서 호출될 수 있도록 `Function.prototype`에 메서드를 정의해야 한다. 인자는 바인딩할 객체 `thisArg`와 바인딩된 함수의 인자로 전달될 값들인 `...args`을 받는다.

```js
Function.prototype.myBind = function (thisArg, ...args) {};
```

부분 적용을 지원해야하므로, `myBind()` 메서드 내부에서 새로운 함수를 반환해야 한다. 반환되는 함수는 `this`를 바인딩하고, 바인딩된 함수의 인자로 전달될 값들을 받아야 한다.

```js
Function.prototype.myBind = function (thisArg, ...preArgs) {
  // 이전에 전달된 인자이므로 preArgs로 이름을 변경하고, 나중에 전달되는 인자는 laterArgs로 이름을 변경한다.
  return function (...laterArgs) {};
};
```

이제 반환되는 함수 내부에서 `this`를 바인딩하고, 바인딩된 함수를 호출해야한다. `this`를 바인딩하기 위해 `call()` 또는 `apply()` 메서드를 사용할 수 있다. 나는 `call()` 메서드를 사용하여, 이전에 전달된 인자와 나중에 전달되는 인자를 모두 전달한다.

```js
Function.prototype.myBind = function (thisArg, ...preArgs) {
  // 이전에 전달된 인자이므로 preArgs로 이름을 변경하고, 나중에 전달되는 인자는 laterArgs로 이름을 변경한다.
  return function (...laterArgs) {
    return this.call(thisArg, ...preArgs, ...laterArgs); // call() 메서드는 배열이 아닌 가변인자를 전달해야하므로, ...preArgs와 ...laterArgs를 사용하여 배열을 펼쳐서 전달한다.
  };
};
```

이 상태에서 테스트 코드를 돌려보면 `TypeError: this.call is not a function` 에러가 발생한다.... ^^!!
왜냐하면, 반환되는 함수 내부에서 `this`는 바인딩된 함수가 아니라, 반환되는 함수 자체를 가리키기 때문이다. 따라서, `this`를 바인딩하기 위해서는 `myBind()` 메서드 내부에서 `this`를 저장해야한다.

```js
Function.prototype.myBind = function (thisArg, ...preArgs) {
  const fn = this; // this는 바인딩된 함수가 아니라, 반환되는 함수 자체를 가리키므로, 바인딩된 함수를 저장한다.
  return function (...laterArgs) {
    return fn.call(thisArg, ...preArgs, ...laterArgs);
  };
};
```

### 최종 코드

```js
Function.prototype.myBind = function (thisArg, ...preArgs) {
  const fn = this;
  return function (...laterArgs) {
    return fn.call(thisArg, ...preArgs, ...laterArgs);
  };
};
```

여기서 더 나아가면 생성자로 호출되는 경우를 고려해야 한다. 생성자로 호출될 경우에는 `this`는 바인딩된 객체가 아닌 새롭게 생성된 객체를 가리키게 된다. 따라서, 반환되는 함수 내부에서 `this`를 바인딩하기 위해 `new` 연산자를 사용하여 새롭게 생성된 객체를 반환해야한다.

```js
Function.prototype.myBind = function (thisArg, ...preArgs) {
  const fn = this;
  return function (...laterArgs) {
    if (this instanceof fn) {
      // 혹은 new.target으로 조건을 걸 수 있다.
      // new.target은 생성자로 호출된 경우에만 존재한다.
      return new fn(...preArgs, ...laterArgs); // 생성자로 호출된 경우에는 새롭게 생성된 객체를 반환한다.
    }
    return fn.call(thisArg, ...preArgs, ...laterArgs);
  };
};
```

## 결론

일단 `bind()` 메서드의 동작 방식을 이해하는 것이 중요한 문제였다. `bind()` 메서드는 `this`를 바인딩하고, 부분 적용을 지원하는 새로운 함수를 반환한다. `call()`과 `apply()` 메서드는 `this`를 바인딩하고, 즉시 호출한다. `call()`은 가변인자를 전달하고, `apply()`는 배열을 전달한다. 그 차이점을 알고 이해하는 것이 중요했던 만큼 이번 문제를 생성하고 풀이하는 데에 많은 시간이 투자되었다.

---

## 참고

- [Function.prototype.bind() - JavaScript | MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- [Function.prototype.apply() - JavaScript | MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
- [Function.prototype.call() - JavaScript | MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/call)
