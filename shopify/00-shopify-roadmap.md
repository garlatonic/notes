# Shopify 로드맵

입사 예정인 회사에서는 글로벌 이커머스 플랫폼 구축에 Shopify를 활용한다.

그동안 카페24와 NHN Shopby 기반 프로젝트는 경험해봤지만, Shopify는 처음 접하는 플랫폼이라 입사 전 기본적인 구조와 개발 흐름 정도는 익혀두는 것이 좋겠다고 생각했다.

처음에는 Shopify 개발자 문서를 처음부터 읽어보려고 했지만, CLI나 API처럼 특정 기능을 설명하는 문서가 많아 전체적인 구조를 이해하지 못한 상태에서는 오히려 내용이 잘 들어오지 않았다.
그래서 **'Shopify가 어떤 플랫폼인지'를 먼저 이해한 뒤, 필요한 기능을 순서대로 학습하는 방식**으로 공부를 진행하기로 했다.

7월 20일이 입사일이므로, 일주일의 기간동안 학습해보고자 한다. 학습 내용은 아래와 같이 구성했다.

| Day   | 주제          | 학습 내용                                                        | 목표                                             |
| ----- | ------------- | ---------------------------------------------------------------- | ------------------------------------------------ |
| Day 1 | Shopify 이해  | Shopify란 무엇인가, Store / Admin / Theme / App / Extension 관계 | Shopify의 전체 구조를 설명할 수 있다.            |
| Day 2 | Theme         | Online Store, Liquid, Theme 구조, Sections, Blocks               | Shopify 테마가 어떻게 구성되는지 이해한다.       |
| Day 3 | App           | Shopify App, Partner Dashboard, Dev Store, App 설치 방식         | Theme와 App의 차이를 설명할 수 있다.             |
| Day 4 | Shopify CLI   | Shopify CLI, 프로젝트 생성, `app init`, `app dev`, `app deploy`  | CLI의 역할을 이해하고 프로젝트를 생성해본다.     |
| Day 5 | API           | Admin API, Storefront API, GraphQL 기초                          | 어떤 데이터를 어디서 가져오는지 이해한다.        |
| Day 6 | App Extension | Theme App Extension, Checkout UI Extension, Admin Extension      | Extension이 왜 필요한지 이해한다.                |
| Day 7 | 실습 및 복습  | 샘플 프로젝트 실행, 디렉터리 구조 분석, 전체 흐름 복습           | 프로젝트 구조를 읽고 개발 흐름을 설명할 수 있다. |

## 학습 목표

- Shopify의 전체 구조를 이해한다.
- Theme와 App의 차이를 설명할 수 있다.
- 회사 프로젝트를 보았을 때 디렉터리 구조와 개발 흐름을 이해할 수 있다.

## 학습 순서

```text
Shopify
├── Store
├── Admin
├── Theme
├── App
├── Shopify CLI
├── API (GraphQL)
├── App Extension
└── Deployment
```

## 최종 목표

- Shopify의 전체 구조를 이해한다.
- Theme와 App의 차이를 설명할 수 있다.
- Shopify CLI를 이용해 프로젝트를 생성하고 실행할 수 있다.
- GraphQL 기반 Admin API가 어떤 역할을 하는지 이해한다.
- 회사 프로젝트를 처음 받아도 구조를 파악하고 개발 흐름을 이해할 수 있다.
