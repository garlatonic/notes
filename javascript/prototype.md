# prototype 이해하기

## 들어가며

JavaScript를 공부하다 보니 `prototype`, `__proto__`, `prototype chain`이라는 단어를 정말 많이 접하게 된다.

이번에 MDN 문서를 읽으면서 **객체가 메서드를 어떻게 찾는지**, 그리고 **왜 prototype에 메서드를 추가하는지**를 조금 더 명확하게 이해하게 되었다.

이번 글에서는 내가 이해한 내용을 중심으로 정리해보려고 한다.

## JavaScript는 프로토타입 기반 언어다

JavaScript는 흔히 **프로토타입 기반 언어(Prototype-based Language)** 라고 불린다. 이는 **모든 객체들이 메서드와 속성을 상속받기 위한 템플릿으로써 프로토타입 객체(Prototype Object)를 가진다**는 의미이다.

프로토타입 객체도 또 다시 상위 프로토타입 객체로부터 메서드와 속성을 상속받을 수 있으며, 그 상위 객체 역시 동일한 구조를 가진다. 이처럼 객체들이 연결되어 있는 구조를 **프로토타입 체인(Prototype Chain)** 이라고 한다.

프로토타입 체인을 통해 다른 객체에 정의된 메서드와 속성을 자신의 것처럼 사용할 수 있다.

## 프로토타입 객체 이해하기

MDN에서는 아래와 같은 `Person` 생성자를 예시로 사용했다.

```js
function Person(first, last, age, gender, interests) {
  this.first = first;
  this.last = last;
  this.age = age;
  this.gender = gender;
  this.interests = interests;
}

const person1 = new Person("Bob", "Smith", 32, "male", ["music", "skiing"]);
```

`person1`이라는 객체를 생성자 함수로 생성 후 확인해보면 이 객체에는 우리가 정의한 속성들만 있는 것처럼 보인다. 하지만 실제로 `valueOf()`를 실행하면 아래와 같은 결과가 출력된다.

```text
Person {
  first: 'Bob',
  last: 'Smith',
  age: 32,
  gender: 'male',
  interests: [ 'music', 'skiing' ]
}
```

생성자 함수에는 `valueOf()`라는 메서드를 정의하지 않았는데도 실행이 가능했다. 이는 `person1` 객체가 **자신의 프로토타입 체인을 따라 올라가며 `valueOf()`를 찾았기 때문**이다.

### 프로토타입 체인 탐색 과정

`person1.valueOf()`를 실행하면 JavaScript는 아래와 같은 순서로 메서드를 찾는다.

1. `person1` 객체에 `valueOf()`가 있는지 확인한다.
2. 없다면 `Person.prototype`에서 찾는다.
3. 그래도 없다면 `Object.prototype`에서 찾는다.
4. `Object.prototype`에 `valueOf()`가 있으므로 해당 메서드를 실행한다.

즉, 탐색 과정은 아래와 같다.

```text
person1 → Person.prototype → Object.prototype
```

MDN에서는 프로토타입 체인에서 메서드와 속성이 다른 객체로 복사되는 것이 아니라, **체인을 따라 올라가며 접근하는 것**이라고 강조한다.

### prototype과 [[prototype]]의 차이

문서를 읽으면서 가장 헷갈렸던 부분이다.

#### 생성자의 prototype

`prototype`은 **생성자 함수가 가지고 있는 객체**로, 앞으로 생성될 모든 인스턴스가 공유할 메서드와 속성을 정의한다.

```js
function Person() {}

Person.prototype;
```

#### 객체의 [[prototype]]

JavaScript 언어 표준 스펙에서 [[prototype]]으로 표현되는 프로토타입 객체에 대한 링크는 내부 속성으로 정의되어있다. 기존에는 `__proto__`라는 속성으로 접근할 수 있었지만, 현재는 권장되지 않는다. 대신 `Object.getPrototypeOf()` 메서드를 사용하여 확인할 수 있다.

```js
Object.getPrototypeOf(person1) === Person.prototype; // true
```

즉, [[prototype]]은 **객체가 실제 참조하는 프로토타입**을 의미한다.

## prototype 속성은 어디에 사용될까?

상속되는 메서드와 속성들은 **객체 자체가 아니라 생성자의 `prototype` 속성에 정의**되어 있다. 예를 들어 `Object.prototype`을 확인해 보면,

- `valueOf()`
- `toString()`
- `hasOwnProperty()`

등 다양한 메서드가 정의되어 있다. 별다른 설정 없이 사용할 수 있는 메서드를 인스턴스 메서드라고 부르는데, 이는 **생성자의 `prototype` 속성에 정의된 메서드**를 인스턴스가 상속받아 사용할 수 있기 때문이다.

