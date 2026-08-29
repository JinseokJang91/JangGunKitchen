<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Skeleton from 'primevue/skeleton';
import Tag from 'primevue/tag';
import { getTodayRecommendations } from '@/api/recommendationApi';
import type { TodayRecommendationsResponse } from '@/types/recipe';
import { isEmptyDataError } from '@/utils/errorHandler';
import { resolveProfileImage } from '@/utils/image';

const router = useRouter();
const toast = useToast();

const recommendations = ref<TodayRecommendationsResponse | null>(null);
const isLoading = ref(false);

/**
 * 오늘의 추천 레시피 로딩
 */
const loadRecommendations = async (refresh: boolean = false) => {
    isLoading.value = true;

    try {
        const data = await getTodayRecommendations(3, refresh);
        recommendations.value = data;
    } catch (error) {
        if (isEmptyDataError(error)) {
            recommendations.value = null;
            return;
        }
        console.error('[TodayRecommendations] 추천 레시피 로딩 실패:', error);
        toast.add({
            severity: 'error',
            summary: '오류',
            detail: '추천 레시피를 불러오는데 실패했습니다.',
            life: 3000
        });
    } finally {
        isLoading.value = false;
    }
};

/**
 * 새로고침
 */
const refreshRecommendations = async () => {
    isLoading.value = true;
    try {
        const data = await getTodayRecommendations(3, true);
        recommendations.value = data;
        toast.add({
            severity: 'success',
            summary: '새로고침',
            detail: '새로운 추천 레시피를 불러왔습니다.',
            life: 2000
        });
    } catch (error) {
        if (isEmptyDataError(error)) {
            recommendations.value = null;
            return;
        }
        console.error('[TodayRecommendations] 추천 레시피 새로고침 실패:', error);
        toast.add({
            severity: 'error',
            summary: '오류',
            detail: '추천 레시피를 불러오는데 실패했습니다.',
            life: 3000
        });
    } finally {
        isLoading.value = false;
    }
};

/**
 * 레시피 상세 페이지로 이동
 */
const goToRecipe = (recipeId: number) => {
    router.push(`/recipe/${recipeId}`);
};

/**
 * 숫자 포맷팅 (천 단위 구분)
 */
