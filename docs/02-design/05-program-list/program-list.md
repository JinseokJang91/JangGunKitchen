# 프로그램 목록

**정의**: 본 애플리케이션에서 구현된 모든 프로그램 단위(파일)를 테이블 형태로 정의한 문서  
**작성 기준**: Frontend `frontend/src/`, Backend `backend/app/src/main/java/com/janggunkitchen/` 소스 파일 (build/generated 제외)  
**양식**: SI 산출물 프로그램 목록 (프로그램ID, 프로그램명, 파일경로, 설명, 비고)  
**기준일**: 2026-09-01

* 파일경로 상단 생략: `backend/app/src/main/java/com/janggunkitchen/` → `app/.../`  
  예) `app/.../auth/api/web/AuthController.java`

---

## 프로그램 ID 체계

| 구분 | 형식 | 예 |
|------|------|-----|
| Backend | BE-{도메인}-{3자리일련번호} | BE-AUTH-001, BE-CMM-001, BE-MEM-001, BE-COOK-001 |
| Frontend 화면 | FE-VW-{3자리} | FE-VW-001 |
| Frontend 레이아웃 | FE-LAY-{3자리} | FE-LAY-001 |
| Frontend 컴포넌트 | FE-CMP-{3자리} | FE-CMP-001 |
| Frontend API/기타 | FE-API, FE-STORE, FE-UTIL, FE-TYPE, FE-DATA | FE-API-001 |

---

## 1. 백엔드 프로그램 목록

### 1.1 auth

| No | 프로그램ID | 구분 | 프로그램명 | 파일경로 | 설명 | 비고 |
|----|------------|------|------------|----------|------|------|
| 1 | BE-AUTH-001 | Application | 애플리케이션 진입점 | app/.../JangGunKitchenApplication.java | Spring Boot 메인 클래스 | - |
| 2 | BE-AUTH-002 | Controller | 인증 API 컨트롤러 | app/.../auth/api/web/AuthController.java | OAuth 콜백, 로그아웃, 리프레시, 테스트 로그인 | refresh_tokens, token_blacklist |
| 3 | BE-AUTH-003 | Service | 토큰 서비스 | app/.../auth/api/domain/service/TokenService.java | JWT 발급·검증·리프레시·블랙리스트 | - |
| 4 | BE-AUTH-004 | Service | 네이버 인증 서비스 | app/.../auth/api/domain/service/NaverAuthService.java | 네이버 OAuth 사용자 정보 조회 | - |
| 5 | BE-AUTH-005 | Service | 카카오 인증 서비스 | app/.../auth/api/domain/service/KakaoAuthService.java | 카카오 OAuth 사용자 정보 조회 | - |
| 6 | BE-AUTH-006 | Service | 구글 인증 서비스 | app/.../auth/api/domain/service/GoogleAuthService.java | 구글 OAuth 사용자 정보 조회 | - |
| 7 | BE-AUTH-007 | Service | OAuth State 서비스 | app/.../auth/api/domain/service/OAuthStateService.java | OAuth state 발급·검증 | - |
| 8 | BE-AUTH-008 | Service | 토큰 블랙리스트 체커 구현 | app/.../auth/api/domain/service/TokenBlacklistCheckerImpl.java | TokenBlacklistChecker 구현 | token_blacklist |
| 9 | BE-AUTH-009 | Repository | 리프레시토큰 저장소 | app/.../auth/api/domain/repository/RefreshTokenRepository.java | 리프레시 토큰 CRUD | refresh_tokens |
| 10 | BE-AUTH-010 | Repository | 토큰블랙리스트 저장소 | app/.../auth/api/domain/repository/TokenBlacklistRepository.java | 블랙리스트 토큰 조회/저장 | token_blacklist |
| 11 | BE-AUTH-011 | Entity | 리프레시토큰 엔티티 | app/.../auth/api/domain/entity/RefreshToken.java | 리프레시 토큰 테이블 매핑 | refresh_tokens |
| 12 | BE-AUTH-012 | Entity | 토큰블랙리스트 엔티티 | app/.../auth/api/domain/entity/TokenBlacklist.java | 토큰 블랙리스트 테이블 매핑 | token_blacklist |
| 13 | BE-AUTH-013 | DTO | 카카오 사용자 DTO | app/.../auth/api/dto/KakaoUserDTO.java | 카카오 사용자 정보 | - |
| 14 | BE-AUTH-014 | DTO | 네이버 사용자 DTO | app/.../auth/api/dto/NaverUserDTO.java | 네이버 사용자 정보 | - |
| 15 | BE-AUTH-015 | DTO | 구글 사용자 DTO | app/.../auth/api/dto/GoogleUserDTO.java | 구글 사용자 정보 | - |
| 16 | BE-AUTH-016 | Request | 테스트 로그인 요청 | app/.../auth/api/web/request/TestLoginRequest.java | 테스트 로그인 요청 바디 | - |
| 17 | BE-AUTH-017 | Response | 토큰 응답 | app/.../auth/api/web/response/TokenResponse.java | 액세스/리프레시 토큰 응답 | - |
| 18 | BE-AUTH-018 | Utils | 쿠키 유틸 | app/.../auth/api/utils/CookieUtils.java | 쿠키 설정/삭제 | - |
| 19 | BE-AUTH-019 | Utils | 로그인 포맷터 | app/.../auth/api/utils/LoginFormatter.java | 로그인 ID 포맷 | - |

* 패키지 루트: `app/.../auth/`

---

### 1.2 common

공통 엔티티·보안·스토리지·헬스. 공통코드 **컨트롤러**는 cook 절(1.4) 참조.

