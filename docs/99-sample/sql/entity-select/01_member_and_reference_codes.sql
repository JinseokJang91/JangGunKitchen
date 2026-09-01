-- =============================================================================
-- 회원·소셜·공통코드 (common 도메인 엔티티)
-- Member, Follow, CommonCode, CommonCodeDetail
-- 대상 DB: PostgreSQL (JangGunKitchen / Flyway V1+V2 기준, member.role 포함)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Entity: Member → member
-- -----------------------------------------------------------------------------
SELECT id,
       name,
       nickname,
       phone,
       email,
       active,
       birth,
       gender,
       social_role,
       role,
       profile_image,
       bio,
       follower_count,
       following_count,
       created_at,
       updated_at
FROM member;

-- -----------------------------------------------------------------------------
-- Entity: Follow → follow
-- -----------------------------------------------------------------------------
SELECT id,
       follower_id,
       following_id,
       created_at
FROM follow;

-- -----------------------------------------------------------------------------
-- Entity: CommonCode → common_code
-- -----------------------------------------------------------------------------
SELECT code_id,
       code_group,
       code_name,
       use_yn,
       created_at,
       updated_at
FROM common_code;

-- -----------------------------------------------------------------------------
-- Entity: CommonCodeDetail → common_code_detail
-- -----------------------------------------------------------------------------
SELECT code_id,
       detail_code_id,
       code_name,
       sort,
       use_yn,
       created_at,
       updated_at
FROM common_code_detail;
