/**
 * 공통 상수 정의
 */

/**
 * 가이드 이미지 경로 매핑
 */
export const GUIDE_IMAGES: Record<string, string> = {
    basic: '/guide/Guide_01.png',
    ingredients: '/guide/Guide_02.png',
    classification: '/guide/Guide_03.png',
    steps: '/guide/Guide_04.png',
    settings: '/guide/Guide_05.png'
};

/**
 * API Base URL
 * - 우선 VITE_API_BASE_URL (빌드 시 주입)
 * - 개발 모드에서 비어 있으면 http://localhost:8080
 * - 운영 빌드에서 비어 있으면 빈 문자열 (배포 변수 누락을 localhost로 숨기지 않음)
 */
export function getApiBaseUrl(): string {
    const fromEnv = import.meta.env.VITE_API_BASE_URL;
    const trimmed = typeof fromEnv === 'string' ? fromEnv.trim() : '';
    if (trimmed !== '') {
        return trimmed;
    }

    if (import.meta.env.PROD) {
        return '';
    }

    return 'http://localhost:8080';
}