| No | 프로그램ID | 구분 | 프로그램명 | 파일경로 | 설명 | 비고 |
|----|------------|------|------------|----------|------|------|
| 1 | BE-CMM-001 | Controller | 헬스 체크 | app/.../common/health/HealthController.java | GET /health | - |
| 2 | BE-CMM-002 | Service | 공통코드 서비스 | app/.../common/domain/service/CommonCodeService.java | 공통코드 조회·등록·수정·삭제 | - |
| 3 | BE-CMM-003 | Repository | 공통코드 저장소 | app/.../common/domain/repository/CommonCodeRepository.java | 공통코드 마스터 조회 | common_code |
| 4 | BE-CMM-004 | Repository | 공통코드상세 저장소 | app/.../common/domain/repository/CommonCodeDetailRepository.java | 공통코드 상세 조회 | common_code_detail |
| 5 | BE-CMM-005 | Repository | 회원 저장소 | app/.../common/domain/repository/MemberRepository.java | 회원 조회 | member |
| 6 | BE-CMM-006 | Repository | 팔로우 저장소 | app/.../common/domain/repository/FollowRepository.java | 팔로우 관계 조회 | follow |
| 7 | BE-CMM-007 | Entity | 공통코드 엔티티 | app/.../common/domain/entity/CommonCode.java | 공통코드 마스터 테이블 매핑 | common_code |
| 8 | BE-CMM-008 | Entity | 공통코드상세 엔티티 | app/.../common/domain/entity/CommonCodeDetail.java | 공통코드 상세 테이블 매핑 | common_code_detail |
| 9 | BE-CMM-009 | Entity | 공통코드상세ID | app/.../common/domain/entity/CommonCodeDetailId.java | 복합키 | common_code_detail |
| 10 | BE-CMM-010 | Entity | 회원 엔티티 | app/.../common/domain/entity/Member.java | 회원 테이블 매핑 | member |
| 11 | BE-CMM-011 | Entity | 팔로우 엔티티 | app/.../common/domain/entity/Follow.java | 팔로우 테이블 매핑 | follow |
| 12 | BE-CMM-012 | DTO | 공통코드 응답 | app/.../common/dto/CommonCodeResponse.java | 공통코드 조회 응답 | - |
| 13 | BE-CMM-013 | DTO | 공통코드상세 응답 | app/.../common/dto/CommonCodeDetailResponse.java | 공통코드 상세 응답 | - |
| 14 | BE-CMM-014 | DTO | 공통코드 목록 DTO | app/.../common/dto/CommonCodeListDto.java | 목록용 | - |
| 15 | BE-CMM-015 | DTO | 관리자 공통코드 응답 | app/.../common/dto/AdminCommonCodeResponse.java | 관리자용 조회 응답 | - |
| 16 | BE-CMM-016 | DTO | 관리자 공통코드상세 DTO | app/.../common/dto/AdminCommonCodeDetailDto.java | 관리자용 상세 | - |
| 17 | BE-CMM-017 | DTO | 공통코드 생성 요청 | app/.../common/dto/CommonCodeCreateRequest.java | 등록 요청 | - |
| 18 | BE-CMM-018 | DTO | 공통코드 수정 요청 | app/.../common/dto/CommonCodeUpdateRequest.java | 수정 요청 | - |
| 19 | BE-CMM-019 | DTO | 공통코드상세 생성 요청 | app/.../common/dto/CommonCodeDetailCreateRequest.java | 상세 등록 | - |
| 20 | BE-CMM-020 | DTO | 공통코드상세 수정 요청 | app/.../common/dto/CommonCodeDetailUpdateRequest.java | 상세 수정 | - |
| 21 | BE-CMM-021 | DTO | 에러 응답 | app/.../common/dto/ErrorResponse.java | 전역 예외 응답 형식 | - |
| 22 | BE-CMM-022 | Exception | 리소스 없음 예외 | app/.../common/exception/ResourceNotFoundException.java | 404 계열 | - |
| 23 | BE-CMM-023 | Config | 보안 설정 | app/.../common/security/config/SecurityConfig.java | 인증·인가·CORS 설정 | - |
| 24 | BE-CMM-024 | Config | QueryDSL 설정 | app/.../common/security/config/QueryDslConfig.java | QueryDSL 빈 설정 | - |
| 25 | BE-CMM-025 | Config | RestTemplate 설정 | app/.../common/security/config/RestTemplateConfig.java | HTTP 클라이언트 | - |
| 26 | BE-CMM-026 | Config | Web 설정 | app/.../common/custom/config/WebConfig.java | WebMvc 설정 | - |
| 27 | BE-CMM-027 | Filter | JWT 인증 필터 | app/.../common/security/filter/JwtAuthenticationFilter.java | JWT 검증 필터 | - |
| 28 | BE-CMM-028 | Filter | CORS 필터 | app/.../common/security/filter/CorsFilter.java | CORS 처리 | - |
| 29 | BE-CMM-029 | Handler | 보안 예외 핸들러 | app/.../common/security/handler/SecurityHandlers.java | 인증/인가 실패 처리 | - |
| 30 | BE-CMM-030 | Handler | 전역 예외 핸들러 | app/.../common/handler/GlobalExceptionHandler.java | 전역 예외 → ErrorResponse | - |
| 31 | BE-CMM-031 | Provider | JWT 토큰 프로바이더 | app/.../common/security/provider/JwtTokenProvider.java | JWT 생성·파싱 | - |
| 32 | BE-CMM-032 | Interface | 토큰 블랙리스트 체커 | app/.../common/security/TokenBlacklistChecker.java | 블랙리스트 조회 인터페이스 | - |
| 33 | BE-CMM-033 | Utils | 수량 파서 | app/.../common/utils/QuantityParser.java | 재료 수량 파싱 | - |
| 34 | BE-CMM-034 | Utils | 인증 유틸 | app/.../common/utils/AuthenticationUtils.java | 현재 사용자 ID 등 | - |
| 35 | BE-CMM-035 | Utils | PII 마스킹 | app/.../common/utils/PiiMaskUtils.java | 개인정보 마스킹 | - |
| 36 | BE-CMM-036 | Storage | 이미지 저장 인터페이스 | app/.../common/custom/storage/ImageStorage.java | 이미지 업로드/삭제 인터페이스 | - |
| 37 | BE-CMM-037 | Storage | 로컬 이미지 저장 | app/.../common/custom/storage/LocalImageStorage.java | 로컬 파일 시스템 저장 | - |
| 38 | BE-CMM-038 | Storage | S3 이미지 저장 | app/.../common/custom/storage/S3ImageStorage.java | AWS S3 이미지 저장 | - |
| 39 | BE-CMM-039 | Config | S3 설정 | app/.../common/custom/storage/S3Config.java | S3 클라이언트 빈 | - |
| 40 | BE-CMM-040 | Utils | 스토리지 키 유틸 | app/.../common/custom/storage/StorageKeyUtils.java | 객체 키 생성/파싱 | - |
| 41 | BE-CMM-041 | Enum | 소셜역할 | app/.../common/domain/enums/SocialRole.java | NAVER/KAKAO/GOOGLE | - |
| 42 | BE-CMM-042 | Enum | 활성여부 | app/.../common/domain/enums/Active.java | TRUE/FALSE | - |
| 43 | BE-CMM-043 | Enum | 성별 | app/.../common/domain/enums/Gender.java | MALE/FEMALE/UNKNOWN | - |
| 44 | BE-CMM-044 | Enum | 회원역할 | app/.../common/domain/enums/MemberRole.java | USER/ADMIN 등 | - |
| 45 | BE-CMM-045 | Constants | 공통 상수 | app/.../common/utils/constants/CommonConstants.java | 공통 상수 정의 | - |

* 패키지 루트: `app/.../common/`

---

### 1.3 member