하지만 일부 메서드의 경우에는 생성자의 `prototype` 속성에 정의되어 있지 않고, **생성자 자체에 정의**되어 있다. 예를 들어

- `Object.keys()`
- `Object.is()`

처럼 `Object` 생성자 자체에 정의된 메서드는 상속되지 않는다.

## Object.create() 다시보기

`Object.create()`도 프로토타입과 관련이 있다. 아래의 코드는 `person1`을 프로토타입으로 갖는 새로운 객체를 생성한다.

```js
const person2 = Object.create(person1);
```

즉, 아래와 같은 구조가 만들어진다.

```text
person2 → person1 → Person.prototype → Object.prototype
```

## constructor 속성

모든 생성자 함수의 `prototype` 객체에는 기본적으로 `constructor` 속성이 존재한다. `person1.constructor`를 확인하면 `Person` 생성자를 가리키고 있는 것을 확인할 수 있다.

```js
person1.constructor; // Person
```

이를 이용하면 아래의 코드처럼 같은 생성자로 새로운 객체를 생성할 수도 있고, 생성자의 이름도 확인이 가능하다.

```js
const person3 = new person1.constructor("Karen", "Stephenson", 26, "female", [
  "playing drums",
  "mountain climbing",
]);

person1.constructor.name; // Person
```

다만 MDN에서는 `constructor.name`은 변경될 수 있으므로, 타입 판별이 목적이라면 `instanceof`를 사용하는 것이 더 안전하다고 설명한다.

## Prototype 수정하기

생성자의 `prototype`은 언제든 수정할 수 있다.

```js
Person.prototype.farewell = function () {
  console.log(`${this.first} has left the building. Bye for now!`);
};

person1.farewell(); // Bob has left the building. Bye for now!
```

위의 코드처럼 Person 객체의 프로토타입에 메서드를 추가하면 이미 생성되어 있던 객체에서도 바로 사용할 수 있다.

처음에는 객체를 만든 이후에 추가한 메서드인데도 사용할 수 있다는 점이 신기했는데, 모든 객체가 같은 `Person.prototype`을 공유하기 때문에 가능한 동작이었다.

### 속성은 생성자에, 메서드는 Prototype에

MDN에서는 속성을 `prototype`에 추가하는 것은 권장하지 않는다고 설명한다.

```js
Person.prototype.fullName = "Bob Smith";
Person.prototype.fullName = this.first + this.last;
```

첫번째로 `fullName` 속성을 `prototype`에 추가하면 모든 인스턴스가 같은 값을 공유하게 된다. 즉, `person1.fullName`을 변경하면 `person2.fullName`도 변경된다.

두번째로 `this.first`와 `this.last`를 사용하여 `fullName`을 정의하면, `prototype`에 정의된 속성은 인스턴스가 생성될 때 평가되지 않기 때문에 `undefinedundefined`라는 값이 할당된다.

그래서 일반적으로는 아래와 같이 속성은 생성자에서 정의하고, 메서드는 `prototype`에서 정의하는 패턴을 사용한다.

```js
function Person(first, last) {
  this.first = first;
  this.last = last;
}

Person.prototype.getFullName = function () {
  return `${this.first} ${this.last}`;
};
```

---

## 느낀 점

이번 문서를 읽으면서 가장 크게 이해한 점은 다음과 같다.

- JavaScript는 **프로토타입 기반 언어**이다.
- 객체는 프로토타입 체인을 따라 필요한 프로퍼티를 탐색한다.
- 메서드가 객체마다 복사되는 것이 아니라 **공유**된다.
- `prototype`과 `[[Prototype]]`은 서로 다른 개념이다.
- `Object.create()`는 주어진 객체를 프로토타입으로 갖는 새로운 객체를 생성한다.
- 일반적으로 **속성은 생성자**, **메서드는 prototype**에 정의한다.

예전에는 프로토타입을 "상속" 정도로만 이해하고 있었는데, 이번 문서를 읽으면서 **객체가 메서드를 찾는 과정**이라는 관점에서 보니 훨씬 이해하기 쉬웠다.

특히 라이브 코딩에서 `myMap`, `myBind` 같은 메서드를 직접 구현할 때 왜 `Array.prototype`이나 `Function.prototype`에 메서드를 추가하는지 자연스럽게 연결되는 부분이 인상 깊었다.

앞으로는 단순히 문법을 외우기보다 **객체가 프로퍼티를 어떤 순서로 탐색하는지**를 떠올리며 공부해야겠다.

---

## 참고

- [Object prototypes - JavaScript | MDN](https://developer.mozilla.org/ko/docs/Learn_web_development/Extensions/Advanced_JavaScript_objects/Object_prototypes)
