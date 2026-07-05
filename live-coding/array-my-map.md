# myMap() 메서드 구현하기

라이브 코딩 스터디를 진행하며 `myMap()` 메서드를 구현하는 문제를 맞닥뜨렸다. 당시에는 풀지 못했지만, 이후 문제를 출제해주신 스터디원분께서 어떤 방식으로 구현할 수 있는지 알려주셨다.

## 구현 아이디어

```js
[1, 2, 3, 4].myMap((i) => i); // [1, 2, 3, 4]
[1, 2, 3, 4].myMap((i) => i * i); // [1, 4, 9, 16]
[1, , 2, 4].myMap((item) => item + 1); // [2, empty, 3, 5]
```

이 문제는 아래 세 가지를 모두 정확히 알고 있어야 풀 수 있는 문제다.

- `prototype`
- `this`
- `map()`

### prototype

자바스크립트는 **프로토타입 기반 언어**이다. 즉, 모든 객체들이 메서드와 속성들을 상속받기 위한 템플릿으로서 **프로토타입 객체**를 가진다는 의미다.

프로토타입 객체도 객체이기 때문에, 또다시 상위 프로토타입 객체로부터 메서드와 속성을 상속받을 수 있다. 이를 **프로토타입 체인**이라고 부르며, 다른 객체에 정의된 메서드와 속성을 한 객체에서 사용할 수 있도록 한다.

상속되는 속성과 메서드들은 각 객체가 아니라 객체의 생성자의 `prototype` 속성에 정의되어 있다. 따라서, 객체의 생성자 함수의 `prototype` 속성에 메서드를 정의하면, 해당 생성자로 생성된 모든 객체에서 그 메서드를 사용할 수 있다.

### this

`this`는 함수가 호출될 때 결정되는 **실행 컨텍스트**를 가리킨다. 즉, `this`는 함수가 호출될 때 어떤 객체의 메서드로서 호출되었는지에 따라 달라진다.

### map() 메서드에서 사용되는 인자들과 동작 방식

`map()` 메서드는 배열의 각 요소를 순회하며, 콜백 함수를 실행하고, 그 결과를 새로운 배열로 반환한다. 콜백 함수는 세 가지 인자를 받는다.

- `currentValue`: 현재 처리되고 있는 요소
- `index`: 현재 처리되고 있는 요소의 인덱스
- `array`: `map()`을 호출한 배열

## 풀이 방식

우선 `myMap()` 메서드가 배열에서 호출될 수 있도록 `Array.prototype`에 메서드를 정의해야 한다.

```js
Array.prototype.myMap = function () {};
```

그리고 `myMap()` 메서드 내부에서 `this`를 사용하면, `myMap()` 메서드를 호출한 배열을 가리키게 된다.

```js
Array.prototype.myMap = function () {
  console.log(this); // [1, 2, 3, 4]
};
```

`myMap` 메서드 내부에서 콜백 함수를 실행하고, 그 결과를 새로운 배열에 담아 반환해야한다. `map()` 메서드는 원본 배열을 변경하지 않기 때문이다.

```js
Array.prototype.myMap = function (callback) {
  const result = [];

  for (let i = 0; i < this.length; i++) {
    result.push(callback(this[i], i, this));
  }

  return result;
};
```

그런데 여기서 `[1, , 2, 4].myMap((item) => item + 1); // [2, empty, 3, 5]`와 같이 **빈 요소**가 있다. 빈 요소가 명시된 배열을 생성하기 위해서는 `new Array()`로 배열을 생성해야한다.

그리고 `map()` 메서드는 빈 요소를 건너뛰기 때문에, `myMap()` 메서드도 빈 요소를 건너뛰도록 구현해야한다.

```js
Array.prototype.myMap = function (callback) {
  const result = new Array(this.length);

  for (let i = 0; i < this.length; i++) {
    if (this[i]) result[i] = callback(this[i], i, this);
  }

  return result;
};
```

### 최종 코드

```js
Array.prototype.myMap = function (callback) {
  const result = new Array(this.length);

  for (let i = 0; i < this.length; i++) {
    if (this.hasOwnProperty(i)) result[i] = callback(this[i], i, this);
  }

  return result;
};

[1, 2, 3, 4].myMap((i) => i); // [1, 2, 3, 4]
[1, 2, 3, 4].myMap((i) => i * i); // [1, 4, 9, 16]
[1, , 2, 4].myMap((item) => item + 1); // [2, empty, 3, 5]
```

## 결론

메서드를 구현할 때는, 해당 메서드가 어떤 객체에서 호출될 수 있는지, 그리고 그 객체의 속성과 메서드를 어떻게 활용할 수 있는지를 이해하는 것이 중요하다.

`myMap()` 메서드 구현을 통해 `prototype`, `this`, 그리고 배열 메서드의 동작 방식을 깊이 이해할 수 있었다.


---

## 참고
- [Object prototypes - JavaScript | MDN](https://developer.mozilla.org/ko/docs/Learn_web_development/Extensions/Advanced_JavaScript_objects/Object_prototypes)
- [Array.prototype.map() - JavaScript | MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- [this - JavaScript | MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/this)