| No | 프로그램ID | 구분 | 프로그램명 | 파일경로 | 설명 | 비고 |
|----|------------|------|------------|----------|------|------|
| 1 | BE-MEM-001 | Controller | 회원 API 컨트롤러 | app/.../member/api/member/web/MemberController.java | 내 정보·프로필·회원 조회·탈퇴·프로필 수정 | member |
| 2 | BE-MEM-002 | Controller | 팔로우 API 컨트롤러 | app/.../member/api/follow/web/FollowController.java | 팔로우/언팔로우·팔로워·팔로잉 목록 | follow |
| 3 | BE-MEM-003 | Controller | 문의 API 컨트롤러 | app/.../member/api/inquiry/web/InquiryController.java | 문의 등록·조회·수정·삭제·관리자 답변 | inquiry, inquiry_reply |
| 4 | BE-MEM-004 | Service | 회원 서비스 | app/.../member/api/member/domain/service/MemberService.java | 회원 조회·프로필 수정 | - |
| 5 | BE-MEM-005 | Service | 회원 탈퇴 서비스 | app/.../member/api/member/domain/service/MemberWithdrawalService.java | 회원 탈퇴 처리 | - |
| 6 | BE-MEM-006 | Service | 팔로우 서비스 | app/.../member/api/follow/domain/service/FollowService.java | 팔로우/언팔로우·목록 조회 | - |
| 7 | BE-MEM-007 | Service | 문의 서비스 | app/.../member/api/inquiry/domain/service/InquiryService.java | 문의 CRUD·답변 | - |
| 8 | BE-MEM-008 | Repository | 문의 저장소 | app/.../member/api/inquiry/domain/repository/InquiryRepository.java | 문의 조회 | inquiry |
| 9 | BE-MEM-009 | Repository | 문의답변 저장소 | app/.../member/api/inquiry/domain/repository/InquiryReplyRepository.java | 답변 조회 | inquiry_reply |
| 10 | BE-MEM-010 | Repository | 문의이미지 저장소 | app/.../member/api/inquiry/domain/repository/InquiryImageRepository.java | 문의 이미지 | inquiry_image |
| 11 | BE-MEM-011 | Entity | 문의 엔티티 | app/.../member/api/inquiry/domain/entity/Inquiry.java | 문의 테이블 매핑 | inquiry |
| 12 | BE-MEM-012 | Entity | 문의답변 엔티티 | app/.../member/api/inquiry/domain/entity/InquiryReply.java | 문의 답변 테이블 매핑 | inquiry_reply |
| 13 | BE-MEM-013 | Entity | 문의이미지 엔티티 | app/.../member/api/inquiry/domain/entity/InquiryImage.java | 문의 이미지 테이블 매핑 | inquiry_image |
| 14 | BE-MEM-014 | DTO | 회원 DTO | app/.../member/api/member/dto/MemberDto.java | 회원 정보 응답 | - |
| 15 | BE-MEM-015 | DTO | 팔로우 DTO | app/.../member/api/follow/dto/FollowDto.java | 팔로우 관계 | - |
| 16 | BE-MEM-016 | DTO | 팔로워 DTO | app/.../member/api/follow/dto/FollowerDto.java | 팔로워 목록 | - |
| 17 | BE-MEM-017 | DTO | 팔로잉 DTO | app/.../member/api/follow/dto/FollowingDto.java | 팔로잉 목록 | - |
| 18 | BE-MEM-018 | DTO | 문의 목록 항목 | app/.../member/api/inquiry/dto/InquiryListItemDto.java | 문의 목록 한 행 | - |
| 19 | BE-MEM-019 | DTO | 문의 목록 응답 | app/.../member/api/inquiry/dto/InquiryListResponse.java | 문의 목록 응답 | - |
| 20 | BE-MEM-020 | DTO | 문의 상세 DTO | app/.../member/api/inquiry/dto/InquiryDetailDto.java | 문의 상세 조회 | - |
| 21 | BE-MEM-021 | DTO | 문의 답변 DTO | app/.../member/api/inquiry/dto/InquiryReplyDto.java | 답변 내용 | - |

* 패키지 루트: `app/.../member/` — 하위 `api/member|follow|inquiry/`

---

### 1.4 cook

