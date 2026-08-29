package com.janggunkitchen.common.security;

/**
 * Access Token 블랙리스트(로그아웃된 토큰) 조회용 인터페이스.
 */
public interface TokenBlacklistChecker {

    /**
     * 토큰이 블랙리스트에 등록되어 있는지 확인합니다.
     * @param token Access Token 문자열
     * @return 블랙리스트에 있으면 true
     */
    boolean isBlacklisted(String token);
}
