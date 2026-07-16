# Shopify App 이해하기

로드맵 3일차의 학습 목표는 Shopify의 **App이 어떤 역할을 하는지 이해하고, Theme과 App의 차이와 App Extension의 관계를 파악하는 것**에 중점을 두려고 한다.

앞서 Theme은 고객이 보는 Storefront의 UI와 레이아웃을 구성한다고 정리했다. 하지만 실제 커머스를 운영하다 보면 Shopify가 기본적으로 제공하는 기능만으로 해결하기 어려운 요구사항이 생길 수 있다. 이때 Shopify의 기능을 확장하거나 외부 서비스와 연결하기 위해 App을 사용할 수 있다.

## App이란?

Shopify App은 <mark>Shopify의 기본 기능을 확장하거나 외부 서비스와 연동하기 위한 애플리케이션</mark>이다.

예를 들어 리뷰, 멤버십, 구독과 같은 새로운 기능을 추가하거나 ERP, CRM, WMS와 같은 외부 시스템을 Shopify와 연결할 수 있다. 또한 Shopify Admin에 새로운 관리 기능을 추가하거나 Online Store, Checkout, POS 등 Shopify의 다양한 영역에 새로운 기능을 제공할 수도 있다.

대표적으로 다음과 같은 기능을 App으로 구현할 수 있다.

- 상품 리뷰 및 별점
- 멤버십 및 적립금
- 구독 서비스
- ERP / CRM 연동
- WMS / OMS 연동
- 마케팅 자동화
- 재고 및 주문 관리
- 관리자용 대시보드
- Storefront 위젯

즉, <mark>Theme이 Storefront의 화면과 콘텐츠 구조를 담당한다면, App은 Shopify의 기능과 비즈니스 로직을 확장하는 역할을 담당한다.</mark>

## Theme과 App의 차이

Theme과 App 모두 프론트엔드 코드가 포함될 수 있지만 각각 담당하는 역할에는 차이가 있다.

Theme은 고객이 방문하는 Online Store의 레이아웃과 스타일, 페이지 구조를 담당한다. Liquid를 기반으로 Template, Section, Block을 구성하며 Merchant가 Theme Editor를 통해 Storefront를 관리할 수 있도록 한다.

반면 App은 Shopify가 기본적으로 제공하지 않는 기능을 추가하거나 외부 시스템과 연동하기 위해 사용한다. 필요에 따라 Shopify Admin뿐만 아니라 Online Store, Checkout, POS 등 다양한 영역에 기능을 제공할 수 있다.

| 구분      | Theme                     | App                                        |
| --------- | ------------------------- | ------------------------------------------ |
| 주요 역할 | Storefront UI 구성        | Shopify 기능 확장                          |
| 주요 대상 | Customer                  | Merchant 또는 Customer                     |
| 주요 영역 | Online Store              | Admin, Online Store, Checkout, POS 등      |
| 주요 작업 | UI, 레이아웃, 페이지 구성 | 비즈니스 로직, 외부 서비스 연동, 추가 기능 |
| 개발 관점 | 쇼핑몰 프론트엔드 개발    | Shopify 플랫폼 위의 제품 및 서비스 개발    |

간단하게 구분하면 <mark>스토어의 화면과 콘텐츠 구조에 관한 문제라면 Theme, Shopify의 기능이나 외부 시스템과의 연동에 관한 문제라면 App</mark>에 가깝다고 이해할 수 있다.

예를 들어 상품 상세 페이지의 레이아웃을 변경하거나 브랜드에 맞게 디자인을 수정하는 작업은 Theme에서 처리할 수 있다. 반면 ERP와 주문 데이터를 연동하거나 리뷰 시스템을 구축하는 작업은 App을 통해 구현할 수 있다.

## App Surface

Shopify에서 **Surface**는 App의 기능이 사용자에게 노출되고 동작하는 Shopify의 영역을 의미한다.

대표적인 Surface는 다음과 같다.

- Shopify Admin
- Online Store
- Checkout
- POS

하나의 App이 반드시 하나의 Surface에서만 동작하는 것은 아니다. <mark>하나의 App이 여러 Surface에 동시에 기능을 제공할 수도 있다.</mark>

예를 들어 상품 리뷰 App을 만든다면 Shopify Admin에서는 Merchant가 리뷰를 관리할 수 있는 화면을 제공하고, Online Store에서는 Customer가 상품의 리뷰와 별점을 확인할 수 있도록 만들 수 있다.

<figure align="center" class="excalidraw-figure">
  <img
    src="https://garlatonic.github.io/notes/assets/image/shopify-app-01.png"
    width="350"
    alt="Shopify App Surface"
  />
</figure>

Merchant 입장에서는 하나의 App이지만, App이 제공하는 기능은 목적에 따라 Shopify의 여러 영역에 나뉘어 나타날 수 있다.

## App Extension

App과 Extension은 서로 같은 개념이 아니다.

<mark>App이 하나의 제품 또는 애플리케이션이라면, Extension은 App의 기능을 Shopify의 특정 영역에 연결하는 확장 방식이다.</mark>

