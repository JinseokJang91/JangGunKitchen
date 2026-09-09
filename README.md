# 장군의부엌 (JangGunKitchen)

레시피를 만들고 나누고, 추천과 랭킹으로 발견하는 **레시피 공유 웹 서비스**입니다.

소셜 로그인으로 바로 시작하고, 공개·비공개·초안 상태의 레시피를 관리하며, 팔로우·피드·북마크·찜으로 크리에이터와 콘텐츠를 이어 줍니다.  
프론트는 Vue 3 SPA, 백엔드는 Spring Boot 단일 애플리케이션으로 구성되어 있습니다.

| | |
|---|---|
| **서비스** | [www.knusrae.com](https://www.knusrae.com) |
| **API** | [api.knusrae.com](https://api.knusrae.com) |
| **스택** | Vue 3 · Spring Boot 3.5 · Java 21 · PostgreSQL 17 |

---

## 주요 기능

- **회원·인증** — 네이버 / 구글 / 카카오 OAuth2, JWT 발급·갱신·로그아웃
- **레시피** — CRUD, 공개·비공개·초안, 카테고리, 재료·조리 단계, 댓글(이미지 포함)
- **검색·발견** — 키워드 검색, 카테고리별 목록, 오늘의 추천, 기간별 인기·랭킹
- **소셜** — 팔로우 / 팔로잉 피드, 크리에이터 프로필
- **저장** — 레시피북(폴더) · 북마크 · 찜
- **재료·문의** — 재료·보관·손질 정보, 재료 등록 요청·관리자 승인, 1:1 문의
- **관리자** — 공통코드, 테마 컬렉션, 재료·문의 관리

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | Vue 3, TypeScript, Vite, Pinia, Vue Router, PrimeVue 4, Tailwind CSS |
| Backend | Java 21, Spring Boot 3.5, Spring Security, JPA, QueryDSL, Flyway |
| Database | PostgreSQL 17 |
| Auth | JWT + OAuth2 (Naver / Google / Kakao) |
| Storage | 로컬 파일 또는 AWS S3 |
| Deploy | S3 + CloudFront (프론트), EC2 + Docker Compose (백엔드·DB), GitHub Actions (OIDC) |

---

## 아키텍처

백엔드는 `auth` / `member` / `cook` / `common` **도메인 패키지**로 나뉜 **단일 Spring Boot 앱**입니다.  
HTTP API prefix(`/api/auth`, `/api/member`, `/api/cook`)는 프론트와 호환되도록 유지합니다.

```text
브라우저
  ├─ 프론트 (Vue 3 SPA)  →  CloudFront → S3
  └─ API (Spring Boot)   →  EC2 (Docker Compose: app + PostgreSQL)
         ↑
    OAuth (네이버 / 구글 / 카카오)
```

### AWS Production

![JangGunKitchen AWS Production Architecture](docs/03-deployment/aws-architecture-diagram.png)

---

## 디렉토리 구조

```text
JangGunKitchen/
├── frontend/                  # Vue 3 SPA
├── backend/
│   ├── app/                   # Spring Boot 단일 애플리케이션
│   └── database-migrations/   # Flyway SQL
├── infra/                     # 배포·시크릿 등 운영 스크립트
├── docs/                      # 설계·아키텍처·배포 문서
├── docker-compose.yml         # 앱 + PostgreSQL
└── .github/workflows/         # 프론트·백엔드 CI/CD
```

---
