# Shopify API 이해하기

로드맵 5일차의 학습 목표는 **Shopify에서 API가 어떤 역할을 하는지 이해하고, Admin API와 Storefront API의 차이와 Shopify에서 사용하는 GraphQL의 기본적인 개념을 파악하는 것**에 중점을 두려고 한다.

앞서 Theme은 Storefront의 UI를 구성하고, App은 Shopify의 기능을 확장하며, Extension은 App의 기능을 Shopify의 특정 영역에 연결한다고 정리했다. 그렇다면 이렇게 만들어진 화면과 기능에서 상품, 주문, 고객과 같은 실제 Shopify 데이터가 필요한 경우에는 어떻게 해야 할까?

이때 Shopify가 가지고 있는 데이터와 기능에 접근하기 위해 API를 사용한다.

## Shopify에서 API가 필요한 이유

Shopify는 상품, 컬렉션, 고객, 장바구니, 주문, 재고 등 커머스 운영에 필요한 다양한 데이터를 가지고 있다. App이나 Custom Storefront에서 이러한 데이터를 읽거나 변경하려면 Shopify가 제공하는 API를 사용해야 한다.

예를 들어 다음과 같은 상황에서 API가 필요하다.

* 상품 및 컬렉션 데이터 조회
* 상품 및 재고 정보 수정
* 주문 및 고객 정보 조회
* 외부 ERP, CRM 등의 서비스와 데이터 연동
* Custom Storefront에서 상품 및 장바구니 데이터 사용
* App에서 Shopify의 데이터 관리

즉, <mark>Shopify API는 Shopify 외부에서 Shopify의 데이터와 기능에 접근하고 상호작용할 수 있도록 제공하는 통로</mark>라고 이해할 수 있다.

Shopify에서는 목적에 따라 다양한 API를 제공하지만, 처음 Shopify를 공부하는 단계에서는 **Admin API**와 **Storefront API**의 차이를 이해하는 것이 가장 중요하다.

## Admin API

Admin API는 <mark>Shopify Store의 운영 및 관리에 필요한 데이터를 읽고 변경하기 위한 API</mark>이다.

예를 들어 다음과 같은 작업에 사용할 수 있다.

* 상품 생성 및 수정
* 주문 조회 및 관리
* 고객 데이터 조회
* 재고 관리
* Metafield 읽기 및 쓰기
* 외부 시스템과 Shopify 데이터 연동

주로 Shopify App이나 외부 시스템에서 Store의 운영 데이터를 관리할 때 사용한다.

예를 들어 ERP 시스템과 Shopify의 상품 및 주문 데이터를 동기화해야 한다면 Admin API를 이용해 Shopify의 데이터를 읽거나 변경할 수 있다.

즉, Admin API는 쉽게 말해 **Store를 운영하고 관리하기 위한 API**라고 이해할 수 있다.

## Storefront API

Storefront API는 <mark>Customer를 위한 Custom Shopping Experience를 구축할 때 사용하는 API</mark>이다.

예를 들어 다음과 같은 데이터를 가져오거나 기능을 구현할 때 사용할 수 있다.

* 상품 조회
* 컬렉션 조회
* 상품 가격 및 옵션 조회
* 장바구니 생성 및 변경
* 구매 과정에 필요한 Storefront 데이터 처리

일반적인 Shopify Theme 대신 React, Next.js, Hydrogen 등을 이용해 별도의 Storefront를 구축하는 Headless Commerce 환경에서도 Storefront API를 사용할 수 있다.

```text
Shopify
    │
    ├── Admin API
    │      └── Store 운영 및 관리
    │
    └── Storefront API
           └── Customer의 Shopping Experience
```

간단하게 구분하면 <mark>Admin API는 Store의 운영과 관리를 위한 API이고, Storefront API는 Customer가 이용하는 쇼핑 경험을 만들기 위한 API</mark>라고 이해할 수 있다.

| 구분     | Admin API            | Storefront API             |
| ------ | -------------------- | -------------------------- |
| 주요 목적  | Store 운영 및 관리        | Shopping Experience 구축     |
| 주요 사용자 | App, 관리자 시스템, 외부 서비스 | Custom Storefront, 모바일 앱 등 |
| 주요 데이터 | 상품, 주문, 고객, 재고 등     | 상품, 컬렉션, 장바구니 등            |
| 주요 관점  | Merchant             | Customer                   |

## GraphQL이란?

Shopify API를 공부하다 보면 **GraphQL**이라는 개념을 자주 접하게 된다.