| No | 프로그램ID | 구분 | 프로그램명 | 파일경로 | 설명 | 비고 |
|----|------------|------|------------|----------|------|------|
| 1 | BE-COOK-001 | Controller | 공통코드 API 컨트롤러 | app/.../cook/api/commoncode/web/CommonCodeController.java | 공통코드 조회 | common_code* |
| 2 | BE-COOK-002 | Controller | 관리자 공통코드 컨트롤러 | app/.../cook/api/admin/web/AdminCommonCodeController.java | 공통코드 CRUD, 상세 CRUD | common_code* |
| 3 | BE-COOK-003 | Controller | 레시피 API 컨트롤러 | app/.../cook/api/recipe/web/RecipeController.java | 레시피 CRUD·목록·인기·팔로잉피드 | recipe 등 |
| 4 | BE-COOK-004 | Controller | 레시피 댓글 컨트롤러 | app/.../cook/api/recipe/web/RecipeCommentController.java | 댓글 등록·조회·수정·삭제 | recipe_comment |
| 5 | BE-COOK-005 | Controller | 레시피 북마크 컨트롤러 | app/.../cook/api/recipe/web/RecipeBookmarkController.java | 북마크·레시피북 내 북마크·이동·메모 | recipe_bookmark, recipebook |
| 6 | BE-COOK-006 | Controller | 레시피북 컨트롤러 | app/.../cook/api/recipe/web/RecipeBookController.java | 레시피북 CRUD·순서·기본책 | recipebook |
| 7 | BE-COOK-007 | Controller | 레시피 조회수 컨트롤러 | app/.../cook/api/recipe/web/RecipeViewController.java | 조회 등록·최근 본 목록·삭제 | recipe_view |
| 8 | BE-COOK-008 | Controller | 레시피 찜 컨트롤러 | app/.../cook/api/recipe/web/RecipeFavoriteController.java | 찜 토글·목록·체크·개수 | recipe_favorite |
| 9 | BE-COOK-009 | Controller | 크리에이터 컨트롤러 | app/.../cook/api/creator/web/CreatorController.java | 추천 크리에이터 | member |
| 10 | BE-COOK-010 | Controller | 재료 컨트롤러 | app/.../cook/api/ingredient/web/IngredientController.java | 재료 그룹·보관법·손질법 조회 | ingredient 등 |
| 11 | BE-COOK-011 | Controller | 관리자 재료 컨트롤러 | app/.../cook/api/admin/web/AdminIngredientController.java | 재료 그룹·재료·보관법·손질법 관리 | ingredient_group 등 |
| 12 | BE-COOK-012 | Controller | 검색 컨트롤러 | app/.../cook/api/search/web/SearchController.java | 레시피 검색 | recipe |
| 13 | BE-COOK-013 | Controller | 추천 컨트롤러 | app/.../cook/api/recommendation/web/RecommendationController.java | 오늘의 추천 레시피 | recipe |
| 14 | BE-COOK-014 | Service | 레시피 서비스 | app/.../cook/api/recipe/domain/service/RecipeService.java | 레시피 CRUD·목록·인기·팔로잉피드 | - |
| 15 | BE-COOK-015 | Service | 레시피 댓글 서비스 | app/.../cook/api/recipe/domain/service/RecipeCommentService.java | 댓글 CRUD | - |
| 16 | BE-COOK-016 | Service | 레시피 북마크 서비스 | app/.../cook/api/recipe/domain/service/RecipeBookmarkService.java | 북마크·이동·메모 | - |
| 17 | BE-COOK-017 | Service | 레시피북 서비스 | app/.../cook/api/recipe/domain/service/RecipeBookService.java | 레시피북 CRUD·순서 | - |
| 18 | BE-COOK-018 | Service | 레시피 조회 서비스 | app/.../cook/api/recipe/domain/service/RecipeViewService.java | 조회 등록·최근 본 | - |
| 19 | BE-COOK-019 | Service | 레시피 찜 서비스 | app/.../cook/api/recipe/domain/service/RecipeFavoriteService.java | 찜 토글·목록 | - |
| 20 | BE-COOK-020 | Service | 크리에이터 추천 서비스 | app/.../cook/api/creator/domain/service/CreatorRecommendationService.java | 추천 크리에이터 산출 | - |
| 21 | BE-COOK-021 | Service | 재료 서비스 | app/.../cook/api/ingredient/domain/service/IngredientService.java | 재료 그룹·재료·보관·손질 조회 | - |
| 22 | BE-COOK-022 | Service | 관리자 재료 서비스 | app/.../cook/api/admin/domain/service/AdminIngredientService.java | 재료 그룹·재료·보관·손질 관리 | - |
| 23 | BE-COOK-023 | Service | 검색 서비스 | app/.../cook/api/search/domain/service/SearchService.java | 레시피 검색 | - |
| 24 | BE-COOK-024 | Service | 추천 서비스 | app/.../cook/api/recommendation/domain/service/RecommendationService.java | 오늘의 추천 | - |
| 25 | BE-COOK-025 | Service | 인기도 계산 서비스 | app/.../cook/api/popular/domain/service/PopularityCalculationService.java | 인기 점수 계산(배치) | recipe_popularity |
| 26 | BE-COOK-026 | Service | 인기 레시피 서비스 | app/.../cook/api/popular/domain/service/PopularRecipeService.java | 인기 레시피 조회 | recipe_popularity |
| 27 | BE-COOK-027 | Service | 인기도 Writer | app/.../cook/api/popular/domain/service/RecipePopularityWriter.java | 인기도 점수 저장 | recipe_popularity |
| 28 | BE-COOK-028 | Repository | 레시피 저장소 | app/.../cook/api/recipe/domain/repository/RecipeRepository.java | 레시피 조회 | recipe |
| 29 | BE-COOK-029 | Repository | 레시피 커스텀/구현 | app/.../cook/api/recipe/domain/repository/RecipeRepositoryCustom.java, RecipeRepositoryImpl.java | 동적 쿼리 | recipe |
| 30 | BE-COOK-030 | Repository | 레시피 댓글 저장소 | app/.../cook/api/recipe/domain/repository/RecipeCommentRepository.java | recipe_comment | - |
| 31 | BE-COOK-031 | Repository | 레시피북 저장소 | app/.../cook/api/recipe/domain/repository/RecipeBookRepository.java | recipebook | - |
| 32 | BE-COOK-032 | Repository | 레시피 북마크 저장소 | app/.../cook/api/recipe/domain/repository/RecipeBookmarkRepository.java | recipe_bookmark | - |
| 33 | BE-COOK-033 | Repository | 레시피 카테고리 저장소 | app/.../cook/api/recipe/domain/repository/RecipeCategoryRepository.java | recipe_category | - |
| 34 | BE-COOK-034 | Repository | 레시피 찜 저장소 | app/.../cook/api/recipe/domain/repository/RecipeFavoriteRepository.java | recipe_favorite | - |
| 35 | BE-COOK-035 | Repository | 레시피 이미지 저장소 | app/.../cook/api/recipe/domain/repository/RecipeImageRepository.java | recipe_image | - |
| 36 | BE-COOK-036 | Repository | 레시피 재료그룹/항목 저장소 | app/.../cook/api/recipe/domain/repository/RecipeIngredientGroupRepository.java, RecipeIngredientItemRepository.java | recipe_ingredient_* | - |
| 37 | BE-COOK-037 | Repository | 레시피 인기도/이력 저장소 | app/.../cook/api/recipe/domain/repository/RecipePopularityRepository.java, RecipePopularityHistoryRepository.java | recipe_popularity* | - |
| 38 | BE-COOK-038 | Repository | 레시피 조회 저장소 | app/.../cook/api/recipe/domain/repository/RecipeViewRepository.java | recipe_view | - |
| 39 | BE-COOK-039 | Repository | 레시피 단계 저장소 | app/.../cook/api/recipe/domain/repository/RecipeStepRepository.java | recipe_detail | - |
| 40 | BE-COOK-040 | Repository | 재료 그룹/재료/보관/손질 저장소 | app/.../cook/api/ingredient/domain/repository/IngredientGroupRepository.java, IngredientRepository.java, IngredientStorageRepository.java, IngredientPreparationRepository.java | ingredient* | - |
| 41 | BE-COOK-041 | Entity | 레시피 엔티티 | app/.../cook/api/recipe/domain/entity/Recipe.java | recipe | - |
| 42 | BE-COOK-042 | Entity | 레시피 상세 엔티티 | app/.../cook/api/recipe/domain/entity/RecipeDetail.java | recipe_detail | - |
| 43 | BE-COOK-043 | Entity | 레시피 이미지 엔티티 | app/.../cook/api/recipe/domain/entity/RecipeImage.java | recipe_image | - |
| 44 | BE-COOK-044 | Entity | 레시피 카테고리 엔티티 | app/.../cook/api/recipe/domain/entity/RecipeCategory.java, RecipeCategoryId.java | recipe_category | - |
| 45 | BE-COOK-045 | Entity | 레시피 재료 그룹/항목 엔티티 | app/.../cook/api/recipe/domain/entity/RecipeIngredientGroup.java, RecipeIngredientItem.java | recipe_ingredient_* | - |
| 46 | BE-COOK-046 | Entity | 레시피 댓글 엔티티 | app/.../cook/api/recipe/domain/entity/RecipeComment.java | recipe_comment | - |
| 47 | BE-COOK-047 | Entity | 레시피 찜 엔티티 | app/.../cook/api/recipe/domain/entity/RecipeFavorite.java | recipe_favorite | - |
| 48 | BE-COOK-048 | Entity | 레시피 조회 엔티티 | app/.../cook/api/recipe/domain/entity/RecipeView.java | recipe_view | - |
| 49 | BE-COOK-049 | Entity | 레시피 인기도/이력 엔티티 | app/.../cook/api/recipe/domain/entity/RecipePopularity.java, RecipePopularityHistory.java | recipe_popularity* | - |
| 50 | BE-COOK-050 | Entity | 레시피북/북마크 엔티티 | app/.../cook/api/recipe/domain/entity/RecipeBook.java, RecipeBookmark.java | recipebook, recipe_bookmark | - |
| 51 | BE-COOK-051 | Entity | 재료 그룹/재료/보관/손질 엔티티 | app/.../cook/api/ingredient/domain/entity/IngredientGroup.java, Ingredient.java, IngredientStorage.java, IngredientPreparation.java | ingredient* | - |
| 52 | BE-COOK-052 | DTO | 레시피 관련 DTO | app/.../cook/api/recipe/dto/RecipeDto.java, RecipeSimpleDto.java, RecipeDetailDto.java, RecipeImageDto.java, RecipeCategoryDto.java, RecipeCookingTipDto.java, RecipeIngredientGroupDto.java, RecipeIngredientItemDto.java, RecipeStepDto.java, RecipeStepDetailDto.java, RecipeStatsDto.java, RecipeViewDto.java, RecipeFavoriteDto.java, RecipeBookDto.java, RecipeBookmarkDto.java, RecipeCommentDto.java, MemberCommentItemDto.java | API 입출력 | - |
| 53 | BE-COOK-053 | DTO | 크리에이터 DTO | app/.../cook/api/creator/dto/CreatorDto.java | API 입출력 | - |
| 54 | BE-COOK-054 | DTO | 재료 관련 DTO | app/.../cook/api/ingredient/dto/IngredientGroupDto.java, IngredientDto.java, IngredientListResponseDto.java, IngredientStorageDto.java, IngredientPreparationDto.java | API 입출력 | - |
| 55 | BE-COOK-055 | DTO | 인기/추천 DTO | app/.../cook/api/popular/dto/PopularRecipeDto.java, PopularityStatsDto.java, recommendation/dto/RecommendedRecipeDto.java, TodayRecommendationDto.java | API 입출력 | - |
| 56 | BE-COOK-056 | Config | 배치 스케줄 설정 | app/.../cook/api/popular/config/BatchSchedulerConfig.java | 인기도 계산 스케줄 | backend/app cook.api.popular |
| 57 | BE-COOK-057 | Constants | 레시피 상수 | app/.../cook/api/recipe/domain/constants/RecipeConstants.java | 레시피 관련 상수 | - |
| 58 | BE-COOK-058 | Enum | 레시피 상태/공개범위 | app/.../cook/api/recipe/domain/enums/Status.java, Visibility.java | 공개/비공개 등 | - |

