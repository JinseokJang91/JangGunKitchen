<script setup lang="ts">
import { computed } from 'vue';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import type { RecipeDetail, RecipeImage } from '@/types/recipe';
import { resolveMediaUrl, resolveProfileImage } from '@/utils/image';

const props = defineProps<{
    recipe: RecipeDetail;
    mainImage: RecipeImage | null;
    cookingTipsData: { servings: string | null; cookingTime: string | null; difficulty: string | null };
    isLiked: boolean;
    /** 북마크 선택 여부 (하나라도 레시피북에 저장된 경우 true) */
    isBookmarked?: boolean;
    formatNumber: (num: number | null | undefined) => string;
    /** 현재 사용자가 레시피 작성자인지 여부 */
    isRecipeAuthor?: boolean;
    /** 팔로우 여부 */
    isFollowing?: boolean;
    /** 팔로우 버튼 비활성화 여부 (로그인하지 않은 경우) */
    followDisabled?: boolean;
}>();

const metaParts = computed(() => {
    const parts: string[] = [];
    if (props.cookingTipsData.cookingTime) parts.push(props.cookingTipsData.cookingTime);
    if (props.cookingTipsData.servings) parts.push(props.cookingTipsData.servings);
    if (props.cookingTipsData.difficulty) parts.push(props.cookingTipsData.difficulty);
    return parts;
});

const categoryLabels = computed(() =>
    (props.recipe.categories || [])
        .map((c) => c.detailName || c.codeName)
        .filter((label): label is string => !!label)
);

defineEmits<{
    'go-back': [];
    'toggle-like': [];
    'toggle-bookmark': [];
    'toggle-follow': [];
    'go-to-author-profile': [];
}>();
</script>

<template>
    <div class="recipe-detail-header">
        <!-- 메인 이미지: contain + 웜 배경 (카드와 동일 정책) -->
        <div class="recipe-detail-header__image">
            <img v-if="mainImage" :src="resolveMediaUrl(mainImage.url)" :alt="recipe.title" class="recipe-detail-header__img" />
            <div v-else class="recipe-detail-header__img-empty" aria-hidden="true">
                <i class="pi pi-image"></i>
            </div>

            <div class="recipe-detail-header__fab recipe-detail-header__fab--back">
                <Button class="recipe-hero-btn recipe-hero-btn--back" @click="$emit('go-back')" icon="pi pi-arrow-left" size="large" rounded aria-label="뒤로가기" />
            </div>

            <div class="recipe-detail-header__fab recipe-detail-header__fab--actions">
                <Button
                    class="recipe-hero-btn recipe-hero-btn--like"
                    :class="{ 'recipe-hero-btn--liked': isLiked }"
                    @click="$emit('toggle-like')"
                    :icon="isLiked ? 'pi pi-heart-fill' : 'pi pi-heart'"
                    size="large"
                    rounded
                    :aria-pressed="isLiked"
                    aria-label="찜"
                />
                <Button
                    class="recipe-hero-btn recipe-hero-btn--bookmark"
                    :class="{ 'recipe-hero-btn--bookmarked': isBookmarked }"
                    @click="$emit('toggle-bookmark')"
                    :icon="isBookmarked ? 'pi pi-bookmark-fill' : 'pi pi-bookmark'"
                    size="large"
                    rounded
                    :aria-pressed="!!isBookmarked"
                    aria-label="북마크"
                />
            </div>
        </div>

        <div class="recipe-detail-header__body">
            <!-- 작성자 → 제목 → 소개 → 메타 → 참여 -->
            <div class="recipe-detail-header__author">
                <div class="recipe-detail-header__author-left">
                    <button type="button" class="recipe-detail-header__avatar" @click="$emit('go-to-author-profile')" aria-label="작성자 프로필">
                        <img v-if="recipe.memberProfileImage" :src="resolveProfileImage(recipe.memberProfileImage)" alt="" class="w-full h-full object-cover" />
                        <i v-else class="pi pi-user text-gray-500"></i>
                    </button>
                    <button type="button" class="recipe-detail-header__author-name" @click="$emit('go-to-author-profile')">
                        {{ recipe.memberNickname || recipe.memberName }}
                    </button>
                </div>
                <div v-if="!isRecipeAuthor" class="shrink-0">
                    <Button
                        class="recipe-detail-header__follow-btn"
                        :label="isFollowing ? '팔로잉' : '팔로우'"
                        :icon="isFollowing ? 'pi pi-check' : 'pi pi-plus'"
                        :severity="isFollowing ? 'secondary' : 'primary'"
                        :outlined="isFollowing"
                        size="small"
                        @click="$emit('toggle-follow')"
                        :disabled="followDisabled"
                    />
                </div>
            </div>

            <h1 class="recipe-detail-header__title">{{ recipe.title }}</h1>

            <p v-if="recipe.introduction" class="recipe-detail-header__intro">{{ recipe.introduction }}</p>

            <div v-if="metaParts.length || categoryLabels.length" class="recipe-detail-header__meta">
                <span v-if="metaParts.length" class="recipe-detail-header__meta-tips">
                    <template v-for="(part, i) in metaParts" :key="`meta-${i}`">
                        <span v-if="i > 0" class="recipe-detail-header__meta-sep" aria-hidden="true">·</span>
                        <span>{{ part }}</span>
                    </template>
                </span>
                <span v-if="metaParts.length && categoryLabels.length" class="recipe-detail-header__meta-sep" aria-hidden="true">·</span>
                <span v-if="categoryLabels.length" class="recipe-detail-header__meta-tags">
                    <Tag v-for="label in categoryLabels" :key="label" :value="label" severity="secondary" class="recipe-detail-header__tag" />
                </span>
            </div>

            <div class="recipe-detail-header__stats">
                <span>조회 {{ formatNumber(recipe.hits) }}</span>
                <span class="recipe-detail-header__meta-sep" aria-hidden="true">·</span>
                <span>댓글 {{ formatNumber(recipe.stats?.totalComments) }}</span>
                <span class="recipe-detail-header__meta-sep" aria-hidden="true">·</span>
                <span>찜 {{ formatNumber(recipe.stats?.favoriteCount) }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.recipe-detail-header {
    background: #fff;
    border: 1px solid #f3e8d8;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(28, 25, 23, 0.06);
    overflow: hidden;
    margin-bottom: 1.25rem;
}

@media (min-width: 768px) {
    .recipe-detail-header {
        border-radius: 1rem;
        margin-bottom: 1.5rem;
    }
}

.recipe-detail-header__image {
    position: relative;
    width: 100%;
    height: 13rem;
    background: #fff7ed;
}

@media (min-width: 481px) {
    .recipe-detail-header__image {
        height: 16rem;
    }
}

@media (min-width: 769px) {
    .recipe-detail-header__image {
        height: 22rem;
    }
}

.recipe-detail-header__img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.recipe-detail-header__img-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #fdba74;
    font-size: 3rem;
}

