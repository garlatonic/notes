# Shopify CLI 이해하기

로드맵 4일차의 학습 목표는 **Shopify CLI가 어떤 역할을 하는지 이해하고, Shopify App을 생성하고 개발하여 배포하기까지의 기본적인 흐름을 파악하는 것**에 중점을 두려고 한다.

앞서 Shopify App은 Shopify의 기본 기능을 확장하거나 외부 서비스와 연동하기 위한 애플리케이션이라고 정리했다. 이러한 App을 실제로 생성하고 개발하기 위해 Shopify에서는 공식 커맨드라인 도구인 Shopify CLI를 제공한다.

## Shopify CLI란?

Shopify CLI는 <mark>Shopify App, Theme, Custom Storefront를 생성하고 개발하는 데 사용하는 공식 커맨드라인 도구</mark>이다.

일반적인 프론트엔드 개발에서도 프로젝트를 생성하고 로컬 개발 서버를 실행하거나 빌드하기 위해 CLI를 사용한다. Shopify CLI 역시 비슷한 역할을 하지만, 단순히 프로젝트를 생성하고 실행하는 것을 넘어 Shopify 플랫폼과 연결하는 작업까지 함께 처리한다.

App 개발을 기준으로 Shopify CLI는 다음과 같은 기능을 제공한다.

* 새로운 App 프로젝트 생성
* App Extension 생성
* App과 Extension 빌드
* 로컬 개발 환경 실행
* Dev Store 연결
* 개발 환경을 외부에 연결하기 위한 Tunnel 생성
* App 설정과 Extension 배포

즉, Shopify CLI는 <mark>Shopify App의 생성부터 개발, Extension 추가, 배포까지 전체적인 개발 흐름을 관리하는 도구</mark>라고 이해할 수 있다.

## Shopify CLI의 기본 개발 흐름

Shopify CLI를 이용한 App 개발은 크게 다음과 같은 흐름으로 진행된다.

```text id="vwfsgj"
App 프로젝트 생성
shopify app init
        │
        ▼
로컬 개발
shopify app dev
        │
        ▼
Extension 추가
shopify app generate extension
        │
        ▼
App 개발
        │
        ▼
배포
shopify app deploy
```

각각의 명령어가 담당하는 역할을 이해하면 Shopify App의 기본적인 개발 흐름도 함께 파악할 수 있다.

## shopify app init

`shopify app init`은 새로운 Shopify App 프로젝트를 생성하고 초기화하는 명령어이다.

```bash
shopify app init
```

일반적인 프론트엔드 개발에서 `create-next-app`이나 `npm create vite`를 이용해 새로운 프로젝트를 생성하는 것과 비슷한 역할을 한다.

다만 단순히 프로젝트 폴더를 생성하는 것이 아니라, <mark>Shopify CLI가 요구하는 표준 디렉터리 구조를 기반으로 App 프로젝트를 생성하고 개발에 필요한 기본적인 환경을 구성한다.</mark>

Shopify CLI를 통해 생성된 App은 일정한 디렉터리 구조를 따르기 때문에 App 본체와 여러 Extension을 하나의 프로젝트에서 함께 관리할 수 있다.

## shopify app dev

`shopify app dev`는 Shopify App을 로컬 환경에서 개발할 때 사용하는 명령어이다.

```bash
shopify app dev
```

일반적인 프론트엔드 프로젝트의 `npm run dev`와 비슷하게 개발 환경을 실행하는 역할을 하지만, Shopify App 개발에 필요한 추가적인 작업도 함께 처리한다.

대표적으로 다음과 같은 작업이 이루어진다.

* App과 Extension 빌드
* 로컬 개발 환경 실행
* Dev Store 연결
* Tunnel 생성
* Shopify 환경에서 App 미리보기

즉, `shopify app dev`는 <mark>단순히 로컬 개발 서버를 실행하는 것이 아니라 로컬에서 개발 중인 App을 실제 Shopify 개발 환경과 연결해주는 역할</mark>을 한다.

### Dev Store

