import { getApiBaseUrl } from '@/utils/constants';

/**
 * 레시피 썸네일 기본 이미지 (public 폴더)
 * 컴포넌트마다 /placeholder-recipe.jpg, /images/default-recipe.png 등으로 흩어져 있던 참조를 하나로 통일.
 */
export const RECIPE_DEFAULT_IMAGE = '/placeholder-recipe.svg';

/**
 * 백엔드에서 받아온 이미지 URL을 <img src>에 사용할 수 있는 절대 URL로 정규화한다.
 *
 * - 없거나 빈 문자열 → fallback 반환
 * - http://, https://, data:, blob: → 그대로 (외부 CDN/데이터 URL)
 * - 그 외(('/uploads/...' 같은 상대경로)) → API BASE URL 앞에 결합
 *   (개발 모드에서는 http://localhost:8080, 운영에서는 VITE_API_BASE_URL)
 */
export function resolveMediaUrl(url: string | null | undefined, fallback?: string): string {
    if (url && /^(https?:)?\/\/|^data:|^blob:/i.test(url)) {
        return url;
    }
    if (url && url.trim() !== '') {
        return `${getApiBaseUrl()}${url}`;
    }
    return fallback ?? '';
}

/** 레시피 썸네일 URL 정규화 (없으면 기본 이미지) */
export function resolveRecipeImage(thumbnail: string | null | undefined): string {
    return resolveMediaUrl(thumbnail, RECIPE_DEFAULT_IMAGE);
}

/** 프로필 이미지 URL 정규화 (없으면 빈 문자열 → 컴포넌트에서 v-if로 아이콘 처리) */
export function resolveProfileImage(profileImage: string | null | undefined): string {
    return resolveMediaUrl(profileImage, '');
}