* 패키지 루트: `app/.../cook/`  
* Entity/DTO/Repository는 동일 기능 단위로 묶어 표기했으며, 상세 파일별 매핑은 소스 트리 기준으로 확인 가능.  
* 인기·배치 관련 코드 위치: `backend/app` 모듈의 `cook.api.popular` (구 cook-service 명칭 폐기).

---

## 2. 프론트엔드 프로그램 목록

* 파일경로 기준: `frontend/src/`

### 2.1 화면 (View)

| No | 프로그램ID | 프로그램명 | 파일경로 | 설명 | 비고 |
|----|------------|------------|----------|------|------|
| 1 | FE-VW-001 | 대시보드 | views/Dashboard.vue | 메인 대시보드 | 라우트: / |
| 2 | FE-VW-002 | 검색 결과 | views/pages/recipe/SearchResult.vue | 레시피 검색 결과 | /recipe/search |
| 3 | FE-VW-003 | 카테고리 | views/pages/recipe/Category.vue | 카테고리별 레시피 | /recipe/category |
| 4 | FE-VW-004 | 레시피 상세 | views/pages/recipe/RecipeDetail.vue | 레시피 상세 조회 | /recipe/:id |
| 5 | FE-VW-005 | 내 레시피 목록 | views/pages/my/Recipes.vue | 내가 작성한 레시피(탭 콘텐츠) | /my?tab=recipes |
| 6 | FE-VW-006 | 레시피 등록 | views/pages/my/RecipeCreate.vue | 새 레시피 등록 폼 | /my/recipes/new |
| 7 | FE-VW-007 | 레시피 수정 | views/pages/my/RecipeEdit.vue | 레시피 수정 폼 | /my/recipes/:id/edit |
| 8 | FE-VW-008 | 마이페이지 | views/pages/my/MyPage.vue | 프로필·댓글·문의·찜·북마크·레시피 탭 | /my |
| 9 | FE-VW-009 | 문의 상세 라우트(리다이렉트) | views/pages/my/MyPage.vue | 문의 상세 경로 → 마이페이지 문의 탭 | /my/inquiries/:id -> /my?tab=inquiries |
| 10 | FE-VW-010 | 북마크 | views/pages/my/Bookmarks.vue | 북마크(레시피북) 관리 | /my (탭) |
| 11 | FE-VW-011 | 관리자 메인 | views/pages/admin/Admin.vue | 관리자 메뉴 진입 | /admin |
| 12 | FE-VW-012 | 재료 그룹 관리 | views/pages/admin/IngredientGroupManagement.vue | 재료 그룹 목록·관리 | /admin/ingredient-groups |
| 13 | FE-VW-013 | 재료 그룹 등록 | views/pages/admin/IngredientGroupRegister.vue | 재료 그룹 등록 | /admin/ingredient-group/register |
| 14 | FE-VW-014 | 재료 등록(관리자) | views/pages/admin/IngredientRegister.vue | 재료 등록 | /admin/ingredient/register |
| 15 | FE-VW-015 | 재료 관리 등록 | views/pages/admin/IngredientManagementRegister.vue | 저장법·손질법 등록 | /admin/ingredient-management/register |
| 16 | FE-VW-016 | 문의 목록(관리자) | views/pages/admin/AdminInquiryList.vue | 1:1 문의 목록·답변 | /admin/inquiries |
| 17 | FE-VW-017 | 공통코드 관리 | views/pages/admin/CommonCodeManagement.vue | 공통코드 CRUD | /admin/common-codes |
| 18 | FE-VW-018 | 재료 관리 | views/pages/ingredient/IngredientManagement.vue | 재료 그룹·재료 조회 | /ingredient/management |
| 19 | FE-VW-019 | 재료 관리 등록(관리자) | views/pages/admin/IngredientManagementRegister.vue | 저장법·손질법 등록(재사용) | /ingredient/management/register |
| 20 | FE-VW-020 | 재료 상세 | views/pages/ingredient/IngredientDetail.vue | 재료 상세(보관·손질) | /ingredient/management/:id |
| 21 | FE-VW-021 | 랭킹 | views/pages/ranking/Ranking.vue | 레시피 랭킹 | /ranking |
| 22 | FE-VW-022 | 고객지원(FAQ 포함) | views/pages/community/CustomerSupport.vue | FAQ 포함 고객지원 화면 | /support |
| 23 | FE-VW-023 | 회원 프로필 | views/pages/member/MemberProfile.vue | 다른 회원 프로필·레시피·팔로우 | /member/:id |
| 24 | FE-VW-024 | 팔로잉 피드 | views/pages/feed/FollowingFeed.vue | 팔로우한 회원 레시피 | /feed/following |
| 25 | FE-VW-025 | 로그인 | views/pages/auth/Login.vue | 로그인(소셜·테스트) | /auth/login |
| 26 | FE-VW-026 | OAuth 콜백 공통(미라우팅) | views/pages/auth/OAuthCallback.vue | 개별 provider 콜백에서 공통 처리 | 직접 라우트 없음 |
| 27 | FE-VW-027 | 네이버 콜백 | views/pages/auth/NaverCallback.vue | 네이버 OAuth 콜백 | /auth/naver/callback |
| 28 | FE-VW-028 | 구글 콜백 | views/pages/auth/GoogleCallback.vue | 구글 OAuth 콜백 | /auth/google/callback |
| 29 | FE-VW-029 | 카카오 콜백 | views/pages/auth/KakaoCallback.vue | 카카오 OAuth 콜백 | /auth/kakao/callback |
| 30 | FE-VW-030 | 프로필(내) | views/pages/my/Profile.vue | 내 프로필 수정(마이페이지 탭) | /my?tab=profile |
| 31 | FE-VW-031 | 내 댓글 | views/pages/my/Comments.vue | 내 댓글 목록 | /my?tab=comments |
| 32 | FE-VW-032 | 내 문의 | views/pages/my/Inquiries.vue | 내 1:1 문의 목록 | /my?tab=inquiries |
| 33 | FE-VW-033 | 찜 목록 | views/pages/my/Favorites.vue | 찜한 레시피 목록 | /my?tab=favorites |
| 34 | FE-VW-034 | 404 | views/pages/error/NotFound.vue | 페이지 없음 | /error/notfound |
| 35 | FE-VW-035 | 접근 거부 | views/pages/error/Access.vue | 403 | /error/access |
| 36 | FE-VW-036 | 오류 | views/pages/error/Error.vue | 일반 오류 | /error/error |

