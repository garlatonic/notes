# Shopify Theme 이해하기

로드맵 2일차의 학습 목표는 Shopify의 **Theme이 어떤 역할을 하는지 이해하고, Theme을 구성하는 기본적인 구조를 파악하는 것**에 중점을 두려고 한다.

1일차에 Shopify의 전체적인 구조를 살펴보면서 Theme은 고객이 보는 온라인 스토어의 화면(UI)을 담당한다고 간단하게 정리했다. 이번에는 여기서 조금 더 나아가 Theme이 어떤 구조로 Store의 화면을 구성하고, 개발자와 Merchant가 각각 어떤 방식으로 Theme을 다루는지 알아보려고 한다.

## Theme이란?

Shopify에서 Theme은 단순히 Store의 디자인을 변경하는 스킨이 아니라, <mark>온라인 스토어(Storefront)의 레이아웃, UI 구성, 기능의 노출 방식과 스타일을 결정하는 프론트엔드 레이어</mark>이다. 상품 목록, 상품 상세 페이지, 장바구니, 블로그 등 고객이 온라인 스토어에서 접하는 대부분의 화면이 Theme을 통해 구성된다.

카페24의 스킨과 비슷한 개념이지만, Shopify Theme은 Merchant가 코드를 직접 수정하지 않고도 **Theme Editor**를 통해 페이지의 Section과 Block을 추가하거나 제거하고, 순서를 변경할 수 있도록 설계되어 있다는 특징이 있다. 즉, Shopify Theme을 개발할 때는 단순히 고객에게 보이는 화면을 구현하는 것뿐만 아니라, <mark>Merchant가 직접 콘텐츠와 화면 구성을 관리할 수 있는 구조까지 함께 고려해야 한다.</mark>

## Theme의 구조

Shopify Theme은 정해진 디렉터리 구조를 가지며, 각 디렉터리와 파일이 서로 다른 역할을 담당한다.

* Layout
* Template
* Section
* Block
* Snippet
* Assets
* Config
* Locales

이 중 페이지의 UI 구조를 이해하는 데 가장 중요한 것은 <mark>**Template → Section → Block**의 관계</mark>이다.

<figure align="center" class="excalidraw-figure">
  <img
    src="https://garlatonic.github.io/notes/assets/image/shopify-theme-01.png"
    width="250"
    alt="Shopify Theme Structure"
  />
</figure>

Template이 페이지의 전체적인 구성을 정의하고, 여러 개의 Section이 페이지를 구성한다. Section 내부에는 필요에 따라 더 작은 단위인 Block을 배치할 수 있다.

### Layout

Layout은 Theme의 **전체적인 페이지 구조**를 담당한다. 페이지마다 공통으로 필요한 HTML 구조를 정의하며, 일반적으로 `theme.liquid` 파일이 기본 Layout 역할을 한다. 프론트엔드 개발 관점에서는 애플리케이션의 공통 Layout과 비슷한 역할을 한다고 이해할 수 있다.

### Template

Template은 **페이지 타입별 구조**를 정의한다. 상품 상세 페이지, 컬렉션 페이지, 일반 페이지, 블로그, 장바구니 등 각각의 페이지에서 어떤 Section을 어떤 순서로 보여줄 것인지를 Template을 통해 구성할 수 있다.

Shopify의 Online Store 2.0에서는 <mark>JSON Template을 사용하여 페이지를 여러 Section의 조합으로 구성할 수 있다.</mark>

### Section

Section은 페이지를 구성하는 **큰 UI 모듈 단위**이다. Header, Hero Banner, Featured Collection, Product Information, FAQ, Footer 등이 하나의 Section이 될 수 있다.

개발자는 Section을 독립적인 모듈 형태로 개발하고, Merchant는 Theme Editor를 통해 필요한 Section을 페이지에 추가하거나 제거하고 순서를 변경할 수 있다. 따라서 Shopify Theme을 개발할 때는 화면을 고정된 형태로 구현하기보다, <mark>Merchant가 필요에 따라 조합할 수 있도록 Section을 적절한 단위로 분리하는 것이 중요하다.</mark>

### Block

Block은 Section 내부를 구성하는 **더 작은 단위의 콘텐츠 또는 UI 요소**이다. 예를 들어 상품 정보를 보여주는 `Product Information` Section이 있다면 상품명, 가격, 상품 설명, 구매 버튼, 재고 정보 등을 각각의 Block으로 구성할 수 있다.

Merchant는 Theme Editor에서 Block의 순서를 변경하거나 필요한 Block을 추가하고 제거할 수 있다. 프론트엔드 개발 관점에서 Section이 큰 UI 컴포넌트라면, Block은 그 내부를 구성하는 작은 컴포넌트와 비슷한 개념으로 이해할 수 있다.

### Snippet

Snippet은 Theme 내부에서 반복적으로 사용되는 **재사용 가능한 Liquid 코드 조각**이다. 여러 Section이나 Template에서 동일한 UI 또는 로직이 필요한 경우 Snippet으로 분리하여 재사용할 수 있다.

React에서 공통으로 사용되는 작은 컴포넌트를 분리하는 것과 비슷한 목적으로 사용된다고 이해할 수 있다.

### Assets

Assets는 Theme에서 사용하는 **CSS, JavaScript, 이미지 등의 정적 리소스**를 관리한다. Theme의 스타일을 정의하거나 슬라이더, 드로어, 상품 옵션 선택과 같은 사용자 인터랙션을 구현하는 JavaScript 파일 등이 포함될 수 있다.

### Config

