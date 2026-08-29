<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import Card from 'primevue/card';
import { getPopularRecipes } from '@/api/recipeApi';
import type { PopularRecipeItem, Recipe } from '@/types/recipe';
import { useAppToast } from '@/utils/toast';
import { isEmptyDataError } from '@/utils/errorHandler';
import { resolveProfileImage, resolveRecipeImage } from '@/utils/image';

const router = useRouter();

const { showError } = useAppToast();

// 상태
const popularRecipes = ref<PopularRecipeItem[]>([]);
const loading = ref(false);
const selectedPeriod = ref<'24h' | '7d' | '30d'>('24h');

// 기간 옵션 (랭킹 페이지와 동일한 라벨 사용)
const periodOptions = [
    { label: '일간', value: '24h' },
    { label: '주간', value: '7d' },
    { label: '월간', value: '30d' }
];

// 인기 레시피 로드
const loadPopularRecipes = async () => {
    loading.value = true;
    try {
        const recipes = await getPopularRecipes(3, selectedPeriod.value);
        popularRecipes.value = recipes;
    } catch (error) {
        if (isEmptyDataError(error)) {
            popularRecipes.value = [];
            return;
        }
        console.error('Failed to load popular recipes:', error);
        showError('인기 레시피를 불러오는데 실패했습니다.');
    } finally {
        loading.value = false;
    }
};

// 기간 변경 핸들러
const changePeriod = (period: '24h' | '7d' | '30d') => {
    selectedPeriod.value = period;
    loadPopularRecipes();
};

// 전체 랭킹 페이지로 이동 (현재 선택 기간 유지)
function goToFullRanking() {
    router.push({ path: '/ranking', query: { period: selectedPeriod.value } });
}

function goToRecipe(recipeId: number) {
    router.push(`/recipe/${recipeId}`);
}

// TOP 3 레시피 (순위 표시용)
const topThreeRecipes = computed(() => {
    return popularRecipes.value.slice(0, 3);
});

function getCategoryName(recipe: Recipe): string {
    if (recipe.categories && recipe.categories.length > 0) {
        return recipe.categories[0].codeName || recipe.categories[0].detailName || '';
    }
    return '';
}

// 마운트 시 로드
onMounted(() => {
    loadPopularRecipes();
});
</script>

<template>
    <div class="popular-recipes-section">
        <!-- 헤더 -->
        <header class="popular-header">
            <div class="popular-header__intro">
                <h2 class="popular-title">지금 인기 레시피 TOP 🔥</h2>
                <p class="popular-desc">지금 가장 많은 사람들이 관심을 갖는 레시피를 확인해보세요</p>
            </div>

            <div class="popular-header__actions">
                <button type="button" class="btn-ranking" @click="goToFullRanking">전체 랭킹 보기</button>
                <div class="period-segment" role="tablist" aria-label="랭킹 기간">
                    <button
                        v-for="option in periodOptions"
                        :key="option.value"
                        type="button"
                        role="tab"
                        :aria-selected="selectedPeriod === option.value"
                        :class="['period-segment__btn', { 'is-active': selectedPeriod === option.value }]"
                        @click="changePeriod(option.value as '24h' | '7d' | '30d')"
                    >
                        {{ option.label }}
                    </button>
                </div>
            </div>
        </header>

        <!-- 로딩 상태 -->
        <div v-if="loading" class="flex justify-center items-center py-20">
            <i class="pi pi-spinner pi-spin text-4xl text-primary-500"></i>
        </div>

        <!-- TOP 3 레시피 -->
        <div v-else-if="topThreeRecipes.length > 0" class="top-three-grid">
            <div v-for="item in topThreeRecipes" :key="item.recipe.id" class="popular-card-wrapper" @click="goToRecipe(item.recipe.id)">
                <Card class="popular-card">
                    <template #header>
                        <div class="card-thumbnail">
                            <div :class="['rank-badge', item.rank === 1 ? 'rank-badge--gold' : item.rank === 2 ? 'rank-badge--silver' : 'rank-badge--bronze']">
                                {{ item.rank }}
                            </div>
                            <img :src="resolveRecipeImage(item.recipe.thumbnail)" :alt="item.recipe.title" />
                        </div>
                    </template>
                    <template #content>
                        <div class="card-info">
                            <div v-if="getCategoryName(item.recipe)" class="recipe-category">
                                {{ getCategoryName(item.recipe) }}
                            </div>

                            <h3 class="recipe-title">{{ item.recipe.title }}</h3>

                            <p v-if="item.recipe.description" class="recipe-description">
                                {{ item.recipe.description }}
                            </p>

                            <div class="recipe-stats">
                                <span class="recipe-stat">
                                    <i class="pi pi-eye"></i>
                                    {{ item.recipe.hits || 0 }}
                                </span>
                                <span class="recipe-stat">
                                    <i class="pi pi-heart"></i>
                                    {{ item.recipe.favoriteCount || 0 }}
                                </span>
                                <span class="recipe-stat">
                                    <i class="pi pi-comment"></i>
                                    {{ item.recipe.commentCount || 0 }}
                                </span>
                            </div>

                            <div class="recipe-author">
                                <img v-if="item.recipe.memberProfileImage" :src="resolveProfileImage(item.recipe.memberProfileImage)" :alt="item.recipe.memberNickname || item.recipe.memberName" class="recipe-author__avatar" />
                                <div v-else class="recipe-author__avatar recipe-author__avatar--placeholder">
                                    <i class="pi pi-user"></i>
                                </div>
                                <span class="recipe-author__name">
                                    {{ item.recipe.memberNickname || item.recipe.memberName }}
                                </span>
                            </div>
                        </div>
                    </template>
                </Card>
            </div>
        </div>

        <!-- 데이터 없음 -->
        <div v-else class="popular-empty">
            <i class="pi pi-inbox popular-empty__icon"></i>
            <p class="popular-empty__msg">아직 인기 레시피가 없습니다.</p>
        </div>
    </div>
