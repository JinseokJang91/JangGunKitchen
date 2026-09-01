# API 목록

**작성 기준**: 백엔드 Controller 코드 분석 (2026-09-01)  
**대상**: `backend/app` 단일 Spring Boot 애플리케이션  
**표기**: 「도메인」열은 HTTP prefix/패키지 경계(`auth` / `member` / `cook` / `common`)이며, 별도 배포 프로세스가 아니다.

본 애플리케이션에 구현된 REST API Endpoint를 정리한 목록입니다.

---

## 1. API 목록 테이블

| No | 도메인 | HTTP Method | 요청 경로 | Controller | 비고 |
|----|--------|-------------|-----------|------------|------|
| 1 | auth | GET | /api/auth/oauth/state | AuthController | OAuth state 발급 |
| 2 | auth | GET | /api/auth/naver/callback | AuthController | 네이버 로그인 콜백 |
| 3 | auth | GET | /api/auth/google/callback | AuthController | 구글 로그인 콜백 |
| 4 | auth | GET | /api/auth/kakao/callback | AuthController | 카카오 로그인 콜백 |
| 5 | auth | POST | /api/auth/logout | AuthController | 로그아웃 |
| 6 | auth | POST | /api/auth/refresh | AuthController | 토큰 갱신 |
| 7 | auth | GET | /api/auth/jwt/token | AuthController | JWT 토큰 조회 |
| 8 | auth | POST | /api/auth/test/login | AuthController | 테스트 로그인 |
| 9 | auth | GET | /api/auth/test/accounts | AuthController | 테스트 계정 목록 |
| 10 | cook | GET | /api/cook/common-codes | CommonCodeController | 공통코드 목록 조회 |
| 11 | cook | GET | /api/cook/admin/common-codes | AdminCommonCodeController | 공통코드 목록(관리자) |
| 12 | cook | GET | /api/cook/admin/common-codes/{codeId} | AdminCommonCodeController | 공통코드 상세(관리자) |
| 13 | cook | POST | /api/cook/admin/common-codes | AdminCommonCodeController | 공통코드 등록 |
| 14 | cook | PUT | /api/cook/admin/common-codes/{codeId} | AdminCommonCodeController | 공통코드 수정 |
| 15 | cook | DELETE | /api/cook/admin/common-codes/{codeId} | AdminCommonCodeController | 공통코드 삭제 |
| 16 | cook | POST | /api/cook/admin/common-codes/{codeId}/details | AdminCommonCodeController | 상세코드 등록 |
| 17 | cook | PUT | /api/cook/admin/common-codes/{codeId}/details/{detailCodeId} | AdminCommonCodeController | 상세코드 수정 |
| 18 | cook | DELETE | /api/cook/admin/common-codes/{codeId}/details/{detailCodeId} | AdminCommonCodeController | 상세코드 삭제 |
| 19 | member | GET | /api/member/me | MemberController | 내 정보 조회 |
| 20 | member | GET | /api/member/{memberId} | MemberController | 회원 정보 조회 |
| 21 | member | DELETE | /api/member/me | MemberController | 회원 탈퇴 |
| 22 | member | PUT | /api/member/profile | MemberController | 프로필 수정(멀티파트) |
| 23 | member | POST | /api/member/follows/{memberId} | FollowController | 팔로우 |
| 24 | member | DELETE | /api/member/follows/{memberId} | FollowController | 언팔로우 |
| 25 | member | GET | /api/member/follows/{memberId}/check | FollowController | 팔로우 여부 확인 |
| 26 | member | GET | /api/member/{memberId}/followers | FollowController | 팔로워 목록 |
| 27 | member | GET | /api/member/{memberId}/followings | FollowController | 팔로잉 목록 |
| 28 | member | POST | /api/member/inquiries | InquiryController | 문의 등록(멀티파트) |
| 29 | member | GET | /api/member/inquiries/my | InquiryController | 내 문의 목록 |
| 30 | member | GET | /api/member/inquiries/{id} | InquiryController | 문의 상세 |
| 31 | member | PUT | /api/member/inquiries/{id} | InquiryController | 문의 수정(멀티파트) |
| 32 | member | DELETE | /api/member/inquiries/{id} | InquiryController | 문의 삭제 |
| 33 | member | GET | /api/member/inquiries/admin | InquiryController | 문의 목록(관리자) |
| 34 | member | GET | /api/member/inquiries/admin/{id} | InquiryController | 문의 상세(관리자) |
| 35 | member | POST | /api/member/inquiries/{id}/reply | InquiryController | 문의 답변 등록 |
| 36 | cook | POST | /api/cook/recipe | RecipeController | 레시피 등록(멀티파트) |
| 37 | cook | GET | /api/cook/recipe/list/member/{memberId} | RecipeController | 회원별 레시피 목록 |
| 38 | cook | GET | /api/cook/recipe/list/all | RecipeController | 레시피 전체 목록 |
| 39 | cook | GET | /api/cook/recipe/{id} | RecipeController | 레시피 상세 |
| 40 | cook | PUT | /api/cook/recipe/{id} | RecipeController | 레시피 수정(멀티파트) |
| 41 | cook | DELETE | /api/cook/recipe/{id} | RecipeController | 레시피 삭제 |
| 42 | cook | GET | /api/cook/recipe/popular | RecipeController | 인기 레시피 목록 |
| 43 | cook | GET | /api/cook/recipe/following-feed | RecipeController | 팔로잉 피드 |
| 44 | cook | POST | /api/cook/recipe/comments/{recipeId} | RecipeCommentController | 댓글 등록 |
| 45 | cook | POST | /api/cook/recipe/comments/{recipeId}/with-image | RecipeCommentController | 댓글 등록(이미지) |
| 46 | cook | GET | /api/cook/recipe/comments/member/{memberId} | RecipeCommentController | 회원별 댓글 목록 |
| 47 | cook | GET | /api/cook/recipe/comments/{recipeId} | RecipeCommentController | 레시피 댓글 목록 |
| 48 | cook | GET | /api/cook/recipe/comments/{recipeId}/page | RecipeCommentController | 레시피 댓글 페이징 |
| 49 | cook | PUT | /api/cook/recipe/comments/{commentId} | RecipeCommentController | 댓글 수정 |
| 50 | cook | PUT | /api/cook/recipe/comments/{commentId}/with-image | RecipeCommentController | 댓글 수정(이미지) |
| 51 | cook | DELETE | /api/cook/recipe/comments/{commentId} | RecipeCommentController | 댓글 삭제 |
| 52 | cook | GET | /api/cook/recipe/comments/{recipeId}/count | RecipeCommentController | 댓글 개수 |
| 53 | cook | GET | /api/cook/recipe/bookmarks/recipe-books/{recipeBookId}/bookmarks | RecipeBookmarkController | 레시피북별 북마크 조회 |
| 54 | cook | POST | /api/cook/recipe/bookmarks | RecipeBookmarkController | 북마크 추가 |
| 55 | cook | DELETE | /api/cook/recipe/bookmarks | RecipeBookmarkController | 북마크 제거(Query: recipeBookId, recipeId) |
| 56 | cook | GET | /api/cook/recipe/bookmarks/check/{recipeId} | RecipeBookmarkController | 북마크 여부 확인 |
| 57 | cook | PUT | /api/cook/recipe/bookmarks/{bookmarkId}/move | RecipeBookmarkController | 북마크 이동 |
| 58 | cook | PUT | /api/cook/recipe/bookmarks/{bookmarkId}/memo | RecipeBookmarkController | 북마크 메모 수정 |
| 59 | cook | GET | /api/cook/recipe/bookmarks/recipe-books | RecipeBookController | 레시피북 목록 |
| 60 | cook | POST | /api/cook/recipe/bookmarks/recipe-books | RecipeBookController | 레시피북 생성 |
| 61 | cook | PUT | /api/cook/recipe/bookmarks/recipe-books/{recipeBookId} | RecipeBookController | 레시피북 수정 |
| 62 | cook | DELETE | /api/cook/recipe/bookmarks/recipe-books/{recipeBookId} | RecipeBookController | 레시피북 삭제 |
| 63 | cook | PUT | /api/cook/recipe/bookmarks/recipe-books/reorder | RecipeBookController | 레시피북 순서 변경 |
| 64 | cook | POST | /api/cook/recipe/bookmarks/recipe-books/default | RecipeBookController | 기본 레시피북 생성 |
| 65 | cook | POST | /api/cook/recipes/{recipeId}/view | RecipeViewController | 레시피 조회 기록 등록 |
| 66 | cook | GET | /api/cook/members/{memberId}/recent-views | RecipeViewController | 최근 조회 목록 |
| 67 | cook | DELETE | /api/cook/members/{memberId}/recent-views | RecipeViewController | 최근 조회 삭제 |
| 68 | cook | GET | /api/cook/recipe/favorites/{memberId} | RecipeFavoriteController | 회원별 즐겨찾기 목록 |
| 69 | cook | POST | /api/cook/recipe/favorites | RecipeFavoriteController | 즐겨찾기 추가 |
| 70 | cook | DELETE | /api/cook/recipe/favorites | RecipeFavoriteController | 즐겨찾기 제거 |
| 71 | cook | PUT | /api/cook/recipe/favorites/toggle | RecipeFavoriteController | 즐겨찾기 토글 |
| 72 | cook | GET | /api/cook/recipe/favorites/check | RecipeFavoriteController | 즐겨찾기 여부 확인 |
| 73 | cook | GET | /api/cook/recipe/favorites/count/{recipeId} | RecipeFavoriteController | 레시피별 즐겨찾기 수 |
| 74 | cook | GET | /api/cook/creators/recommended | CreatorController | 추천 크리에이터 |
| 75 | cook | GET | /api/cook/search/recipes | SearchController | 레시피 검색 |
| 76 | cook | GET | /api/cook/recipes/recommendations/today | RecommendationController | 오늘의 추천 레시피 |
| 77 | cook | GET | /api/cook/ingredients/groups | IngredientController | 재료 그룹 목록 |
| 78 | cook | GET | /api/cook/ingredients | IngredientController | 재료 목록 |
| 79 | cook | GET | /api/cook/ingredients/{ingredientId}/storage | IngredientController | 보관법 목록 |
| 80 | cook | GET | /api/cook/ingredients/{ingredientId}/preparation | IngredientController | 손질법 목록 |
| 81 | cook | POST | /api/cook/admin/ingredients/groups | AdminIngredientController | 재료 그룹 등록 |
| 82 | cook | POST | /api/cook/admin/ingredients | AdminIngredientController | 재료 등록 |
| 83 | cook | PUT | /api/cook/admin/ingredients/groups/{id} | AdminIngredientController | 재료 그룹 수정 |
| 84 | cook | DELETE | /api/cook/admin/ingredients/groups/{id} | AdminIngredientController | 재료 그룹 삭제 |
| 85 | cook | PUT | /api/cook/admin/ingredients/{id} | AdminIngredientController | 재료 수정 |
| 86 | cook | DELETE | /api/cook/admin/ingredients/{id} | AdminIngredientController | 재료 삭제 |
| 87 | cook | POST | /api/cook/admin/ingredients/storage | AdminIngredientController | 보관법 등록 |
| 88 | cook | POST | /api/cook/admin/ingredients/preparation | AdminIngredientController | 손질법 등록 |
| 89 | cook | PUT | /api/cook/admin/ingredients/storage/{id} | AdminIngredientController | 보관법 수정 |
| 90 | cook | PUT | /api/cook/admin/ingredients/preparation/{id} | AdminIngredientController | 손질법 수정 |
| 91 | cook | POST | /api/cook/admin/ingredients/upload-image | AdminIngredientController | 재료 이미지 업로드 |
| 92 | cook | DELETE | /api/cook/admin/ingredients/storage/{id} | AdminIngredientController | 보관법 삭제 |
| 93 | cook | DELETE | /api/cook/admin/ingredients/preparation/{id} | AdminIngredientController | 손질법 삭제 |
| 94 | common | GET | /health | HealthController | 헬스체크 |

---

## 2. 도메인별 요약

| 도메인 | 엔드포인트 수 | 설명 |
|--------|----------------|------|
| auth | 9 | 인증(OAuth state, 소셜 로그인, 로그아웃, 토큰 갱신, 테스트) |
| member | 17 | 회원(탈퇴 포함), 팔로우, 문의 |
| cook | 67 | 공통코드, 레시피, 댓글, 북마크, 조회기록, 즐겨찾기, 크리에이터, 검색, 추천, 재료, 관리자 재료 |
| common | 1 | 헬스체크 |

**총 94개 엔드포인트**

---

## 3. 참고
- 테마 컬렉션·재료 정보 요청·트렌딩 카테고리 API는 2026-08-29 삭제됨(본 목록에 없음)
