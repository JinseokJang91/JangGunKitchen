# 장군의부엌 아키텍처 정의서

## 문서 정보

| 항목 | 내용 |
|------|------|
| 프로젝트명 | JangGunKitchen |
| 문서명 | 아키텍처 정의서 |
| 버전 | 1.3 |
| 작성일 | 2026-09-01 |
| 최종 수정일 | 2026-09-01 |

---

## 1. 개요

본 문서는 **장군의부엌** 애플리케이션의 **시스템 구성**, **서비스 아키텍처**, **주요 데이터·처리 흐름**을 도식으로 정리한다.  
Flow 차트 및 다이어그램은 Mermaid를 사용하며, 뷰어에서 렌더링하면 한 눈에 구조를 파악할 수 있다.

---

## 2. 시스템 컨텍스트

시스템 외부 액터와 JangGunKitchen과의 관계를 나타낸다.

```mermaid
flowchart LR
    subgraph External["외부"]
        User["사용자"]
        OAuth["OAuth 제공자\n(네이버/구글/카카오)"]
    end

    subgraph App["JangGunKitchen 시스템"]
        Web["웹 애플리케이션\n(Vue 3 SPA)"]
        API["백엔드 API\n(Spring Boot 단일 앱)"]
    end

    User <-->|"HTTPS\n브라우저"| Web
    User -.->|"로그인 리다이렉트"| OAuth
    OAuth -.->|"인증 코드/토큰"| API
    Web <-->|"REST API\n(JWT)"| API
```

---

## 3. 백엔드 구성

백엔드는 **단일 Spring Boot 애플리케이션**이다. 도메인 패키지(`auth` / `member` / `cook` / `common`)로 나뉘며, Flyway SQL은 `database-migrations` 모듈이 담당한다. HTTP prefix는 기존 프론트와 호환되도록 유지한다.

```mermaid
flowchart TB
    subgraph Client["클라이언트"]
        Browser["브라우저\n(Vue 3 + Vite)"]
    end

    subgraph Backend["backend/app"]
        Auth["auth\nOAuth / JWT"]
        Member["member\n프로필 / 팔로우 / 문의"]
        Cook["cook\n레시피 / 검색 / 재료 / 관리자"]
        Common["common\n엔티티 / Security / Storage"]
    end

    subgraph Data["데이터 저장소"]
        PostgreSQL[(PostgreSQL)]
        Flyway["database-migrations\nFlyway"]
    end

    Browser -->|"REST 단일 origin"| Backend
    Auth --> Common
    Member --> Common
    Cook --> Common
    Backend --> PostgreSQL
    Flyway --> PostgreSQL
```

---

## 4. 도메인별 역할 요약

| 패키지 | 역할 | 주요 API Prefix |
|--------|------|-----------------|
| **auth** | OAuth 로그인, JWT 발급/갱신/로그아웃 | /api/auth |
| **member** | 회원 프로필, 팔로우, 1:1 문의 | /api/member |
| **cook** | 레시피·댓글·북마크·찜·조회·추천·크리에이터·검색·재료·관리자·공통코드 | /api/cook |
| **common** | 공유 엔티티(Member, Follow, CommonCode), 보안, 스토리지, 예외, `/health` | /health |

---

## 5. 프론트엔드 구조

프론트엔드는 **단일 SPA**이며, 레이아웃·라우터·상태·API 계층으로 구분된다.

```mermaid
flowchart TB
    subgraph Frontend["프론트엔드 (Vue 3)"]
        subgraph Views["Views (페이지)"]
            V1["Dashboard\n메인"]
            V2["Recipe*\n레시피 목록/상세/작성/수정"]
            V3["My*\n마이페이지/내 레시피/문의/찜/북마크"]
            V4["Admin*\n관리자"]
            V5["Auth\n로그인/OAuth 콜백"]
            V6["Ranking\nFAQ\nMemberProfile\nFollowingFeed"]
        end

        subgraph Layout["Layout"]
            AppLayout["AppLayout\n(Header + Main + Footer)"]
        end

        subgraph State["상태"]
            AuthStore["authStore\n(로그인/토큰)"]
        end

        subgraph API["API 클라이언트"]
            authApi["authApi"]
            recipeApi["recipeApi"]
            memberApi["memberApi"]
            bookmarkApi["bookmarkApi"]
            creatorApi["creatorApi"]
            Others["... (search, follow, inquiry 등)"]
        end

        AppLayout --> V1 & V2 & V3 & V4 & V6
        V5 -.->|"로그인 후"| AppLayout
        V1 & V2 & V3 & V4 & V6 --> AuthStore
        V1 & V2 & V3 & V4 & V6 --> API
        API -->|"Axios\nJWT 첨부"| Backend["백엔드 API"]
    end
```