Dev Store는 Shopify App이나 Theme을 개발하고 테스트하기 위한 개발용 Store이다.

개발자는 실제 운영 중인 Store에 바로 기능을 적용하는 대신 Dev Store에서 App을 설치하고 기능을 테스트할 수 있다.

### Tunnel

Shopify App은 Shopify Admin이나 다른 Shopify Surface에서 로컬 App과 통신해야 하는 경우가 있다. 하지만 일반적인 `localhost` 주소는 외부의 Shopify 환경에서 직접 접근할 수 없다.

이때 Tunnel을 이용해 로컬 개발 환경에 외부에서 접근할 수 있는 임시 URL을 만들 수 있다.

```text id="3i89zq"
Shopify / Dev Store
        │
        ▼
     Tunnel
        │
        ▼
Local App
```

따라서 Tunnel은 <mark>Shopify 환경과 개발자의 로컬 App을 연결해주는 통로</mark>라고 이해할 수 있다.

## shopify app generate extension

`shopify app generate extension`은 App에 새로운 Extension을 추가할 때 사용하는 명령어이다.

```bash
shopify app generate extension
```

명령어를 실행하면 필요한 Extension의 종류를 선택하고 해당 Extension을 개발하기 위한 기본적인 디렉터리와 설정 파일을 생성할 수 있다.

예를 들어 다음과 같은 Extension을 추가할 수 있다.

* Theme App Extension
* Checkout UI Extension
* Admin UI Extension

앞서 App과 Extension을 공부하면서 <mark>Extension은 App의 기능을 Shopify의 특정 영역에 연결하는 역할</mark>이라고 정리했다.

따라서 새로운 Shopify Surface에 App의 기능을 추가해야 한다면, 단순히 새로운 페이지나 컴포넌트를 만드는 것이 아니라 목적에 맞는 Extension을 생성하여 개발할 수 있다.

## shopify app deploy

`shopify app deploy`는 App의 설정과 Extension을 Shopify에 배포하기 위해 사용하는 명령어이다.

```bash
shopify app deploy
```

일반적인 프론트엔드의 배포가 웹 애플리케이션의 코드를 서버나 호스팅 서비스에 업로드하는 과정이라면, Shopify App의 배포는 조금 다르게 이해할 필요가 있다.

`shopify app deploy`를 실행하면 App의 Configuration과 Extension 등이 Shopify에 배포되어 Shopify 플랫폼에서 최신 상태를 사용할 수 있게 된다.

즉, `shopify app deploy`는 <mark>App 자체의 웹 서버를 배포하는 명령어라기보다 Shopify가 관리하는 App 설정과 Extension을 배포하는 명령어</mark>라고 이해할 수 있다.

App의 웹 애플리케이션이나 백엔드가 별도의 서버에서 실행된다면 해당 애플리케이션의 배포는 별도로 진행해야 할 수 있다.

## App 구조와 Shopify CLI

Shopify CLI로 생성한 App은 Shopify에서 정의한 표준 디렉터리 구조를 따른다. 이를 통해 App의 웹 애플리케이션과 여러 Extension을 하나의 프로젝트에서 관리할 수 있다.

대략적인 구조를 살펴보면 다음과 같다.

```text id="18oufq"
shopify-app
│
├── app
│   └── App UI / Logic
│
├── extensions
│   ├── extension-a
│   └── extension-b
│
├── shopify.app.toml
│
├── package.json
│
└── ...
```

실제 디렉터리 구조는 사용하는 App Template이나 Extension 종류에 따라 달라질 수 있지만, 기본적으로 <mark>하나의 App 프로젝트 안에서 App 본체와 여러 Extension을 함께 개발하고 관리할 수 있는 구조</mark>라고 이해하면 된다.

Shopify CLI는 이러한 구조를 기반으로 App과 Extension을 생성하고, 개발 환경을 실행하며 배포하는 역할을 담당한다.

## Global Install과 Local Dependency

Shopify CLI는 컴퓨터에 전역으로 설치하거나 특정 프로젝트의 로컬 의존성으로 설치하여 사용할 수 있다.

