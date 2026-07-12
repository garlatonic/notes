# LRU Cache 구현하기

다음 라이브코딩 스터디 문제로 LRU Cache를 구현해보기로 했다. 이전 프로젝트에서 Copilot이 LRU Cache를 구현해준 적은 있었지만, 그때는 동작 원리를 제대로 이해하지 못했다. 이번에는 직접 구현하면서 LRU Cache가 어떻게 동작하는지 정리해보고자 한다.

## 문제

용량이 제한된 `LRUCache` 클래스를 구현하세요.

### 요구사항

- 생성자에서 캐시의 최대 용량인 `capacity`를 전달받습니다.
- `get(key)` 메서드를 구현하세요.
- `put(key, value)` 메서드를 구현하세요.
- `get(key)`로 조회한 데이터는 최근에 사용된 데이터로 갱신되어야 합니다.
- 이미 존재하는 `key`를 `put()`으로 갱신한 경우에도 최근에 사용된 데이터로 처리해야 합니다.
- 캐시 용량을 초과하면 가장 오랫동안 사용되지 않은 데이터를 제거해야 합니다.
- 존재하지 않는 `key`를 조회하면 `-1`을 반환해야 합니다.
- 가능하면 `get()`과 `put()`을 평균 `O(1)`에 동작하도록 구현하세요.

## 테스트 코드

```js
const cache = new LRUCache(2);

cache.put(1, 1);
cache.put(2, 2);

console.log(cache.get(1));
// 1

cache.put(3, 3);
// capacity를 초과했으므로 가장 오래 사용하지 않은 key 2 제거

console.log(cache.get(2));
// -1

cache.put(4, 4);
// 가장 오래 사용하지 않은 key 1 제거

console.log(cache.get(1));
// -1

console.log(cache.get(3));
// 3

console.log(cache.get(4));
// 4
```

## 구현 아이디어

예전에 프로젝트 진행할 때 `Cache`를 Copilot이 구현해준 적이 있었는데 그 때 구현했던 게 `LRU Cache`였던 것 같다. 사실 의미도 모르고 구현했었지만 이제는 `LRU Cache`의 의미도 알았으니 이번에는 직접 구현해볼 수 있을 것 같다.

우선, `LRUCache` 클래스의 생성자에서 `capacity`를 전달받아 인스턴스 변수로 저장한다. 또한, 캐시 데이터를 저장할 자료구조를 선택해야 한다. 평균 `O(1)`에 동작하도록 하기 위해서는 `Map`을 사용하는 것이 좋다.

```js
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
}
```

여기서 `Map` 객체를 사용하는 이유는 하나 더 있다. `Map`은 삽입 순서를 유지하는 자료구조이다. 따라서 가장 오래 전에 사용된 데이터는 항상 `Map`의 가장 앞에 위치하게 된다. 또한 `Map`은 `get`, `set`, `delete`가 평균 `O(1)`에 동작하기 때문에 `LRU Cache`를 구현하기에 적합하다.

이러한 원리를 통해서 `put(key, value)` 메서드를 구현할 수 있는데, `put()`에서는 크게 두 가지 상황을 고려해야 한다.

- 이미 존재하는 `key`를 갱신하는 경우
- 새로운 `key`를 추가하는데 캐시가 가득 찬 경우

이미 존재하는 `key`를 `put()`으로 갱신한 경우에는 해당 `key`를 삭제하고, 다시 삽입하여 최근에 사용된 데이터로 갱신한다. 그리고 캐시 용량을 초과하면 가장 오래 사용하지 않은 데이터를 제거하고, 새로운 데이터를 삽입한다. `Map` 객체의 첫 번째 요소를 제거하기 위해서는 `this.cache.keys().next().value`를 사용하면 된다.

```js
put(key, value) {
  if (this.cache.has(key)) {
    this.cache.delete(key);
  } else if ( this.cache.size >= this.capacity) {
    const oldestKey = this.cache.keys().next().value;
    this.cache.delete(oldestKey);
  }

  this.cache.set(key, value);
}
```

`get(key)` 메서드는 단순히 캐시에서 해당 `key`를 조회하고, 존재하지 않으면 `-1`을 반환한다. 존재하는 경우에는 해당 `key`를 삭제하고, 다시 삽입하여 최근에 사용된 데이터로 갱신한다.

```js
get(key) {
  if (!this.cache.has(key)) return -1;

  const value = this.cache.get(key);
  this.cache.delete(key);
  this.cache.set(key, value);

  return value;
}
```

여기서 `delete()`를 하고 `set()`을 호출해야 한다. 단순히 `set()`만 호출해서는 최근에 사용된 데이터로 갱신되지 않는다. `Map`은 기존 `key`에 대해 `set()`을 호출해도 삽입 순서를 변경하지 않기 때문이다.

따라서 기존 `key`를 먼저 삭제한 뒤 다시 `set()`하여 가장 뒤로 이동시켜야 한다.

### 최종 구현 코드

최종 구현 코드는 다음과 같다.

```js
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;

    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, value);
  }
}
```

주어진 테스트 케이스를 실행하면 정상적으로 동작하는 것을 확인할 수 있다.

## 결론

`LRU Cache`의 의미를 이해하고, `Map` 객체의 특성을 사용해 보다 쉽게 구현할 수 있었다. 만약 `Map` 객체를 사용하지 않고 구현해야 한다면 배열과 객체를 조합하여 구현해야할 것 같다.