### 2.2 레이아웃·루트

| No | 프로그램ID | 프로그램명 | 파일경로 | 설명 | 비고 |
|----|------------|------------|----------|------|------|
| 1 | FE-LAY-001 | 앱 루트 | App.vue | 루트 컴포넌트·전역 토스트 | - |
| 2 | FE-LAY-002 | 공통 레이아웃 | layout/AppLayout.vue | 헤더·네비·자식 라우트 | - |
| 3 | FE-LAY-003 | 상단바 | layout/AppTopbar.vue | 상단 네비게이션 | - |
| 4 | FE-LAY-004 | 푸터 | layout/AppFooter.vue | 하단 푸터 | - |

### 2.3 컴포넌트 (Component)

| No | 프로그램ID | 프로그램명 | 파일경로 | 설명 | 비고 |
|----|------------|------------|----------|------|------|
| 1 | FE-CMP-001 | 페이지 상태 블록 | components/common/PageStateBlock.vue | 로딩·빈 목록·에러 UI | - |
| 2 | FE-CMP-002 | 토스트 | components/common/AppToast.vue | 전역 토스트 | - |
| 3 | FE-CMP-003 | 스크롤 상단 | components/ScrollToTop.vue | 라우트 변경 시 스크롤 상단 | - |
| 4 | FE-CMP-004 | 북마크 다이얼로그 | components/bookmark/BookmarkDialog.vue | 북마크 추가/이동 | - |
| 5 | FE-CMP-005 | 레시피북 폼 다이얼로그 | components/bookmark/RecipeBookFormDialog.vue | 레시피북 생성/수정 | - |
| 6 | FE-CMP-006 | 책형 북마크 뷰 | components/bookmark/OpenBookView.vue | 북마크 책 형태 표시 | - |
| 7 | FE-CMP-007 | 책 프레임 | components/bookmark/BookFrame.vue | 책 좌우 페이지 프레임 | - |
| 8 | FE-CMP-008 | 책 페이지 | components/bookmark/BookPage.vue | 책 한쪽 페이지 | - |
| 9 | FE-CMP-009 | 북마크 메모 다이얼로그 | components/bookmark/BookmarkMemoDialog.vue | 북마크 메모 입력/수정 | - |
| 10 | FE-CMP-010 | 레시피 그리드 카드 | components/recipe/RecipeGridCard.vue | 그리드용 레시피 카드 | - |
| 11 | FE-CMP-011 | 레시피 카드 | components/recipe/RecipeCard.vue | 리스트/피드용 카드 | - |
| 12 | FE-CMP-012 | 레시피 상세 헤더 | components/recipe/RecipeDetailHeader.vue | 상세 상단(제목·북마크·통계) | - |
| 13 | FE-CMP-013 | 레시피 상세 갤러리 | components/recipe/RecipeDetailGallery.vue | 상세 이미지 갤러리 | - |
| 14 | FE-CMP-014 | 레시피 상세 재료 | components/recipe/RecipeDetailIngredients.vue | 재료 목록 | - |
| 15 | FE-CMP-015 | 레시피 상세 조리순서 | components/recipe/RecipeDetailSteps.vue | 조리 순서 | - |
| 16 | FE-CMP-016 | 레시피 댓글 | components/recipe/RecipeComments.vue | 댓글 목록·작성 | - |
| 17 | FE-CMP-017 | 레시피 폼 기본정보 | components/recipe/form/RecipeFormBasicInfo.vue | 제목·설명·썸네일 | - |
| 18 | FE-CMP-018 | 레시피 폼 분류 | components/recipe/form/RecipeFormClassification.vue | 카테고리 등 | - |
| 19 | FE-CMP-019 | 레시피 폼 재료 | components/recipe/form/RecipeFormIngredients.vue | 재료 입력 | - |
| 20 | FE-CMP-020 | 레시피 폼 조리순서 | components/recipe/form/RecipeFormSteps.vue | 조리 순서 입력 | - |
| 21 | FE-CMP-021 | 인기 레시피 | components/dashboard/PopularRecipes.vue | 인기 레시피 섹션 | - |
| 22 | FE-CMP-022 | 최근 본 레시피 | components/dashboard/RecentViews.vue | 최근 본 섹션 | - |
| 23 | FE-CMP-023 | 오늘의 추천 | components/dashboard/TodayRecommendations.vue | 오늘의 추천 섹션 | - |
| 24 | FE-CMP-024 | 추천 크리에이터 | components/dashboard/RecommendedCreators.vue | 추천 크리에이터 섹션 | - |
| 25 | FE-CMP-025 | 팔로우 목록 다이얼로그 | components/follow/FollowListDialog.vue | 팔로워/팔로잉 목록 | - |
| 26 | FE-CMP-026 | 문의 폼 다이얼로그 | components/inquiry/InquiryFormDialog.vue | 1:1 문의 작성/수정 | - |
| 27 | FE-CMP-027 | 문의 상세 다이얼로그 | components/inquiry/InquiryDetailDialog.vue | 1:1 문의 상세·답변 | - |
| 28 | FE-CMP-028 | 재료 목록 | components/ingredient/IngredientList.vue | 재료 그룹·재료 목록 | - |
| 29 | FE-CMP-029 | 재료 그룹 선택 | components/ingredient/IngredientGroupSelector.vue | 그룹 선택 UI | - |
| 30 | FE-CMP-030 | 재료 그리드 | components/ingredient/IngredientGrid.vue | 재료 카드 그리드 | - |
| 31 | FE-CMP-031 | 재료 카드 | components/ingredient/IngredientCard.vue | 재료 한 건 카드 | - |
| 32 | FE-CMP-032 | Toast UI 에디터 | components/editor/ToastUiEditor.vue | 저장법·손질법 등 입력 | - |
| 33 | FE-CMP-033 | Toast UI 뷰어 | components/editor/ToastUiViewer.vue | 본문 뷰어 | - |
| 34 | FE-CMP-034 | FAQ | components/community/FAQ.vue | FAQ 목록 UI | - |
| 35 | FE-CMP-035 | 소셜 로그인 버튼 | components/SocialLoginButtons.vue | 네이버·구글·카카오 | - |

