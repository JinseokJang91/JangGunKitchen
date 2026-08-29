# Backend 패키지 및 파일 구조도

**작성일**: 2026-04-14  
**최종 수정일**: 2026-08-29  
**대상**: `backend/` (Spring Boot 단일 애플리케이션)

---

## 1. 루트 디렉터리 개요

```text
backend/
├── app/                    # 유일한 Spring Boot 애플리케이션
└── database-migrations/    # Flyway SQL (앱 기동 시 classpath로 적용)
```

- `app`은 Gradle `bootJar`를 만드는 배포 단위다. 포트는 기본 `8080`.
- HTTP 경로(`/api/auth`, `/api/member`, `/api/cook`)는 프론트 호환을 위해 유지한다.
- 패키지 경계는 프로세스 분리가 아니라 도메인이다: `auth`, `member`, `cook`, `common`.

---

## 2. app

**기능**: 인증, 회원, 레시피/재료/검색/추천, 공통 보안·스토리지

```text
app/
├── build.gradle
└── src/
    ├── main/
    │   ├── java/com/janggunkitchen/
    │   │   ├── JangGunKitchenApplication.java
    │   │   ├── auth/api/          # JWT, OAuth(Naver/Google/Kakao), 쿠키
    │   │   ├── member/api/        # 프로필, 팔로우, 1:1 문의
    │   │   ├── cook/api/          # recipe, ingredient, search, recommendation, popular, admin, creator
    │   │   └── common/            # 공유 엔티티(Member/Follow/CommonCode), Security, Storage, 예외, /health
    │   └── resources/
    │       ├── application.yml
    │       ├── application-dev.yml
    │       └── application-prod.yml
    └── test/
        ├── java/com/janggunkitchen/JangGunKitchenApplicationTests.java
        └── resources/application-test.yml
```

### 2.1 auth

로그인/로그아웃, JWT 발급/갱신, OAuth 콜백, 토큰 블랙리스트.

### 2.2 member

회원 프로필, 팔로우, 1:1 문의.

### 2.3 cook

레시피 CRUD, 댓글, 북마크/찜, 조회 기록, 검색, 추천, 인기 배치, 재료, 관리자 API, 공통코드 조회/관리.

### 2.4 common

`Member`/`Follow`/`CommonCode` 엔티티와 리포지토리, JWT 필터, CORS, S3/로컬 이미지 저장, 전역 예외, 헬스 체크.

---

## 3. database-migrations

**기능**: DB 스키마 버전 관리. 기존 Flyway 파일은 수정하지 않고 새 `V{n}`만 추가한다.

```text
database-migrations/
├── build.gradle
└── src/main/resources/db/migration/
    ├── V1__baseline_schema.sql
    └── V2__add_member_role.sql
```
