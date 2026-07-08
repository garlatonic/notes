# JavaScript의 모듈 시스템

## 들어가며

프론트엔드의 대표적인 라이브러리인 React를 공부하다 보면 `export default`라는 문법을 자주 접하게 된다.

`rfc`와 같이 코드 스니펫을 통해 자동으로 컴포넌트를 생성하다 보니 `export`, `default`를 따로 공부하지 않고 사용하고 있었는데, 이번에 React 공식 문서를 읽고 정리하는 과정에서 이 문법을 조금 더 깊게 이해하고자 작성해보려고 한다.

---

## 모듈(Module)이란?

애플리케이션의 규모가 커질수록 하나의 파일에 모든 코드를 작성하면 복잡도가 증가하고 유지보수가 어려워진다. 이러한 문제를 방지하기 위해서 기능별로 파일을 분리하게 되는데, **이렇게 분리된 하나의 파일을 모듈(Module)** 이라고 한다.

모듈은 일반적으로 아래와 같이 하나의 책임을 가지도록 구성된다.

- 하나의 클래스
- 하나의 컴포넌트
- 특정 목적을 가진 함수들의 집합

JavaScript 초창기에는 스크립트의 규모가 크지 않았기 때문에 모듈에 대한 표준 문법이 존재하지 않았다고 한다. 하지만 애플리케이션이 점점 복잡해지면서 AMD, CommonJS, UMD와 같은 다양한 모듈 시스템이 등장했고, 이후 **ES2015(ES6)** 에서 JavaScript의 표준 모듈 시스템인 **ES Modules**가 도입되었다.

## export와 import

ES Modules에서는 `export`와 `import`, 두 가지 키워드를 통해 모듈 간 기능을 공유한다.

### export

`export`는 현재 모듈의 기능을 외부에 공개하도록 하는 키워드이다. 쉽게 말하면, **다른 모듈에서 사용할 수 있도록 내보내는 것**이다.

```js
// user.js
export function login() {}
export function logout() {}
```

위의 예시를 보면, `login()`과 `logout()` 함수에 `export`를 붙임으로서 다른 모듈에서 이 두 함수를 사용할 수 있도록 공개하고 있다. 로그인이나 로그아웃 기능이 필요한 곳에서 호출할 수 있다.

### import

`import`는 다른 모듈이 공개한 기능을 가져오는 키워드이다. 즉, **다른 모듈에서 내보낸 기능을 가져오는 것**이다.

```js
import { login, logout } from "./user.js";
```

`export`로 공개했던 `login()`과 `logout()` 함수를 `import`를 통해 가져오고 있다. 헤더의 로그인이나 로그아웃 버튼을 클릭했을 때, 이 두 함수를 호출하여 로그인과 로그아웃 기능을 수행할 수 있다.

## 모듈 내보내기 방식

### Named Export

가장 일반적인 내보내기 방식으로, **하나의 모듈에서 여러 개의 값을 내보낼 때** 사용하는 방식이다. 가져오는 쪽에서는 중괄호로 감싸되 반드시 같은 이름을 사용해야 하며, 만약 이름이 충돌할 경우 `as`를 이용해 이름을 변경할 수도 있다.

```js
import { login, logout } from "./user.js"; // Named Export로 내보낸 login, logout을 가져옴
import { login as signIn } from "./user.js"; // login을 signIn이라는 이름으로 가져옴
```

### Default Export

하나의 모듈이 **대표하는 값 하나만 내보낼 때** 사용하는 방식이다. Named Export와 달리 중괄호 없이 가져올 수 있으며, 가져오는 쪽에서 원하는 이름으로 자유롭게 사용할 수 있다.

```js
export default function App() {}
```

위와 같이 `App`이라는 함수를 `default export`로 내보냈다면, 가져오는 쪽에서는 아래와 같이 기존 이름 그대로 가져오거나 원하는 이름으로 가져올 수 있다. 이는 하나의 파일에는 `default export`가 하나만 존재할 수 있기 때문에 가능하다.

```js
import App from "./App.js";
import MyApp from "./App.js"; // App을 MyApp이라는 이름으로 가져옴
```

### 간단한 비교

| Named Export       | Default Export        |
| ------------------ | --------------------- |
| 여러 개 가능       | 파일당 하나           |
| `{}` 필요          | `{}` 불필요           |
| 이름이 일치해야 함 | 원하는 이름 사용 가능 |

## 모듈의 특징

ES Modules에는 몇 가지 중요한 특징이 있다. 이를 이해하면 React에서 `export default`를 사용하는 이유를 조금 더 명확하게 알 수 있다.

### 모듈은 독립적인 스코프를 가진다.

모듈 내부에서 선언한 변수는 다른 파일에서 접근할 수 없다. 필요한 기능만 `export`를 통해 외부에 공개한다.

### 항상 Strict Mode로 실행된다.

모듈은 별도의 `"use strict"`를 작성하지 않아도 항상 Strict Mode로 실행된다.

### 모듈은 한 번만 실행된다.

같은 모듈을 여러 번 import 하더라도 최초 한 번만 평가된다. 이후에는 동일한 모듈 객체를 공유한다. 이 특성 덕분에 설정(Configuration)이나 싱글톤 객체를 관리하기에도 적합하다.

### Tree Shaking이 가능하다.

필요한 기능만 가져오면 사용하지 않는 코드는 번들링 과정에서 제거된다. 이 과정을 **Tree Shaking**이라고 한다.

```js
import { login } from "./user.js";
```

예를 들어, `user.js` 모듈에서 `login()`과 `logout()` 함수를 내보냈지만, 실제로는 `login()`만 사용한다면 번들러는 `logout()` 코드를 제거할 수 있다.

---

## 느낀 점

이번 문서를 정리하면서 가장 크게 이해한 점은 다음과 같다.

- 모듈은 기능을 파일 단위로 분리하기 위한 개념이다.
- `export`와 `import`를 통해 필요한 기능만 공유한다.
- `Named Export`와 `Default Export`는 목적이 다르다.
- React에서 자주 사용하는 `export default`는 React 문법이 아니라 JavaScript 문법이다.
- ES Modules는 독립적인 스코프와 한 번만 실행되는 특징을 가진다.

React는 자바스크립트로 작성된 라이브러리이다. 그러므로 React에서 사용하는 문법은 곧 자바스크립트에서 사용하는 문법과 동일하다.
