<script setup lang="ts">
import Button from 'primevue/button';
import Card from 'primevue/card';
import { computed } from 'vue';
import type { RecipeGridItem } from '@/types/recipe';
import { resolveProfileImage, resolveRecipeImage } from '@/utils/image';

const props = withDefaults(
    defineProps<{
        recipe: RecipeGridItem;
        /** 1단 보조행에 표시할 카테고리 라벨 */
        categoryLabel?: string | null;
        /** 검색어 하이라이트 (지정 시 제목에 하이라이트 적용) */
        highlightKeyword?: string | null;
        /** 찜 버튼 표시 여부 (예: 북마크 페이지에서는 숨김) */
        showFavorite?: boolean;
        /** 북마크 버튼 표시 여부 */
        showBookmark?: boolean;
        /** 북마크 선택 여부 (하나라도 레시피북에 저장된 경우 true) */
        isBookmarked?: boolean;
        /** 댓글 개수 표시 여부 */
        showCommentCount?: boolean;
        /** 찜 목록 모드: 항상 찜 채움 아이콘, 클릭 시 제거 */
        favoritesMode?: boolean;
        /** 작성자 영역 표시 (false면 날짜 등 다른 메타만 표시) */
        showAuthor?: boolean;
        /** 추가로 표시할 날짜 텍스트 (예: 찜한 날짜). 작성자와 함께 표시 가능 */
        dateText?: string | null;
    }>(),
    {
        showFavorite: true,
        showBookmark: true,
        isBookmarked: false,
        showCommentCount: true,
        favoritesMode: false,
        showAuthor: true,
        categoryLabel: null,
        highlightKeyword: null,
        dateText: null
    }
);

defineEmits<{
    click: [recipeId: number];
    favorite: [recipeId: number];
    bookmark: [recipeId: number];
    'scroll-to-comments': [recipeId: number];
}>();

const hitsText = computed(() => formatCount(props.recipe.hits));

/** 과장된 조회수는 시각 무게만 낮춤 (시드 수정은 이번 범위 밖, §5-4a) */
const hitsAreLarge = computed(() => (props.recipe.hits ?? 0) >= 10000);

const commentCountText = computed(() => {
    if (!props.showCommentCount) return null;
    return formatCount(props.recipe.commentCount ?? 0, { allowZero: true });
});

type MetaLineItem = { text: string; kind: 'time' | 'servings' | 'category' };

/** 1단 보조행: 시간 · 인분 · 카테고리 */
const metaLineItems = computed((): MetaLineItem[] => {
    const items: MetaLineItem[] = [];
    if (props.recipe.cookingTime) items.push({ text: props.recipe.cookingTime, kind: 'time' });
    if (props.recipe.servings) items.push({ text: props.recipe.servings, kind: 'servings' });
    if (props.categoryLabel) items.push({ text: props.categoryLabel, kind: 'category' });
    return items;
});

const showAuthorRow = computed(() => props.showAuthor && !!(props.recipe.memberNickname || props.recipe.memberName));

/** §3.2·§5-3a: 댓글 0도 표시 → 참여 영역/2단 높이 안정 */
const showEngagement = computed(() => !!(hitsText.value || commentCountText.value));

const showFooterZone = computed(() => props.showAuthor || props.showCommentCount);

const highlightParts = computed(() => {
    if (!props.highlightKeyword || !props.recipe.title) {
        return [];
    }
    const text = props.recipe.title;
    const keyword = props.highlightKeyword;
    const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts: Array<{ text: string; isHighlight: boolean }> = [];
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push({ text: text.substring(lastIndex, match.index), isHighlight: false });
        }
        parts.push({ text: match[0], isHighlight: true });
        lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
        parts.push({ text: text.substring(lastIndex), isHighlight: false });
    }
    return parts.length > 0 ? parts : [{ text, isHighlight: false }];
});

function formatCount(count: number | undefined | null, options?: { allowZero?: boolean }): string | null {
    if (count == null) return null;
    if (count === 0) return options?.allowZero ? '0' : null;
    if (count >= 100000000) {
        const eok = count / 100000000;
        const rounded = Math.round(eok * 10) / 10;
        return rounded % 1 === 0 ? `${Math.round(rounded)}억` : `${rounded}억`;
    }
    if (count >= 10000) {
        const man = count / 10000;
        const rounded = Math.round(man * 10) / 10;
        return rounded % 1 === 0 ? `${Math.round(rounded)}만` : `${rounded}만`;
    }
    return count.toLocaleString();
}
</script>

