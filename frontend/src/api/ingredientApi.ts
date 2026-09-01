import { httpJson, httpForm } from '@/utils/http';
import { getApiBaseUrl } from '@/utils/constants';
import type { IngredientGroup, Ingredient, IngredientStorage, IngredientPreparation } from '@/types/ingredient';

const BASE_URL = getApiBaseUrl();

export interface IngredientListResponse {
    groups: IngredientGroup[];
    ingredients: Ingredient[];
    totalCount: number;
}

/**
 * 재료 그룹 목록 조회
 */
export async function getIngredientGroups(): Promise<IngredientGroup[]> {
    const response = await httpJson<{ groups?: IngredientGroup[] }>(BASE_URL, '/api/cook/ingredients/groups', { method: 'GET' });
    return response.groups || [];
}

/**
 * 재료 목록 조회
 * @param params.type 'storage' = 보관법 등록된 재료만, 'preparation' = 손질법 등록된 재료만, 미지정 = 전체
 */
export async function getIngredients(params?: { groupId?: number; searchQuery?: string; type?: 'storage' | 'preparation'; limit?: number; offset?: number }): Promise<IngredientListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.groupId) queryParams.append('groupId', params.groupId.toString());
    if (params?.searchQuery) queryParams.append('searchQuery', params.searchQuery);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const response = await httpJson<IngredientListResponse>(BASE_URL, `/api/cook/ingredients?${queryParams}`, { method: 'GET' });
    return {
        groups: response.groups || [],
        ingredients: response.ingredients || [],
        totalCount: response.totalCount || 0
    };
}

/**
 * 재료 보관법 조회
 */
export async function getIngredientStorage(ingredientId: number): Promise<IngredientStorage> {
    const response = await httpJson<{ data: IngredientStorage }>(BASE_URL, `/api/cook/ingredients/${ingredientId}/storage`, { method: 'GET' });
    return response.data;
}

/**
 * 재료 손질법 조회
 */
export async function getIngredientPreparation(ingredientId: number): Promise<IngredientPreparation> {
    const response = await httpJson<{ data: IngredientPreparation }>(BASE_URL, `/api/cook/ingredients/${ingredientId}/preparation`, { method: 'GET' });
    return response.data;
}

/**
 * 재료 그룹 등록 (관리자 전용)
 */
export async function createIngredientGroup(request: { name: string; imageUrl?: string; sortOrder?: number }): Promise<IngredientGroup> {
    const response = await httpJson<{ data: IngredientGroup }>(BASE_URL, '/api/cook/admin/ingredients/groups', {
        method: 'POST',
        body: JSON.stringify(request)
    });
    return response.data;
}

/**
 * 재료 등록 (관리자 전용)
 */
export async function createIngredient(request: { groupId: number; name: string; imageUrl?: string; sortOrder?: number }): Promise<Ingredient> {
    const response = await httpJson<{ data: Ingredient }>(BASE_URL, '/api/cook/admin/ingredients', {
        method: 'POST',
        body: JSON.stringify(request)
    });
    return response.data;
}

/**
 * 재료 그룹 수정 (관리자 전용)
 */
export async function updateIngredientGroup(groupId: number, request: { name: string; imageUrl?: string; sortOrder?: number }): Promise<IngredientGroup> {
    const response = await httpJson<{ data: IngredientGroup }>(BASE_URL, `/api/cook/admin/ingredients/groups/${groupId}`, { method: 'PUT', body: JSON.stringify(request) });
    return response.data;
}

/**
 * 재료 그룹 삭제 (관리자 전용, 하위 재료 함께 삭제)
 */
export async function deleteIngredientGroup(groupId: number): Promise<void> {
    await httpJson(BASE_URL, `/api/cook/admin/ingredients/groups/${groupId}`, {
        method: 'DELETE'
    });
}

/**
 * 재료 수정 (관리자 전용)
 */
export async function updateIngredient(ingredientId: number, request: { groupId: number; name: string; imageUrl?: string; sortOrder?: number }): Promise<Ingredient> {
    const response = await httpJson<{ data: Ingredient }>(BASE_URL, `/api/cook/admin/ingredients/${ingredientId}`, { method: 'PUT', body: JSON.stringify(request) });
    return response.data;
}

/**
 * 재료 삭제 (관리자 전용)
 */
export async function deleteIngredient(ingredientId: number): Promise<void> {
    await httpJson(BASE_URL, `/api/cook/admin/ingredients/${ingredientId}`, {
        method: 'DELETE'
    });
}

/**
 * 재료 보관법 등록 (관리자 전용)
 */
export async function createIngredientStorage(request: { ingredientId: number; content: string; summary?: string }): Promise<IngredientStorage> {
    const response = await httpJson<{ data: IngredientStorage }>(BASE_URL, '/api/cook/admin/ingredients/storage', {
        method: 'POST',
        body: JSON.stringify(request)
    });
    return response.data;
}

/**
 * 재료 손질법 등록 (관리자 전용)
 */
export async function createIngredientPreparation(request: { ingredientId: number; content: string; summary?: string }): Promise<IngredientPreparation> {
    const response = await httpJson<{ data: IngredientPreparation }>(BASE_URL, '/api/cook/admin/ingredients/preparation', {
        method: 'POST',
        body: JSON.stringify(request)
    });
    return response.data;
}

/**
 * 본문용 이미지 업로드 (에디터 addImageBlobHook, 관리자 전용)
 */
export async function uploadContentImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('image', file);
    const res = await httpForm(BASE_URL, '/api/cook/admin/ingredients/upload-image', formData);
    return res as { url: string };
}