</template>

<style scoped lang="scss">
.popular-recipes-section {
    padding: 0;
}

.popular-header {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.875rem;
    margin-bottom: 1.25rem;
}

.popular-header__intro {
    min-width: 0;
}

.popular-title {
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.25;
    margin: 0 0 0.375rem;
    color: var(--text-color);
}

.popular-desc {
    margin: 0;
    font-size: 0.9375rem;
    line-height: 1.45;
    color: var(--text-color-secondary);
}

.popular-header__actions {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    width: 100%;
}

.btn-ranking {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
    font-weight: 600;
    line-height: 1.3;
    border-radius: 0.5rem;
    border: 1px solid var(--primary-color, #f97316);
    color: var(--primary-color, #f97316);
    background: transparent;
    cursor: pointer;
    transition:
        background 0.15s ease,
        color 0.15s ease;

    &:hover {
        background: rgba(249, 115, 22, 0.08);
    }
}

.period-segment {
    display: flex;
    gap: 0.375rem;
    width: 100%;
}

.period-segment__btn {
    flex: 1 1 0;
    min-height: 2.25rem;
    padding: 0.375rem 0.5rem;
    font-size: 0.8125rem;
    font-weight: 600;
    line-height: 1.2;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    background: var(--surface-100, #f3f4f6);
    color: var(--text-color-secondary);
    transition:
        background 0.15s ease,
        color 0.15s ease;

    &:hover {
        background: var(--surface-200, #e5e7eb);
    }

    &.is-active {
        background: var(--primary-color, #f97316);
        color: #fff;
    }
}

.top-three-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
}

.popular-card-wrapper {
    height: 100%;
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-8px);

        .popular-card {
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .card-thumbnail img {
            transform: scale(1.05);
        }
    }
}

.popular-card {
    height: 100%;
    overflow: hidden;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;

    :deep(.p-card-header) {
        padding: 0;
    }

    :deep(.p-card-body) {
        padding: 0;
    }

    :deep(.p-card-content) {
        padding: 0;
    }
}

.card-thumbnail {
    position: relative;
    width: 100%;
    height: 12rem;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }
}

.rank-badge {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
    z-index: 10;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    &--gold {
        background: #eab308;
    }

    &--silver {
        background: #9ca3af;
    }

    &--bronze {
        background: #ea580c;
    }
}

.card-info {
    padding: 1rem;
}

.recipe-category {
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--primary-color, #f97316);
    margin-bottom: 0.375rem;
    letter-spacing: -0.01em;
}

.recipe-title {
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.35;
    margin: 0 0 0.5rem;
    color: var(--text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
}

.recipe-description {
    font-size: 0.8125rem;
    line-height: 1.45;
    color: var(--text-color-secondary);
    margin: 0 0 1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
}

.recipe-stats {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.75rem 1rem;
    font-size: 0.8125rem;
    color: var(--text-color-secondary);
    margin-bottom: 0.75rem;
}

.recipe-stat {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
}

.recipe-author {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
}

.recipe-author__avatar {
    width: 2rem;
    height: 2rem;
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
            font-size: 0.75rem;
        }
    }
}

.recipe-author__name {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.popular-empty {
    text-align: center;
    padding: 3rem 1rem;

    &__icon {
        font-size: 3rem;
        color: var(--surface-300, #d1d5db);
        margin-bottom: 0.75rem;
    }

    &__msg {
        margin: 0;
        font-size: 0.875rem;
        color: var(--text-color-secondary);
    }
}

@media (min-width: 768px) {
    .top-three-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
    }

    .popular-header {
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem 1.5rem;
        margin-bottom: 1.5rem;
    }

    .popular-title {
        font-size: 1.625rem;
    }

    .popular-desc {
        font-size: 1rem;
    }

    .popular-header__actions {
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-end;
        width: auto;
        max-width: 100%;
    }

    .btn-ranking {
        width: auto;
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
    }

    .period-segment {
        width: auto;
        flex: 0 0 auto;
    }

    .period-segment__btn {
        flex: 0 1 auto;
        min-width: 3.25rem;
        padding: 0.5rem 0.875rem;
        font-size: 0.875rem;
    }

    .rank-badge {
        top: 0.5rem;
        left: 0.5rem;
        width: 3rem;
        height: 3rem;
        font-size: 1.125rem;
    }

    .recipe-category {
        font-size: 0.8125rem;
        margin-bottom: 0.5rem;
    }

    .recipe-title {
        font-size: 1.25rem;
        font-weight: 700;
    }

    .recipe-description {
        font-size: 0.875rem;
    }
}

@media (max-width: 767px) {
    .popular-title {
        font-size: 1.125rem;
    }

    .popular-desc {
        font-size: 0.8125rem;
    }

    .recipe-category {
        font-size: 0.625rem;
        margin-bottom: 0.25rem;
    }

    .recipe-title {
        font-size: 0.9375rem;
        margin-bottom: 0.375rem;
    }

    .recipe-description {
        font-size: 0.75rem;
        margin-bottom: 0.75rem;
    }

    .recipe-stats {
        font-size: 0.75rem;
        gap: 0.5rem 0.75rem;
        margin-bottom: 0.625rem;
    }

    .recipe-author__name {
        font-size: 0.75rem;
    }
}
</style>