나는 지금까지 REST API를 주로 사용했기 때문에 GraphQL이 생소했는데, 두 방식의 가장 큰 차이는 **데이터를 요청하는 방식**에 있다.

REST API에서는 일반적으로 리소스에 따라 서로 다른 Endpoint를 사용한다.

```text
GET /products
GET /products/1
GET /collections
GET /orders/100
```

필요한 데이터에 따라 정해진 Endpoint로 요청하고 서버가 정의한 형태의 데이터를 응답받는다.

반면 GraphQL에서는 일반적으로 하나의 Endpoint를 사용하고, <mark>클라이언트가 필요한 데이터의 구조와 필드를 직접 지정하여 요청한다.</mark>

예를 들어 상품의 모든 정보가 아니라 상품명과 설명만 필요하다면 다음과 같은 형태로 요청할 수 있다.

```graphql
query {
  productByHandle(handle: "sample-product") {
    title
    description
  }
}
```

응답 역시 요청한 데이터에 맞는 형태로 받을 수 있다.

```json
{
  "data": {
    "productByHandle": {
      "title": "Sample Product",
      "description": "상품 설명"
    }
  }
}
```

즉, 상품 데이터 중 `title`과 `description`을 요청했기 때문에 필요한 두 가지 데이터만 응답받는 것이다.

REST API와 비교하면 다음과 같이 이해할 수 있다.

| REST API              | GraphQL                   |
| --------------------- | ------------------------- |
| 리소스별로 여러 Endpoint 사용  | 일반적으로 하나의 Endpoint 사용     |
| 서버가 응답 데이터 구조를 정의     | 클라이언트가 필요한 필드를 지정         |
| Endpoint를 기준으로 데이터 요청 | 필요한 데이터 구조를 기준으로 요청       |
| 상황에 따라 여러 번 요청할 수 있음  | 연관된 데이터를 하나의 요청으로 가져오기 용이 |

프론트엔드 개발자의 관점에서 REST API를 사용할 때는 <mark>"어떤 Endpoint를 호출해야 하지?"</mark>를 먼저 생각했다면, GraphQL에서는 <mark>"이 화면을 구성하기 위해 어떤 데이터가 필요하지?"</mark>를 먼저 생각한다고 이해할 수 있다.

## Query와 Mutation

GraphQL에서 가장 먼저 알아야 하는 개념은 **Query**와 **Mutation**이다.

### Query

Query는 데이터를 **조회**할 때 사용한다.

예를 들어 다음과 같은 작업이 Query에 해당한다.

* 상품 목록 조회
* 상품 상세 조회
* 컬렉션 조회
* 주문 정보 조회

REST API의 `GET`과 비슷한 개념으로 이해할 수 있다.

### Mutation

Mutation은 데이터를 **생성하거나 변경 또는 삭제**할 때 사용한다.

예를 들어 다음과 같은 작업이 Mutation에 해당한다.

* 상품 생성
* 상품 정보 수정
* Metafield 수정
* 장바구니 변경

REST API의 `POST`, `PUT`, `PATCH`, `DELETE`와 비슷한 역할이라고 이해할 수 있다.

따라서 처음 GraphQL을 접하는 단계에서는 <mark>Query는 데이터를 읽는 요청, Mutation은 데이터를 변경하는 요청</mark>이라고 기억하면 된다.

```text
GraphQL
    │
    ├── Query
    │     └── 데이터 조회
    │
    └── Mutation
          └── 데이터 변경
```

## Shopify에서 GraphQL 사용하기

Shopify의 API를 사용할 때는 GraphQL Query나 Mutation을 작성하여 필요한 데이터를 요청할 수 있다.

예를 들어 Storefront에서 상품 데이터를 가져온다고 가정하면 다음과 같은 흐름으로 이해할 수 있다.

```text
Storefront UI
     │
     │ 상품 데이터 요청
     ▼
Storefront API
     │
     │ GraphQL Query
     ▼
Shopify
     │
     │ 상품 데이터 응답
     ▼
Storefront UI
```

프론트엔드 개발자는 화면을 구성하기 위해 필요한 데이터를 먼저 파악하고, GraphQL Query를 통해 해당 필드만 요청하여 UI에 사용할 수 있다.

따라서 Shopify에서 GraphQL을 처음 공부할 때는 복잡한 문법을 외우기보다 <mark>필요한 데이터를 Query로 요청하고, 데이터를 변경해야 할 때 Mutation을 사용한다는 기본적인 흐름</mark>을 먼저 이해하는 것이 중요하다.