Config는 Theme의 **설정 정보를 관리**한다. 개발자가 설정 가능한 항목을 정의하면 Merchant가 Theme Editor를 통해 색상, 폰트 등 Theme의 전반적인 설정을 변경할 수 있다.

이를 통해 Merchant는 직접 코드를 수정하지 않고도 Store의 디자인과 일부 설정을 변경할 수 있다.

### Locales

Locales는 Theme에서 사용하는 **다국어 번역 데이터**를 관리한다. Shopify는 글로벌 커머스를 지원하는 플랫폼이기 때문에 Theme에서 사용되는 텍스트를 언어별로 관리할 수 있도록 별도의 번역 파일 구조를 제공한다.

## Liquid란?

Shopify Theme은 **Liquid**라는 템플릿 언어를 사용한다. <mark>Shopify가 가지고 있는 상품, 컬렉션, 장바구니 등의 데이터를 Liquid를 통해 가져와 HTML로 렌더링할 수 있다.</mark>

예를 들어 상품의 제목을 출력하려면 다음과 같이 작성할 수 있다.

```liquid
<h1>{{ product.title }}</h1>
```

Liquid에서는 크게 두 가지 형태의 문법을 자주 사용한다.

```liquid
{{ product.title }}
```

`{{ }}`는 데이터를 화면에 출력할 때 사용한다.

```liquid
{% if product.available %}
  <p>구매 가능한 상품입니다.</p>
{% endif %}
```

`{% %}`는 조건문이나 반복문과 같은 로직을 작성할 때 사용한다.

따라서 Shopify Theme 개발자는 <mark>HTML, CSS, JavaScript뿐만 아니라 Liquid를 사용하여 Shopify의 데이터를 화면에 연결하는 작업</mark>도 수행하게 된다.

## Online Store 2.0

Online Store 2.0은 Shopify Theme을 보다 유연하고 모듈화된 형태로 구성할 수 있도록 만든 Theme 아키텍처이다. 대표적인 특징 중 하나는 <mark>JSON Template과 Section을 기반으로 페이지를 구성할 수 있다는 점</mark>이다.

개발자가 재사용 가능한 Section과 Block을 만들면 Merchant가 Theme Editor에서 이를 조합하여 페이지를 구성할 수 있다.

<figure align="center" class="excalidraw-figure">
  <img
    src="https://garlatonic.github.io/notes/assets/image/shopify-theme-02.png"
    width="270"
    alt="Shopify Online Store 2.0 Structure"
  />
</figure>

따라서 Shopify Theme 개발에서는 고객이 보는 화면뿐만 아니라 <mark>Merchant가 Store를 얼마나 쉽게 운영하고 수정할 수 있는지도 중요한 요소</mark>가 된다.

## 프론트엔드 관점에서 이해하기

React나 Next.js와 정확하게 동일한 개념은 아니지만, 기존 프론트엔드 개발 경험을 기준으로 비교하면 다음과 같이 이해할 수 있다.

| Shopify Theme | 프론트엔드 관점                       |
| ------------- | ------------------------------ |
| Theme         | Storefront 프론트엔드               |
| Layout        | 공통 페이지 Layout                  |
| Template      | 페이지 타입별 구조                     |
| Section       | 페이지를 구성하는 큰 UI 모듈              |
| Block         | Section 내부의 작은 구성 단위           |
| Snippet       | 재사용 가능한 마크업 및 코드 조각            |
| Liquid        | 서버 템플릿 및 데이터 바인딩               |
| Assets        | CSS, JavaScript, 이미지 등의 정적 리소스 |
| Config        | Theme 설정                       |
| Locales       | 다국어 번역 데이터                     |
| Theme Editor  | Merchant가 사용하는 CMS 형태의 편집 UI   |

다만 일반적인 프론트엔드 개발과 Shopify Theme 개발의 가장 큰 차이는 <mark>Merchant가 직접 화면을 편집할 수 있다는 점</mark>이다. 개발자가 완성된 하나의 페이지를 만들어 제공하는 것에서 끝나는 것이 아니라, Merchant가 Theme Editor를 통해 Section과 Block을 조합하고 콘텐츠를 변경할 수 있도록 구조를 설계해야 한다.

결국 Shopify Theme 개발은 단순히 Store의 UI를 구현하는 것을 넘어, <mark>운영자가 직접 관리할 수 있는 Storefront UI 시스템을 만드는 것</mark>이라고 이해할 수 있다.

### 요약

* **Theme:** Storefront의 UI와 레이아웃을 구성하는 프론트엔드 레이어
* **Layout:** 전체 페이지에서 공통으로 사용하는 기본 구조
* **Template:** 페이지 타입별 구조를 정의
* **Section:** 페이지를 구성하는 큰 UI 모듈
* **Block:** Section 내부를 구성하는 작은 UI 단위
* **Snippet:** 반복되는 Liquid 코드의 재사용 단위
* **Assets:** CSS, JavaScript, 이미지 등의 정적 리소스
* **Config:** Merchant가 변경할 수 있는 Theme 설정 관리
* **Locales:** 다국어 번역 데이터 관리
* **Liquid:** Shopify 데이터를 HTML에 렌더링하기 위한 템플릿 언어
* **Theme Editor:** Merchant가 Section과 Block을 조합하고 설정을 변경하는 관리자 도구

---

## 참고

* [Shopify Themes](https://shopify.dev/docs/storefronts/themes)
* [Theme Architecture](https://shopify.dev/docs/storefronts/themes/architecture)
* [Liquid](https://shopify.dev/docs/api/liquid)