.recipe-detail-header__body {
    padding: 1rem 1rem 1.25rem;
}

@media (min-width: 640px) {
    .recipe-detail-header__body {
        padding: 1.25rem 1.5rem 1.5rem;
    }
}

@media (min-width: 768px) {
    .recipe-detail-header__body {
        padding: 1.5rem 2rem 1.75rem;
    }
}

.recipe-detail-header__author {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.875rem;
    min-width: 0;
}

.recipe-detail-header__author-left {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    min-width: 0;
    flex: 1;
}

.recipe-detail-header__avatar {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 9999px;
    background: #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
    border: none;
    padding: 0;
    cursor: pointer;
}

.recipe-detail-header__avatar:hover {
    opacity: 0.85;
}

@media (min-width: 640px) {
    .recipe-detail-header__avatar {
        width: 2.75rem;
        height: 2.75rem;
    }
}

.recipe-detail-header__author-name {
    border: none;
    background: none;
    padding: 0;
    margin: 0;
    font-size: 0.9375rem;
    font-weight: 600;
    color: #374151;
    cursor: pointer;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
}

.recipe-detail-header__author-name:hover {
    color: var(--primary-color, #f97316);
}

@media (min-width: 640px) {
    .recipe-detail-header__author-name {
        font-size: 1rem;
    }
}

.recipe-detail-header__title {
    margin: 0 0 0.75rem;
    font-size: 1.375rem;
    font-weight: 700;
    line-height: 1.3;
    color: #111827;
    word-break: keep-all;
}

@media (min-width: 640px) {
    .recipe-detail-header__title {
        font-size: 1.625rem;
    }
}

@media (min-width: 768px) {
    .recipe-detail-header__title {
        font-size: 1.875rem;
    }
}

.recipe-detail-header__intro {
    margin: 0 0 1rem;
    font-size: 0.9375rem;
    line-height: 1.65;
    color: #4b5563;
    white-space: pre-line;
}

@media (min-width: 640px) {
    .recipe-detail-header__intro {
        font-size: 1rem;
    }
}

.recipe-detail-header__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.375rem 0.25rem;
    margin-bottom: 0.5rem;
    font-size: 0.8125rem;
    color: #6b7280;
    line-height: 1.4;
}

