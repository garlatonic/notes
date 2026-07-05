# Dev Journal

> 이 프로젝트는 **Codex**로 작업되었습니다.

Markdown으로 작성한 TIL을 GitHub Pages에서 읽기 좋은 정적 문서 사이트로 보여주는 개인 학습 기록 저장소입니다.

프레임워크나 빌드 과정 없이 `index.html`, `style.css`, `main.js`만으로 동작합니다. Markdown 파싱은 CDN의 `marked.js`, 코드 하이라이팅은 `highlight.js`를 사용합니다.

## 폴더 구조

```txt
til/
├── index.html
├── style.css
├── main.js
├── posts.json
├── README.md
├── daily/
│   └── 2026-07-04.md
├── frontend/
│   └── semantic-html.md
├── javascript/
│   └── array-map.md
├── react/
├── nextjs/
├── troubleshooting/
├── algorithm/
├── cs/
├── coding-test/
├── live-coding/
├── projects/
└── assets/
```

## 새 TIL 작성 방법

1. 원하는 카테고리 폴더에 Markdown 파일을 추가합니다.
2. 파일 이름은 내용을 알기 쉽게 작성합니다.

예시:

```txt
react/use-effect-cleanup.md
troubleshooting/github-pages-404.md
algorithm/binary-search.md
```

## posts.json 등록 방법

새 Markdown 파일을 만든 뒤 `posts.json`에 문서 정보를 추가합니다.

```json
{
  "title": "useEffect cleanup 정리",
  "category": "react",
  "path": "react/use-effect-cleanup.md",
  "date": "2026-07-05",
  "tags": ["react", "useEffect", "cleanup"]
}
```

필드 설명:

- `title`: 화면에 표시할 문서 제목
- `category`: 문서가 속한 카테고리
- `path`: Markdown 파일 경로
- `date`: 작성일
- `tags`: 검색과 분류에 사용할 태그 목록

## 로컬에서 확인하는 방법

브라우저 보안 정책 때문에 Markdown 파일을 `fetch`하려면 로컬 서버로 확인하는 것이 좋습니다.

Python이 설치되어 있다면 프로젝트 루트에서 실행합니다.

```bash
python -m http.server 8000
```

이후 브라우저에서 아래 주소로 접속합니다.

```txt
http://localhost:8000
```

VS Code를 사용한다면 Live Server 확장으로 열어도 됩니다.

## GitHub Pages 배포 방법

1. GitHub 저장소에 이 프로젝트 파일을 push합니다.
2. GitHub 저장소 페이지에서 `Settings`로 이동합니다.
3. 왼쪽 메뉴에서 `Pages`를 선택합니다.
4. `Build and deployment`의 Source를 `Deploy from a branch`로 설정합니다.
5. Branch를 `main`, 폴더를 `/root`로 선택한 뒤 저장합니다.
6. 잠시 후 표시되는 GitHub Pages 주소로 접속합니다.

저장소 이름이 `username.github.io`가 아닌 일반 저장소여도 상대 경로를 사용하므로 `https://username.github.io/repository-name/` 형태에서 동작합니다.

## 문서 관리 카테고리

기본 카테고리는 다음과 같습니다.

- `daily`
- `frontend`
- `javascript`
- `react`
- `nextjs`
- `cs`
- `projects`
- `troubleshooting`
- `algorithm`
- `live coding`
- `coding test`

카테고리를 추가하려면 폴더를 만들고 `main.js`의 `CATEGORY_LABELS`, `CATEGORY_ORDER`에 항목을 추가하면 됩니다.

## 앞으로 개선할 수 있는 기능

- 태그별 필터링
- 이전 글과 다음 글 이동
- Markdown 첫 문단을 카드 요약으로 표시
- 목차 자동 생성
- `posts.json` 자동 생성 스크립트
- GitHub Actions를 이용한 링크 검사