## API 사용 시 알아야 할 것

Shopify API를 사용할 때는 어떤 API를 사용할 것인지뿐만 아니라 **인증과 API Version**도 고려해야 한다.

### 인증

Shopify의 데이터에 누구나 자유롭게 접근할 수 있는 것은 아니기 때문에 API를 호출할 때는 요청을 보내는 주체와 권한을 확인하기 위한 인증 과정이 필요하다.

API의 종류와 사용 환경에 따라 필요한 Access Token과 권한이 달라질 수 있으며, 특히 프론트엔드 개발자는 <mark>브라우저에 노출해도 되는 공개 정보와 서버에서만 관리해야 하는 비밀 정보를 구분하는 것이 중요하다.</mark>

### API Version

Shopify API는 Version을 기반으로 관리된다.

따라서 프로젝트에서 어떤 API Version을 사용하고 있는지 확인하고, 해당 Version에서 지원되는 API와 기능을 사용하는 것이 중요하다.

실제 프로젝트에 참여할 때는 새로운 Version이 출시되었다고 바로 변경하기보다 현재 프로젝트에서 사용하는 Version과 변경 사항을 확인하고 업데이트해야 한다.

## Theme, App, Extension과 API의 관계

지금까지 학습한 Shopify의 구조에 API를 추가하면 전체적인 관계를 조금 더 명확하게 이해할 수 있다.

### Theme

Theme은 Customer가 이용하는 Storefront의 기본 UI와 페이지 구조를 담당한다. Shopify가 제공하는 데이터를 Liquid를 통해 화면에 렌더링하며, Custom Storefront와 같이 별도의 프론트엔드를 구축하는 경우에는 Storefront API를 이용해 Shopify의 데이터를 가져올 수 있다.

### App

App은 Shopify의 기능을 확장하거나 외부 서비스와 연동한다. 상품, 주문, 고객 등 Shopify의 운영 데이터를 읽거나 변경해야 하는 경우 Admin API를 사용할 수 있다.

### Extension

Extension은 App의 기능을 Shopify의 특정 Surface에 연결한다. Extension에서 Shopify 데이터가 필요하거나 특정 동작을 처리해야 하는 경우 해당 Extension의 환경에서 제공되는 API나 App의 로직과 연결하여 기능을 구현할 수 있다.

전체적인 구조를 단순하게 정리하면 다음과 같다.

```text
Shopify
   │
   ├── Theme
   │     └── Storefront UI
   │
   ├── App
   │     └── 기능 / 비즈니스 로직
   │
   ├── Extension
   │     └── Shopify Surface에 App 기능 연결
   │
   └── API
         └── Shopify 데이터와 기능에 접근
```

결국 <mark>API는 Theme, App, Extension 등의 기능이 실제 Shopify 데이터와 상호작용할 수 있도록 연결하는 데이터 통로</mark>라고 이해할 수 있다.

프론트엔드 개발자로 Shopify 프로젝트에 참여한다면 API를 사용할 때 먼저 다음과 같은 질문을 생각해볼 수 있다.

* 이 기능은 Merchant와 Customer 중 누구를 위한 기능인가?
* Store 운영 데이터를 다루는가, Customer의 Shopping Experience를 위한 데이터를 다루는가?
* 데이터를 조회하는가, 변경하는가?
* Admin API와 Storefront API 중 어떤 API가 필요한가?
* GraphQL Query와 Mutation 중 어떤 작업이 필요한가?

이러한 기준을 통해 어떤 API를 어떤 방식으로 사용해야 하는지 판단할 수 있다.

### 요약

* **Shopify API:** Shopify의 데이터와 기능에 접근하기 위한 통로
* **Admin API:** Store의 운영 및 관리 데이터를 읽고 변경하기 위한 API
* **Storefront API:** Customer를 위한 Custom Shopping Experience를 구축하기 위한 API
* **GraphQL:** 클라이언트가 필요한 데이터의 구조와 필드를 직접 지정하여 요청하는 API Query Language
* **Query:** 데이터를 조회하는 요청
* **Mutation:** 데이터를 생성하거나 변경 또는 삭제하는 요청
* **Access Token:** API를 사용하는 주체와 권한을 확인하기 위한 인증 수단
* **API Version:** Shopify API의 기능과 변경 사항을 관리하는 Version

---

## 참고

* [Shopify API](https://shopify.dev/docs/api)
* [GraphQL Admin API](https://shopify.dev/docs/api/admin-graphql)
* [Storefront API](https://shopify.dev/docs/api/storefront)
