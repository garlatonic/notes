# myFilter() 메서드 구현하기

라이브 코딩 스터디를 진행하며 `myFilter()` 메서드를 구현하는 문제를 풀었다. `myMap()` 메서드의 풀이를 보고나서 구현했기에 비교적 쉽게 구현할 수는 있었지만, `myMap()` 메서드와는 다르게 `myFilter()` 메서드는 **조건에 맞는 요소만을 반환**해야 한다는 점에서 조금 더 까다로웠다.

## 구현 아이디어

```js
[1, 2, 3, 4].myFilter((value) => value % 2 == 0); // [2, 4]
[1, 2, 3, 4].myFilter((value) => value < 3); // [1, 2]
```

이 문제는 아래 세 가지를 모두 정확히 알고 있어야 풀 수 있는 문제다.

- `prototype`
- `this`
- `filter()`

myMap() 메서드의 구현 방식에서 `prototype`, `this`의 동작 방식에 대한 이해가 충분하다면 어렵지 않게 구현할 수 있다. 만약 이해가 부족했다면 `myMap()` 메서드 구현 글을 참고하면 도움이 된다.

[./array-my-map.md](./array-my-map.md)

### filter() 메서드에서 사용되는 인자들과 동작 방식

`filter()` 메서드는 배열의 각 요소를 순회하며, 콜백 함수를 실행해 **조건에 맞는 요소만을 새로운 배열로 반환**한다. 콜백 함수는 세 가지 인자를 받는다.

- `currentValue`: 현재 처리되고 있는 요소
- `index`: 현재 처리되고 있는 요소의 인덱스
- `array`: `filter()`를 호출한 배열

## 풀이 방식

우선 `myFilter()` 메서드가 배열에서 호출될 수 있도록 `Array.prototype`에 메서드를 정의해야 한다.

```js
Array.prototype.myFilter = function () {};
```

그리고 `myFilter()` 메서드 내부에서 `this`를 사용하면, `myFilter()` 메서드를 호출한 배열을 가리키게 된다.

```js
Array.prototype.myFilter = function () {
  console.log(this); // [1, 2, 3, 4]
};
```

`myFilter` 메서드 내부에서 콜백 함수를 실행하고, 조건에 맞는 요소만을 새로운 배열에 담아 반환해야한다. `filter()` 메서드는 원본 배열을 변경하지 않기 때문이다.

```js
Array.prototype.myFilter = function (callback) {
  const result = [];

  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      result.push(this[i]);
    }
  }

  return result;
};
```

그리고 `filter()` 메서드는 빈 요소를 건너뛰기 때문에, `myFilter()` 메서드도 빈 요소를 건너뛰도록 구현해야한다.

```js
Array.prototype.myFilter = function (callback) {
  const result = [];

  for (let i = 0; i < this.length; i++) {
    if (this[i] && callback(this[i], i, this)) {
      result.push(this[i]);
    }
  }

  return result;
};
```

### 최종 코드

```js
Array.prototype.myFilter = function (callback) {
  const result = [];

  for (let i = 0; i < this.length; i++) {
    if (this[i] && callback(this[i], i, this)) {
      result.push(this[i]);
    }
  }

  return result;
};

[1, 2, 3, 4].myFilter((value) => value % 2 == 0); // [2, 4]
[1, 2, 3, 4].myFilter((value) => value < 3); // [1, 2]
```

## 결론

`myFilter()` 메서드를 구현하면서 `myMap()` 메서드와는 다르게 조건에 맞는 요소만을 반환해야 한다는 점에서 조금 더 까다로웠다. 하지만, `prototype`, `this`, `filter()` 메서드의 동작 방식에 대한 이해가 충분하다면 어렵지 않게 구현할 수 있다.

---

## 참고

- [Array.prototype.filter() - JavaScript | MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