---

## 6. 주요 처리 흐름

### 6.1 로그인 흐름 (OAuth + JWT)

```mermaid
sequenceDiagram
    participant U as 사용자
    participant V as Vue (Login)
    participant A as backend/app
    participant O as OAuth 제공자

    U->>V: 로그인 버튼 클릭
    V->>O: 로그인 페이지 리다이렉트
    U->>O: 인증
    O->>V: callback URL + code
    V->>A: GET/POST /api/auth/{provider}/callback?code=...
    A->>O: code → access_token 교환
    O-->>A: token
    A->>A: 회원 조회/생성, JWT 생성
    A-->>V: accessToken, refreshToken 등
    V->>V: authStore 저장, 홈 이동
    V-->>U: 대시보드 표시
```

### 6.2 레시피 상세 조회 및 조회 기록

```mermaid
sequenceDiagram
    participant U as 사용자
    participant V as RecipeDetail.vue
    participant C as backend/app
    participant M as PostgreSQL

    U->>V: 레시피 상세 진입
    V->>C: GET /api/cook/recipe/{id}
    C->>M: 레시피 조회
    M-->>C: 레시피
    C-->>V: 레시피 상세

    alt 로그인 사용자
        V->>C: POST /api/cook/recipes/{id}/view
        C->>M: RecipeView 저장/갱신
        C-->>V: 200 OK
    end

    V-->>U: 상세 화면 표시
```

### 6.3 대시보드 데이터 로딩 (병렬)

```mermaid
flowchart LR
    subgraph User["사용자"]
        A["대시보드 접근"]
    end

    subgraph Load["병렬 로딩"]
        B1["오늘의 추천\n/recommendations/today"]
        B2["인기 레시피\n/api/cook/recipe/popular"]
        B5["최근 본\n(로그인 시)\n/recent-views"]
        B6["추천 크리에이터\n/creators/recommended"]
    end

    subgraph UI["화면 섹션"]
        U1["TodayRecommendations"]
        U2["PopularRecipes"]
        U5["RecentViews"]
        U6["RecommendedCreators"]
    end

    A --> Load
    B1 --> U1
    B2 --> U2
    B5 --> U5
    B6 --> U6
```

### 6.4 레시피 북마크 저장 흐름

```mermaid
sequenceDiagram
    participant U as 사용자
    participant V as BookmarkDialog.vue
    participant B as backend/app

    U->>V: 레시피에서 '북마크' 클릭
    V->>B: GET /api/cook/recipe/bookmarks/recipe-books (내 레시피북 목록)
    B-->>V: recipeBooks[]
    V-->>U: 레시피북 선택 다이얼로그 표시

    U->>V: 레시피북 선택 후 저장
    V->>B: 북마크 추가 (해당 recipe-book에 레시피 추가)
    B-->>V: 성공
    V-->>U: 토스트 후 다이얼로그 닫기
```

---

## 7. 기술 스택 요약

| 구분 | 기술 |
|------|------|
| **프론트엔드** | Vue 3, TypeScript, Pinia, Vue Router, PrimeVue, Vite |
| **백엔드** | Java 21, Spring Boot 3.5, Spring Security, JPA, QueryDSL |
| **DB** | PostgreSQL |
| **인증** | JWT, OAuth2 (네이버/구글/카카오) |
| **기타** | Spring Scheduler (인기 점수 등 배치성 작업), Flyway (`database-migrations`) |
| **로컬 기본** | API `http://localhost:8080`, 프론트 `VITE_API_BASE_URL` 단일 변수 |

---

## 8. 디렉토리 구조 (참고)

```
JangGunKitchen/
├── frontend/                 # Vue 3 SPA
│   ├── src/
│   │   ├── api/              # API 클라이언트 (단일 VITE_API_BASE_URL)
│   │   ├── components/
│   │   ├── layout/
│   │   ├── router/
│   │   ├── stores/
│   │   ├── types/
│   │   ├── views/
│   │   └── main.ts
│   └── ...
├── backend/
│   ├── app/                  # 단일 Spring Boot 앱
│   └── database-migrations/  # Flyway SQL
└── docs/
```

---

## 9. 변경 이력

| 버전 | 일자 | 변경 내용 |
|------|------|-----------|
| 1.0 | 2026-09-01 | 최초 작성(시스템·서비스·프론트 구조 및 주요 플로우), 3개 서비스+공통 라이브러리를 `backend/app` 단일 애플리케이션으로 통합. API prefix 유지, 프론트 base URL 단일화, 대시보드 인기 API 경로 정정(`/api/cook/recipe/popular`), 로컬 포트·`VITE_API_BASE_URL`·Flyway 명시. docs 전수 현행화 |