@media (min-width: 640px) {
    .recipe-detail-header__meta {
        font-size: 0.875rem;
    }
}

.recipe-detail-header__meta-tips {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.25rem;
}

.recipe-detail-header__meta-sep {
    color: #d1d5db;
    margin: 0 0.125rem;
}

.recipe-detail-header__meta-tags {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 0.375rem;
    align-items: center;
}

.recipe-detail-header__tag {
    font-size: 0.75rem !important;
}

.recipe-detail-header__stats {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.125rem;
    font-size: 0.8125rem;
    color: #9ca3af;
}

@media (min-width: 640px) {
    .recipe-detail-header__stats {
        font-size: 0.875rem;
    }
}

/* FAB */
.recipe-detail-header__fab {
    position: absolute;
    z-index: 10;
}

.recipe-detail-header__fab--back {
    top: calc(0.75rem + env(safe-area-inset-top, 0px));
    left: calc(0.75rem + env(safe-area-inset-left, 0px));
}

.recipe-detail-header__fab--actions {
    top: calc(0.75rem + env(safe-area-inset-top, 0px));
    right: calc(0.75rem + env(safe-area-inset-right, 0px));
    display: flex;
    gap: 0.5rem;
}

@media (min-width: 769px) {
    .recipe-detail-header__fab--back {
        top: 1rem;
        left: 1rem;
    }

    .recipe-detail-header__fab--actions {
        top: 1rem;
        right: 1rem;
    }
}

:deep(.recipe-hero-btn.p-button) {
    width: max(2.75rem, 44px);
    height: max(2.75rem, 44px);
    min-width: max(2.75rem, 44px);
    min-height: max(2.75rem, 44px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
}

:deep(.recipe-hero-btn.recipe-hero-btn--back.p-button) {
    background: var(--primary-color, #f97316) !important;
    border-color: var(--primary-color, #f97316) !important;
    color: #fff !important;
}

:deep(.recipe-hero-btn.recipe-hero-btn--back.p-button:hover) {
    filter: brightness(0.95);
}

:deep(.recipe-hero-btn.recipe-hero-btn--like.p-button),
:deep(.recipe-hero-btn.recipe-hero-btn--bookmark.p-button) {
    background: #fff !important;
    border: 1px solid #e5e7eb !important;
    color: var(--primary-color, #f97316) !important;
}

:deep(.recipe-hero-btn.recipe-hero-btn--like.p-button .p-button-icon),
:deep(.recipe-hero-btn.recipe-hero-btn--bookmark.p-button .p-button-icon) {
    color: inherit;
}

:deep(.recipe-hero-btn.recipe-hero-btn--like.p-button.recipe-hero-btn--liked),
:deep(.recipe-hero-btn.recipe-hero-btn--bookmark.p-button.recipe-hero-btn--bookmarked) {
    background: var(--primary-color, #f97316) !important;
    border-color: var(--primary-color, #f97316) !important;
    color: #fff !important;
}

:deep(.recipe-hero-btn.recipe-hero-btn--like.p-button.recipe-hero-btn--liked .p-button-icon),
:deep(.recipe-hero-btn.recipe-hero-btn--bookmark.p-button.recipe-hero-btn--bookmarked .p-button-icon) {
    color: #fff !important;
    -webkit-text-fill-color: #fff;
}

:deep(.recipe-hero-btn.recipe-hero-btn--like.p-button.recipe-hero-btn--liked:hover),
:deep(.recipe-hero-btn.recipe-hero-btn--bookmark.p-button.recipe-hero-btn--bookmarked:hover) {
    filter: brightness(0.95);
}

.recipe-detail-header__follow-btn :deep(.p-button) {
    justify-content: center;
    padding: 0.35rem 0.55rem;
    font-size: 0.75rem;
    gap: 0.25rem;
    white-space: nowrap;
}

.recipe-detail-header__follow-btn :deep(.p-button .p-button-icon) {
    font-size: 0.7rem;
}

@media (min-width: 640px) {
    .recipe-detail-header__follow-btn :deep(.p-button) {
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
    }

    .recipe-detail-header__follow-btn :deep(.p-button .p-button-icon) {
        font-size: 0.875rem;
    }
}
</style>