### Global Install

Global Install은 Shopify CLI를 컴퓨터 전체에서 사용할 수 있도록 설치하는 방식이다.

전역으로 설치하면 어떤 Shopify 프로젝트에서도 `shopify` 명령어를 직접 사용할 수 있으며, 하나의 설치 지점에서 CLI를 관리하고 업데이트할 수 있다.

Shopify에서는 현재 Global Install 방식을 기본적으로 권장하고 있다.

### Local Dependency

Local Dependency는 Shopify CLI를 특정 프로젝트의 `devDependencies`에 설치하는 방식이다.

이 방식은 프로젝트마다 Shopify CLI의 버전을 별도로 관리할 수 있기 때문에 여러 개발자가 협업할 때 동일한 CLI 버전을 사용하거나, 프로젝트별로 서로 다른 버전의 CLI가 필요한 경우 유용하다.

| 구분     | Global Install    | Local Dependency       |
| ------ | ----------------- | ---------------------- |
| 설치 위치  | 개발 환경 전체          | 특정 프로젝트                |
| CLI 관리 | 한 곳에서 관리          | 프로젝트별 관리               |
| 버전     | 여러 프로젝트가 공통 버전 사용 | 프로젝트별 버전 지정 가능         |
| 장점     | 설치와 업데이트가 간단함     | 팀 단위 버전 통일 및 재현성       |
| 적합한 경우 | 개인 개발, 일반적인 개발 환경 | CLI 버전을 엄격하게 관리하는 프로젝트 |

결국 <mark>Global Install은 Shopify CLI를 개발 환경의 공통 도구로 사용하는 방식이고, Local Dependency는 프로젝트의 개발 의존성으로 관리하는 방식</mark>이라고 이해할 수 있다.

## 프론트엔드 관점에서 이해하기

기존 프론트엔드 개발 경험과 비교하면 Shopify CLI의 주요 명령어는 다음과 같이 이해할 수 있다.

| Shopify CLI                      | 프론트엔드 관점                        |
| -------------------------------- | ------------------------------- |
| `shopify app init`               | 프로젝트 생성                         |
| `shopify app dev`                | Dev Server + Shopify 개발 환경 연결   |
| `shopify app generate extension` | Shopify용 확장 모듈 생성               |
| `shopify app deploy`             | App 설정 및 Extension을 Shopify에 배포 |

일반적인 프론트엔드 CLI가 프로젝트 생성과 로컬 개발 환경 실행에 집중한다면, Shopify CLI는 여기에 Shopify 플랫폼과의 연결과 Extension 관리 및 배포까지 포함한다는 차이가 있다.

결국 Shopify CLI는 <mark>Shopify App 프로젝트 생성기 + 로컬 개발 환경 + Extension 생성 도구 + Shopify 플랫폼 배포 도구</mark>라고 이해할 수 있다.

### 요약

* **Shopify CLI:** Shopify App, Theme 등을 개발하기 위한 공식 커맨드라인 도구
* **`shopify app init`:** 새로운 App 프로젝트 생성 및 초기화
* **`shopify app dev`:** 로컬 개발 환경 실행 및 Dev Store 연결
* **Dev Store:** App과 Theme을 테스트하기 위한 개발용 Store
* **Tunnel:** Shopify 환경에서 로컬 App에 접근할 수 있도록 연결하는 통로
* **`shopify app generate extension`:** App에 새로운 Extension 생성
* **`shopify app deploy`:** App Configuration과 Extension을 Shopify에 배포
* **Global Install:** Shopify CLI를 개발 환경 전체에서 공통으로 사용
* **Local Dependency:** Shopify CLI를 프로젝트별 의존성으로 관리

---

## 참고

* [Shopify CLI for Apps](https://shopify.dev/docs/apps/build/cli-for-apps)
* [Shopify CLI](https://shopify.dev/docs/api/shopify-cli)
* [Shopify App Structure](https://shopify.dev/docs/apps/build/cli-for-apps/app-structure)