### 2.4 API·스토어·유틸·타입·데이터

| No | 프로그램ID | 구분 | 프로그램명 | 파일경로 | 설명 | 비고 |
|----|------------|------|------------|----------|------|------|
| 1 | FE-API-001 | 진입점 | 메인 | main.ts | Vue 앱 마운트·라우터·Pinia | - |
| 2 | FE-API-002 | 라우터 | 라우트 정의 | router/index.ts | 라우트 설정 | - |
| 3 | FE-API-003 | API | 인증 API | api/authApi.ts | 로그인·로그아웃·리프레시·토큰 | - |
| 4 | FE-API-004 | API | 회원 API | api/memberApi.ts | 내 정보·프로필·수정·탈퇴 | - |
| 5 | FE-API-005 | API | 팔로우 API | api/followApi.ts | 팔로우·팔로워·팔로잉 | - |
| 6 | FE-API-006 | API | 문의 API | api/inquiryApi.ts | 문의 CRUD | - |
| 7 | FE-API-007 | API | 레시피 API | api/recipeApi.ts | 레시피 CRUD·목록·인기·피드 | - |
| 8 | FE-API-008 | API | 북마크 API | api/bookmarkApi.ts | 레시피북·북마크·메모 | - |
| 9 | FE-API-009 | API | 검색 API | api/searchApi.ts | 레시피 검색 | - |
| 10 | FE-API-010 | API | 크리에이터 API | api/creatorApi.ts | 추천 크리에이터 | - |
| 11 | FE-API-011 | API | 추천 API | api/recommendationApi.ts | 오늘의 추천 | - |
| 12 | FE-API-012 | API | 레시피 조회 API | api/recipeViewApi.ts | 조회 등록·최근 본 | - |
| 13 | FE-API-013 | API | 재료 API | api/ingredientApi.ts | 재료 그룹·재료·보관·손질 | - |
| 14 | FE-API-014 | API | 공통코드 API | api/commonCodeApi.ts | 공통코드 조회 | - |
| 15 | FE-STORE-001 | Store | 인증 스토어 | stores/authStore.ts | 로그인 상태·토큰 | - |
| 16 | FE-UTIL-001 | Utils | HTTP 클라이언트 | utils/http.ts | axios 인스턴스·인터셉터 | - |
| 17 | FE-UTIL-002 | Utils | 인증 유틸 | utils/auth.ts | 토큰·로그인 여부 | - |
| 18 | FE-UTIL-003 | Utils | OAuth 유틸 | utils/oauth.ts | OAuth URL·콜백 처리 | - |
| 19 | FE-UTIL-004 | Utils | 토스트 | utils/toast.ts | 토스트 표시 | - |
| 20 | FE-UTIL-005 | Utils | 에러 핸들러 | utils/errorHandler.ts | API 에러 공통 처리 | - |
| 21 | FE-UTIL-006 | Utils | 전역 에러 핸들러 | utils/globalErrorHandler.ts | 미처리 예외 등 | - |
| 22 | FE-UTIL-007 | Utils | 검색 유틸 | utils/search.ts | 검색 파라미터 등 | - |
| 23 | FE-UTIL-008 | Utils | 상수 | utils/constants.ts | 앱 공통 상수 | - |
| 24 | FE-UTIL-009 | Utils | 이미지 유틸 | utils/image.ts | 이미지 URL·처리 | - |
| 25 | FE-UTIL-010 | Utils | 마스킹 유틸 | utils/mask.ts | 화면용 마스킹 | - |
| 26 | FE-TYPE-001 | Types | 인증 타입 | types/auth.ts | - | - |
| 27 | FE-TYPE-002 | Types | 프로필 타입 | types/profile.ts | - | - |
| 28 | FE-TYPE-003 | Types | 레시피 타입 | types/recipe.ts | - | - |
| 29 | FE-TYPE-004 | Types | 레시피 폼 타입 | types/recipeForm.ts | - | - |
| 30 | FE-TYPE-005 | Types | 카테고리 타입 | types/category.ts | - | - |
| 31 | FE-TYPE-006 | Types | 북마크 타입 | types/bookmark.ts | - | - |
| 32 | FE-TYPE-007 | Types | 크리에이터 타입 | types/creator.ts | - | - |
| 33 | FE-TYPE-008 | Types | 팔로우 타입 | types/follow.ts | - | - |
| 34 | FE-TYPE-009 | Types | 문의 타입 | types/inquiry.ts | - | - |
| 35 | FE-TYPE-010 | Types | 재료 타입 | types/ingredient.ts | - | - |
| 36 | FE-TYPE-011 | Types | 공통 타입 | types/common.ts | - | - |
| 37 | FE-TYPE-012 | Types | FAQ 타입 | types/faq.ts | - | - |
| 38 | FE-TYPE-013 | Types | 레시피 카테고리 타입 | types/recipeCategory.ts | - | - |
| 39 | FE-TYPE-014 | Types | 라우터 타입 | types/router.d.ts | 라우트 meta 등 | - |
| 40 | FE-DATA-001 | Data | 레시피 카테고리 데이터 | data/recipeCategoryData.ts | 카테고리 코드 등 | - |
| 41 | FE-DATA-002 | Data | FAQ 데이터 | data/faqData.ts | FAQ 목록(정적) | - |
| 42 | - | Types | 환경 타입 | env.d.ts | Vue·env 타입 선언 | - |

---

## 부록 A. 백엔드 API 목록 요약