const formatNumber = (num: number): string => {
    if (num >= 10000) {
        return `${(num / 10000).toFixed(1)}만`;
    }
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}천`;
    }
    return num.toString();
};

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
    loadRecommendations();
});

// 외부에서 사용할 수 있도록 노출
defineExpose({
    loadRecommendations
});
</script>

<template>
    <div class="today-recommendations-section">
        <div class="section-header">
            <div>
                <h2 class="section-title">
                    <i class="pi pi-sparkles"></i>
                    오늘의 레시피 추천
                </h2>
                <p class="section-subtitle" v-if="recommendations">
                    {{ recommendations.recommendationType === 'PERSONALIZED' ? '당신을 위한 맞춤 추천 레시피를 확인해보세요' : '오늘의 인기 레시피를 확인해보세요' }}
                </p>
            </div>
            <div class="header-actions" v-if="recommendations?.refreshable">
                <Button label="새로고침" icon="pi pi-refresh" @click="refreshRecommendations" :loading="isLoading" text size="small" />
            </div>
        </div>

        <!-- 로딩 상태 -->
        <div v-if="isLoading" class="loading-container">
            <div class="skeleton-cards">
                <Skeleton v-for="i in 3" :key="i" height="350px" />
            </div>
        </div>

        <!-- 추천 레시피 -->
        <div v-else-if="recommendations && recommendations.recipes.length > 0" class="recommendations-grid">
            <div v-for="recipe in recommendations.recipes" :key="recipe.id" class="recommendation-card-wrapper" @click="goToRecipe(recipe.id)">
                <Card class="recommendation-card">
                    <template #header>
                        <div class="card-thumbnail">
                            <div class="recommend-badge" v-if="recipe.recommendReason">
                                <i class="pi pi-star-fill"></i>
                                {{ recipe.recommendReason }}
                            </div>
                            <img :src="recipe.thumbnail || '/placeholder.jpg'" :alt="recipe.title" />
                        </div>
                    </template>
                    <template #content>
                        <div class="card-info">
                            <h3 class="recipe-title">{{ recipe.title }}</h3>
                            <p class="recipe-description" v-if="recipe.description">
                                {{ recipe.description }}
                            </p>

                            <div class="recipe-categories" v-if="recipe.categories && recipe.categories.length > 0">
                                <Tag v-for="category in recipe.categories.slice(0, 2)" :key="`${category.codeId}-${category.detailCodeId}`" :value="category.detailName" severity="secondary" class="category-tag" />
                            </div>

                            <div class="recipe-author">
                                <img v-if="recipe.memberProfileImage" :src="resolveProfileImage(recipe.memberProfileImage)" :alt="recipe.memberNickname || '익명'" class="recipe-author__avatar" />
                                <div v-else class="recipe-author__avatar recipe-author__avatar--placeholder">
                                    <i class="pi pi-user"></i>
                                </div>
                                <span class="recipe-author__name">{{ recipe.memberNickname || '익명' }}</span>
                            </div>

                            <div class="recipe-stats">
                                <span>
                                    <i class="pi pi-eye"></i>
                                    {{ formatNumber(recipe.hits || 0) }}
                                </span>
                                <span>
                                    <i class="pi pi-heart"></i>
                                    {{ formatNumber(recipe.favoriteCount || 0) }}
                                </span>
                                <span v-if="recipe.commentCount">
                                    <i class="pi pi-comment"></i>
                                    {{ formatNumber(recipe.commentCount) }}
                                </span>
                            </div>
                        </div>
                    </template>
                </Card>
            </div>
        </div>

        <!-- 데이터 없음 -->
        <div v-else class="empty-container">
            <i class="pi pi-sparkles" style="font-size: 3rem; color: var(--text-color-secondary)"></i>
            <p>추천할 레시피가 없습니다</p>
        </div>
    </div>
</template>

<style scoped lang="scss">
.today-recommendations-section {
    margin-bottom: 0;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .section-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-color);
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;

        i {
            color: #ffd700;
        }
    }

    .section-subtitle {
        font-size: 0.9375rem;
        color: var(--text-color-secondary);
    }

    .header-actions {
        display: flex;
        gap: 8px;
    }
}

.recommendations-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
}

.recommendation-card-wrapper {
    height: 100%;
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-8px);

        .recommendation-card {
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .card-thumbnail img {
            transform: scale(1.05);
        }
    }
}

.recommendation-card {
    height: 100%;
    overflow: hidden;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;

    :deep(.p-card-header) {
        padding: 0;
        flex-shrink: 0;
    }

    :deep(.p-card-body) {
        padding: 0;
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
    }

    :deep(.p-card-content) {
        padding: 0;
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
    }
}

.recommend-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 4px;

    i {
        font-size: 10px;
    }
}

.card-thumbnail {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }
}

.card-info {
    padding: 16px;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
}

.recipe-title {
    width: 100%;
    min-width: 0;
    font-size: 18px;
    font-weight: 700;
    line-height: 1.35;
    color: var(--text-color);
    margin: 0 0 8px;
    min-height: calc(1.35em * 2);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-word;
    overflow-wrap: anywhere;
}

.recipe-description {
    width: 100%;
    min-width: 0;
    font-size: 13px;
    line-height: 1.45;
    color: var(--text-color-secondary);
    margin: 0 0 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-word;
    overflow-wrap: anywhere;
}

.recipe-categories {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;
}

.category-tag {
    font-size: 0.6875rem;
    font-weight: 500;
}

.recipe-author {
    font-size: 12px;
    color: var(--text-color-secondary);
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
}

.recipe-author__avatar {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 9999px;
    object-fit: cover;
    flex-shrink: 0;

    &--placeholder {
        background: #d1d5db;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6b7280;

        i {
            font-size: 0.625rem;
        }
    }
}

.recipe-author__name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.recipe-stats {
    display: flex;
    gap: 16px;
    font-size: 12px;
    color: var(--text-color-secondary);
    margin-top: auto;
    padding-top: 12px;
    border-top: 1px solid var(--surface-border);

    span {
        display: flex;
        align-items: center;
        gap: 4px;

        i {
            font-size: 11px;
        }
    }
}

.loading-container {
    .skeleton-cards {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
    }
}

.empty-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 64px 24px;
    text-align: center;
    color: var(--text-color-secondary);

    p {
        margin-top: 16px;
        font-size: 14px;
    }
}

@media (max-width: 1024px) {
    .recommendations-grid,
    .loading-container .skeleton-cards {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.25rem;
    }
}

@media (max-width: 768px) {
    .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;

        .section-title {
            font-size: 1.125rem;
            line-height: 1.3;
        }

        .section-subtitle {
            font-size: 0.8125rem;
        }
    }

    .recommendations-grid,
    .loading-container .skeleton-cards {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .recommendation-card-wrapper {
        max-width: none;
        margin: 0;
    }

    .card-info {
        padding: 12px 14px;
    }

    .recipe-title {
        font-size: 1rem;
        margin-bottom: 6px;
        min-height: calc(1.35em * 2);
    }

    .recipe-description {
        font-size: 0.8125rem;
        margin-bottom: 10px;
    }

    .recipe-stats {
        gap: 12px;
        font-size: 0.8125rem;
        padding-top: 10px;
    }

    .card-thumbnail {
        height: 180px;
    }
}

@media (max-width: 480px) {
    .recommend-badge {
        font-size: 0.6875rem;
        padding: 5px 10px;
        top: 10px;
        left: 10px;
    }

    .card-thumbnail {
        height: 168px;
    }
}
</style>
