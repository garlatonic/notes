# myFlat() 메서드 구현하기

다음 라이브 코딩 스터디에서 진행할 문제로 `Array.prototype.flat()`을 직접 구현해보려고 한다.

이번 문제를 통해 중첩 배열의 구조와 재귀 호출의 흐름을 이해하고, 원하는 깊이만큼 배열을 평탄화하는 방법을 학습하는 것이 목표다!

## 문제

`flat()`과 동일하게 동작하는 `myFlat()`을 구현하세요.

## 요구사항

- 중첩된 배열을 평탄화하여 새로운 배열을 반환해야 합니다.
- `depth`를 인자로 받을 수 있으며, 기본값은 `1`입니다.
- 전달받은 `depth`만큼만 배열을 평탄화해야 합니다.
- `depth`가 `Infinity`인 경우 모든 중첩 배열을 평탄화해야 합니다.
- 원본 배열은 변경하지 않아야 합니다.
- 희소 배열의 빈 슬롯은 결과에서 제외해야 합니다.

### 테스트 코드

```js
console.log([1, [2, 3], [4, 5]].myFlat());
// [1, 2, 3, 4, 5]

console.log([1, [2, [3, [4]]]].myFlat());
// [1, 2, [3, [4]]]

console.log([1, [2, [3, [4]]]].myFlat(2));
// [1, 2, 3, [4]]

console.log([1, [2, [3, [4]]]].myFlat(Infinity));
// [1, 2, 3, 4]

console.log([1, [], [2, [], [3]]].myFlat(Infinity));
// [1, 2, 3]

console.log([1, , [2, , 3]].myFlat(Infinity));
// [1, 2, 3]

const arr = [1, [2, 3]];
const flattened = arr.myFlat();

console.log(flattened);
// [1, 2, 3]

console.log(arr);
// [1, [2, 3]]

console.log(flattened === arr);
// false
```

## 구현 아이디어

`myFlat()`은 다음과 같이 배열 인스턴스에서 호출된다.

```js
[1, [2, 3]].myFlat();
```

따라서 `Array.prototype`에 `myFlat()` 메서드를 정의해야 한다. 또한 `depth`가 전달되지 않았을 때 한 단계만 평탄화해야 하므로 기본값을 `1`로 설정한다.

```js
Array.prototype.myFlat = function (depth = 1) {};
```

### 새로운 결과 배열 생성하기

`flat()`은 원본 배열을 직접 수정하지 않고 새로운 배열을 반환한다. 따라서 평탄화된 요소를 저장할 `result` 배열을 생성한다.

```js
const result = [];
```

`depth`가 `0`인 경우에도 원본 배열인 `this`를 그대로 반환하면 안 된다.

```js
const arr = [1, [2]];

arr.flat(0) === arr;
// false
```

`flat(0)`은 배열을 평탄화하지는 않지만, 원본과 다른 새로운 배열을 반환한다.

별도의 조기 반환을 작성하는 대신, 배열을 순회하며 모든 요소를 `result`에 추가하면 `depth`가 `0`인 경우에도 자연스럽게 새로운 배열을 반환할 수 있다.

### 배열 요소 순회하기

배열의 각 요소를 순회하면서 현재 요소가 배열인지 확인한다. 현재 요소가 배열이고 `depth`가 `0`보다 크다면, `depth`를 하나 감소시켜 `myFlat()`을 재귀적으로 호출한다.

```js
if (Array.isArray(value) && depth > 0) {
  result.push(...value.myFlat(depth - 1));
}
```

재귀 호출의 결과는 배열이므로 전개 문법을 사용하여 각 요소를 `result`에 추가한다. 현재 요소가 배열이 아니거나 더 이상 평탄화할 깊이가 남아 있지 않다면 해당 값을 그대로 추가한다.

```js
else {
  result.push(value);
}
```

### 희소 배열 처리하기

JavaScript 배열에는 값이 할당되지 않은 빈 슬롯이 존재할 수 있다.

```js
const arr = [1, , 3];
```

이 배열의 두 번째 위치에는 `undefined`라는 값이 저장된 것이 아니라 실제 요소가 존재하지 않는다.

```js
1 in arr;
// false
```

실제 `flat()`은 현재 평탄화하는 깊이에서 이러한 빈 슬롯을 결과 배열에 포함하지 않는다. 따라서 `i in this`를 사용하여 해당 인덱스에 실제 요소가 존재하는지 확인한다.

```js
if (!(i in this)) continue;
```

### `Infinity`가 전달된 경우

`depth`에 `Infinity`가 전달되면 다음 재귀 호출에는 `depth - 1`이 전달된다. JavaScript에서 유한한 값을 `Infinity`에서 빼더라도 결과는 여전히 `Infinity`다.

```js
Infinity - 1;
// Infinity
```

따라서 중첩 배열을 만날 때마다 계속 재귀 호출된다.

다만 재귀 호출은 현재 요소가 배열인 경우에만 발생한다. 더 이상 중첩 배열이 존재하지 않으면 재귀 호출도 자연스럽게 종료된다.

```txt
[1, [2, [3]]]
→ [2, [3]] 탐색
→ [3] 탐색
→ 3은 배열이 아니므로 종료
```

### 최종 구현 코드

```js
Array.prototype.myFlat = function (depth = 1) {
  const result = [];

  for (let i = 0; i < this.length; i++) {
    if (!(i in this)) continue;

    const value = this[i];

    if (Array.isArray(value) && depth > 0) {
      result.push(...value.myFlat(depth - 1));
    } else {
      result.push(value);
    }
  }

  return result;
};
```

## 동작 흐름

다음 배열을 `depth`가 `2`인 상태로 실행한다고 가정해보자.

```js
[1, [2, [3, [4]]]].myFlat(2);
```

첫 번째 호출에서는 `depth`가 `2`다.

```txt
1은 배열이 아니므로 result에 추가
[2, [3, [4]]]는 배열이므로 depth 1로 재귀 호출
```

두 번째 호출에서는 `depth`가 `1`이다.

```txt
2는 배열이 아니므로 result에 추가
[3, [4]]는 배열이므로 depth 0으로 재귀 호출
```

세 번째 호출에서는 `depth`가 `0`이다.

```txt
3은 배열이 아니므로 result에 추가
[4]는 배열이지만 depth가 0이므로 그대로 result에 추가
```

최종 결과는 다음과 같다.

```js
[1, 2, 3, [4]];
```

## 결론

이번 문제를 통해 재귀 호출을 사용하여 중첩 배열을 탐색하고, 원하는 깊이만큼 배열을 평탄화하는 방법을 학습했다.

- `Array.prototype`에 직접 메서드를 정의하는 방법
- `Array.isArray()`를 이용해 배열 여부를 확인하는 방법
- `depth`를 감소시키며 재귀 호출의 범위를 제한하는 방법
- `Infinity`를 이용해 모든 중첩 배열을 탐색하는 원리
- 희소 배열의 빈 슬롯과 `undefined` 값의 차이
- 원본 배열을 변경하지 않고 새로운 배열을 반환하는 방법

단순히 배열을 재귀적으로 펼치는 것뿐만 아니라, 실제 `Array.prototype.flat()`의 동작에 가깝게 구현하려면 새로운 배열 반환과 희소 배열 처리까지 함께 고려해야 한다.