| No | 서비스 | Controller | Base Path | 주요 메서드(요청 경로) |
|----|--------|------------|-----------|-------------------------|
| 1 | auth | AuthController | /api/auth | GET /oauth/state, /naver/callback, /google/callback, /kakao/callback, POST /logout, /refresh, GET /jwt/token, POST /test/login, GET /test/accounts |
| 2 | common | HealthController | /health | GET / |
| 3 | cook | CommonCodeController | /api/cook/common-codes | 공통코드 조회 |
| 4 | cook | AdminCommonCodeController | /api/cook/admin/common-codes | GET/POST, GET/PUT/DELETE /{codeId}, POST /{codeId}/details, PUT/DELETE /{codeId}/details/{detailCodeId} |
| 5 | member | MemberController | /api/member | GET /me, /{memberId}, DELETE /me, PUT /profile |
| 6 | member | FollowController | /api/member | POST/DELETE /follows/{memberId}, GET /follows/{memberId}/check, GET /{memberId}/followers, /{memberId}/followings |
| 7 | member | InquiryController | /api/member/inquiries | POST, GET /my, /{id}, PUT /{id}, DELETE /{id}, GET /admin, /admin/{id}, POST /{id}/reply |
| 8 | cook | RecipeController | /api/cook/recipe | POST, GET /list/member/{memberId}, /list/all, /{id}, PUT /{id}, DELETE /{id}, GET /popular, /following-feed |
| 9 | cook | RecipeCommentController | /api/cook/recipe/comments | POST /{recipeId}, /{recipeId}/with-image, GET /member/{memberId}, /{recipeId}, /{recipeId}/page, PUT /{commentId}, /{commentId}/with-image, DELETE /{commentId}, GET /{recipeId}/count |
| 10 | cook | RecipeBookmarkController | /api/cook/recipe/bookmarks | GET /recipe-books/{recipeBookId}/bookmarks, /check/{recipeId}, POST /, DELETE / (query), PUT /{bookmarkId}/move, /{bookmarkId}/memo |
| 11 | cook | RecipeBookController | /api/cook/recipe/bookmarks/recipe-books | GET /, POST /, PUT /{recipeBookId}, DELETE /{recipeBookId}, PUT /reorder, POST /default |
| 12 | cook | RecipeViewController | /api/cook | POST /recipes/{recipeId}/view, GET /members/{memberId}/recent-views, DELETE /members/{memberId}/recent-views |
| 13 | cook | RecipeFavoriteController | /api/cook/recipe/favorites | GET /{memberId}, POST /, DELETE /, PUT /toggle, GET /check, /count/{recipeId} |
| 14 | cook | CreatorController | /api/cook/creators | GET /recommended |
| 15 | cook | SearchController | /api/cook/search | GET /recipes |
| 16 | cook | RecommendationController | /api/cook/recipes/recommendations | GET /today |
| 17 | cook | IngredientController | /api/cook/ingredients | GET /groups, /, /{ingredientId}/storage, /{ingredientId}/preparation |
| 18 | cook | AdminIngredientController | /api/cook/admin/ingredients | POST /groups, PUT/DELETE /groups/{id}, PUT/DELETE /{id}, POST /storage, /preparation, PUT/DELETE 등, POST /upload-image |

---

## 부록 B. 프론트엔드 화면(라우트) 요약

ui-list.md No.1~30 과 동일 번호.

| No | path | name | View 컴포넌트 |
|----|------|------|----------------|
| 1 | / | dashboard | Dashboard.vue |
| 2 | /recipe/search | searchResult | SearchResult.vue |
| 3 | /recipe/category | category | Category.vue |
| 4 | /recipe/:id | recipeDetail | RecipeDetail.vue |
| 5 | /my/recipes | myRecipes (redirect) | MyPage.vue |
| 6 | /my/recipes/new | myRecipeCreate | RecipeCreate.vue |
| 7 | /my/recipes/:id/edit | myRecipeEdit | RecipeEdit.vue |
| 8 | /my | mypage | MyPage.vue |
| 9 | /my/inquiries/:id | (redirect) | MyPage.vue |
| 10 | /admin | admin | Admin.vue |
| 11 | /admin/ingredient-groups | adminIngredientGroupManagement | IngredientGroupManagement.vue |
| 12 | /admin/ingredient-group/register | adminIngredientGroupRegister | IngredientGroupRegister.vue |
| 13 | /admin/ingredient/register | adminIngredientRegister | IngredientRegister.vue |
| 14 | /admin/ingredient-management/register | adminIngredientManagementRegister | IngredientManagementRegister.vue |
| 15 | /admin/inquiries | adminInquiryList | AdminInquiryList.vue |
| 16 | /admin/common-codes | adminCommonCodeManagement | CommonCodeManagement.vue |
| 17 | /ingredient/management | ingredientManagement | IngredientManagement.vue |
| 18 | /ingredient/management/register | ingredientRegister | IngredientManagementRegister.vue |
| 19 | /ingredient/management/:id | ingredientDetail | IngredientDetail.vue |
| 20 | /ranking | ranking | Ranking.vue |
| 21 | /support | customerSupport | CustomerSupport.vue |
| 22 | /member/:id | memberProfile | MemberProfile.vue |
| 23 | /feed/following | followingFeed | FollowingFeed.vue |
| 24 | /auth/login | login | Login.vue |
| 25 | /auth/naver/callback | naverCallback | NaverCallback.vue |
| 26 | /auth/google/callback | googleCallback | GoogleCallback.vue |
| 27 | /auth/kakao/callback | kakaoCallback | KakaoCallback.vue |
| 28 | /error/notfound | notfound | NotFound.vue |
| 29 | /error/access | accessDenied | Access.vue |
| 30 | /error/error | error | Error.vue |

* `/my/recipes`, `/my/profile`, `/my/comments`, `/my/inquiries`, `/my/favorites` 는 `/my?tab=...` 로 리다이렉트됨.
* `/community/faq` 는 `/support` 로 리다이렉트됨.
* `/ranking/weekly`, `/ranking/monthly` 는 `/ranking?period=...` 로 리다이렉트됨.
* `OAuthCallback.vue`는 공통 콜백 유틸용이며 라우트에 직접 등록되지 않음.

---

## 부록 C. 배치·스케줄 (참고)

- **인기 레시피 점수 계산**: `PopularityCalculationService.calculateAllPopularityScores()` — 매 시 정각 (`0 0 * * * *`)
- **순위 추적**: `PopularityCalculationService.trackRankingChanges()` — 동일 스케줄에서 연속 실행

스케줄 설정: `app/.../cook/api/popular/config/BatchSchedulerConfig.java` (`backend/app` · `cook.api.popular`)

---

## 부록 D. 삭제됨 (2026-08-29)

메인 테이블에서 제거한 항목. 참고용 목록만 유지.

| 구분 | 삭제 항목(예시) |
|------|-----------------|
| Backend cook | CategoryController, CategoryService, ThemeCollectionController, AdminThemeCollectionController, ThemeCollectionService, IngredientRequestController, IngredientRequestService, theme/entity·repository |
| Frontend View | IngredientRequestList.vue |
| Frontend Component | RecipeListItem.vue, ThemeCollections.vue, CategorySections.vue, CategorySection.vue |
| Frontend API/Type | categoryApi.ts, themeApi.ts, types/theme.ts |