예를 들어 리뷰 App이 있다고 가정하면 App 자체에서는 리뷰 데이터를 저장하고 관리하는 기능을 제공할 수 있다. 그리고 Extension을 통해 상품 페이지에 리뷰를 표시하거나 Shopify Admin에 리뷰 관리 기능을 추가할 수 있다.

<figure align="center" class="excalidraw-figure">
  <img
    src="https://garlatonic.github.io/notes/assets/image/shopify-app-02.png"
    width="340"
    alt="Shopify App Extension"
  />
</figure>

따라서 Extension은 App 자체가 아니라, <mark>App의 기능이 Shopify 내부의 특정 위치에서 동작할 수 있도록 연결하는 역할</mark>을 한다.

## Theme App Extension

Theme App Extension은 Theme과 App이 만나는 지점이라고 볼 수 있다.

App이 Online Store에 새로운 기능을 제공해야 하는 경우 Theme 코드를 직접 수정하는 대신 **Theme App Extension**을 사용할 수 있다.

예를 들어 다음과 같은 기능을 Online Store에 추가할 수 있다.

- 상품 리뷰
- 상품 별점
- 채팅 위젯
- 배너 및 배지
- 추가 상품 정보

과거에는 App이 Theme 코드를 직접 수정하여 기능을 추가하는 경우가 있었지만, 이러한 방식은 App을 삭제한 이후에도 코드가 남거나 Theme 변경 시 기능이 정상적으로 동작하지 않는 등의 문제가 발생할 수 있다.

Theme App Extension을 사용하면 <mark>Theme 코드를 직접 수정하지 않고 App의 기능을 Theme에 연결할 수 있으며, Merchant가 Theme Editor를 통해 App의 UI를 배치하고 설정할 수 있다.</mark>

Theme App Extension에서는 대표적으로 **App Block**과 **App Embed Block**을 사용할 수 있다.

### App Block

App Block은 Merchant가 Theme Editor를 통해 페이지의 특정 위치에 배치할 수 있는 UI 요소이다.

예를 들어 상품 상세 페이지에 리뷰 App의 별점이나 리뷰 목록을 추가하는 경우 App Block을 사용할 수 있다.

### App Embed Block

App Embed Block은 페이지의 특정 콘텐츠 위치보다는 Theme 전반에서 동작해야 하는 기능을 제공할 때 사용할 수 있다.

예를 들어 채팅 위젯이나 분석 스크립트처럼 Store 전반에서 필요한 기능에 활용할 수 있다.

간단하게 이해하면 **App Block은 페이지 레이아웃에 배치하는 UI**, **App Embed Block은 Theme 전반에서 동작하는 기능**에 가깝다.

## 프론트엔드 관점에서 이해하기

React나 Next.js 기반의 일반적인 프론트엔드 개발과 정확하게 동일하지는 않지만, 역할을 기준으로 비교하면 다음과 같이 이해할 수 있다.

| Shopify             | 프론트엔드 관점                               |
| ------------------- | --------------------------------------------- |
| Theme               | 고객이 사용하는 Storefront 프론트엔드         |
| App                 | Shopify 플랫폼의 기능을 확장하는 애플리케이션 |
| Surface             | App의 기능이 나타나는 영역                    |
| Extension           | App의 기능을 특정 영역에 연결하는 확장 방식   |
| Theme App Extension | App의 기능을 Storefront Theme에 연결하는 방식 |
| App Block           | Theme Editor에서 배치할 수 있는 App UI        |
| App Embed Block     | Theme 전반에서 동작하는 App 기능              |

Theme 개발에서는 Liquid를 중심으로 Template, Section, Block을 설계하고 Merchant가 Theme Editor에서 Storefront를 편집할 수 있도록 만드는 것이 중요하다.

반면 App 개발에서는 App이 제공할 기능과 비즈니스 로직을 구현하고, 필요한 경우 API를 통해 Shopify 또는 외부 서비스와 데이터를 주고받는다. 그리고 App의 기능을 Shopify 내부에 노출해야 한다면 목적에 맞는 Extension을 사용할 수 있다.

결국 <mark>Theme은 Store를 만들고, App은 Shopify의 기능을 확장하며, Extension은 App의 기능을 Shopify 안에 연결한다.</mark>

### 요약

- **Theme:** 고객이 이용하는 Storefront의 UI와 페이지 구조를 담당
- **App:** Shopify의 기본 기능을 확장하거나 외부 서비스와 연동하는 애플리케이션
- **Surface:** App의 기능이 노출되고 동작하는 Shopify의 영역
- **Extension:** App의 기능을 Shopify의 특정 영역에 연결하는 확장 방식
- **Theme App Extension:** App의 기능을 Theme에 연결하는 Extension
- **App Block:** Theme Editor에서 페이지의 특정 위치에 배치할 수 있는 App UI
- **App Embed Block:** Theme 전반에서 동작하는 App 기능

---

## 참고

- [Shopify Apps](https://shopify.dev/docs/apps)
- [App Surfaces](https://shopify.dev/docs/apps/build/app-surfaces)
- [App Extensions](https://shopify.dev/docs/apps/build/app-extensions)
- [Theme App Extensions](https://shopify.dev/docs/apps/build/online-store/theme-app-extensions)