<template>
    <div class="recipe-card-wrapper" @click="$emit('click', recipe.id)">
        <Card class="recipe-card h-full">
            <template #header>
                <div class="recipe-image-container">
                    <img :src="resolveRecipeImage(recipe.thumbnail)" :alt="recipe.title" class="recipe-image" />
                    <!-- 2.3: 찜·북마크 우상단 상시 노출 -->
                    <div v-if="showFavorite || showBookmark" class="recipe-actions" @click.stop>
                        <Button
                            v-if="showFavorite"
                            :icon="favoritesMode ? 'pi pi-heart-fill' : recipe.isFavorite ? 'pi pi-heart-fill' : 'pi pi-heart'"
                            :class="['recipe-action-btn', recipe.isFavorite || favoritesMode ? 'recipe-action-btn--favorite' : '']"
                            rounded
                            text
                            aria-label="찜"
                            @click.stop="$emit('favorite', recipe.id)"
                        />
                        <Button
                            v-if="showBookmark"
                            :icon="isBookmarked ? 'pi pi-bookmark-fill' : 'pi pi-bookmark'"
                            :class="['recipe-action-btn', isBookmarked ? 'recipe-action-btn--bookmarked' : '']"
                            rounded
                            text
                            aria-label="북마크"
                            @click.stop="$emit('bookmark', recipe.id)"
                        />
                    </div>
                </div>
            </template>
            <template #content>
                <div class="recipe-content">
                    <!-- 1단: 타이틀 + 보조행(시간 · 인분 · 카테고리) -->
                    <div class="recipe-zone-1">
                        <div class="recipe-title-zone">
                            <h3 class="recipe-title">
                                <template v-if="highlightKeyword && highlightParts.length">
                                    <template v-for="(part, index) in highlightParts" :key="index">
                                        <mark v-if="part.isHighlight" class="bg-yellow-200">{{ part.text }}</mark>
                                        <span v-else>{{ part.text }}</span>
                                    </template>
                                </template>
                                <span v-else>{{ recipe.title }}</span>
                            </h3>
                        </div>
                        <div class="recipe-meta-line" :class="{ 'recipe-meta-line--empty': metaLineItems.length === 0 }">
                            <template v-if="metaLineItems.length">
                                <span
                                    v-for="(item, index) in metaLineItems"
                                    :key="`${item.kind}-${item.text}`"
                                    :class="['recipe-meta-line__item', `recipe-meta-line__item--${item.kind}`]"
                                >
                                    <span v-if="index > 0" class="recipe-meta-line__sep" aria-hidden="true">·</span>
                                    {{ item.text }}
                                </span>
                            </template>
                        </div>
                    </div>

                    <!-- 2단: 작성자 | 조회 · 댓글 (§3.2 높이 고정) -->
                    <div v-if="showFooterZone" class="recipe-zone-2">
                        <div v-if="showAuthorRow" class="recipe-author">
                            <div class="recipe-author__avatar">
                                <img v-if="recipe.memberProfileImage" :src="resolveProfileImage(recipe.memberProfileImage)" alt="" class="recipe-author__img" />
                                <i v-else class="pi pi-user recipe-author__fallback" aria-hidden="true"></i>
                            </div>
                            <span class="recipe-author__name">{{ recipe.memberNickname || recipe.memberName }}</span>
                        </div>
                        <div v-else class="recipe-author recipe-author--spacer" aria-hidden="true"></div>

                        <div v-if="showEngagement" class="recipe-engagement" :class="{ 'recipe-engagement--large-hits': hitsAreLarge }">
                            <span v-if="hitsText" class="recipe-engagement__hits">
                                <span class="recipe-engagement__label">조회 </span>{{ hitsText }}
                            </span>
                            <span v-if="hitsText && commentCountText" class="recipe-engagement__sep" aria-hidden="true">·</span>
                            <button
                                v-if="commentCountText"
                                type="button"
                                class="recipe-engagement__comments"
                                @click.stop="$emit('scroll-to-comments', recipe.id)"
                            >
                                <span class="recipe-engagement__label">댓글 </span>{{ commentCountText }}
                            </button>
                        </div>
                    </div>

                    <div v-if="dateText" class="recipe-date-footer">
                        <i class="pi pi-calendar recipe-date-footer__icon" aria-hidden="true"></i>
                        <span class="recipe-date-footer__text">추가한 날짜 : {{ dateText }}</span>
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>

<style scoped>
/* 레이아웃·카드 크롬은 layout _recipe-card-list.scss 공통 */
.recipe-content {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    gap: 0.35rem;
}

.recipe-date-footer {
    margin-top: auto;
    display: flex;
    align-items: flex-start;
    gap: 0.35rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--surface-border, #e5e7eb);
    color: var(--text-color-secondary, #6b7280);
}

.recipe-date-footer__icon {
    flex-shrink: 0;
    font-size: 0.75rem;
    margin-top: 0.1rem;
}

.recipe-date-footer__text {
    flex: 1;
    min-width: 0;
    font-size: 0.8125rem;
    line-height: 1.4;
    word-break: keep-all;
    overflow-wrap: anywhere;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
}
</style>
