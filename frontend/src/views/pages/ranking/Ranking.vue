<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from 'primevue/button';
import Skeleton from 'primevue/skeleton';
import { getPopularRecipes, toggleFavorite as toggleFavoriteApi } from '@/api/recipeApi';
import { getRecipeBooks, getBookmarksByRecipeBook } from '@/api/bookmarkApi';
import RecipeGridCard from '@/components/recipe/RecipeGridCard.vue';
import BookmarkDialog from '@/components/bookmark/BookmarkDialog.vue';
import { useAuthStore } from '@/stores/authStore';
import type { PopularRecipeItem, RecipeCookingTip, TrendStatus } from '@/types/recipe';
import type { RecipeGridItem } from '@/types/recipe';
import { useAppToast } from '@/utils/toast';
import { resolveProfileImage, resolveRecipeImage } from '@/utils/image';

/** cookingTips에서 요리 시간/인분 추출 (Category와 동일) */
function extractCookingTime(cookingTips: RecipeCookingTip[] | undefined): string | null {
    if (!cookingTips || !Array.isArray(cookingTips)) return null;
    const tip = cookingTips.find((t) => t.codeId === 'COOKING_TIME');
    return tip?.detailName ?? null;
}
function extractServings(cookingTips: RecipeCookingTip[] | undefined): string | null {
    if (!cookingTips || !Array.isArray(cookingTips)) return null;
    const tip = cookingTips.find((t) => t.codeId === 'SERVINGS');
    return tip?.detailName ?? null;
}

/** RecipeGridCard에 넘길 레시피 (cookingTime/servings 포함) */
function getCardRecipe(item: PopularRecipeItem): RecipeGridItem {
    const r = item.recipe;
    return {
        ...r,
        cookingTime: r.cookingTime ?? extractCookingTime(r.cookingTips) ?? undefined,
        servings: r.servings ?? extractServings(r.cookingTips) ?? undefined
    };
}

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { showError, showWarn } = useAppToast();

const RANKING_LIMIT = 50;
/** 포디엄(1~3) 제외, 리스트 첫 화면 분량 */
const INITIAL_DISPLAY_COUNT = 12;
const LOAD_MORE_STEP = 12;
type PeriodValue = '24h' | '7d' | '30d';

const popularRecipes = ref<PopularRecipeItem[]>([]);
const displayCount = ref(INITIAL_DISPLAY_COUNT);
const loading = ref(false);
const loadError = ref(false);
const selectedPeriod = ref<PeriodValue>('24h');
const calculatedAt = ref<string | null>(null);
const skipLoadFromWatch = ref(false);

const podiumRecipes = computed(() => popularRecipes.value.filter((item) => item.rank >= 1 && item.rank <= 3).slice(0, 3));
const listRecipesAll = computed(() => popularRecipes.value.filter((item) => item.rank > 3));
const displayedListRecipes = computed(() => listRecipesAll.value.slice(0, displayCount.value));
const hasMoreRecipes = computed(() => displayCount.value < listRecipesAll.value.length);

const bookmarkDialogVisible = ref(false);
const bookmarkRecipeId = ref<number | null>(null);
const bookmarkedRecipeIds = ref<Set<number>>(new Set());

const periodOptions: { label: string; value: PeriodValue }[] = [
    { label: '일간', value: '24h' },
    { label: '주간', value: '7d' },
    { label: '월간', value: '30d' }
];

function formatCalculatedAt(isoString?: string): string {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

const displayCalculatedAt = computed(() => formatCalculatedAt(calculatedAt.value ?? undefined));

async function loadPopularRecipes() {
    loading.value = true;
    loadError.value = false;
    displayCount.value = INITIAL_DISPLAY_COUNT;
    try {
        const recipes = await getPopularRecipes(RANKING_LIMIT, selectedPeriod.value);
        popularRecipes.value = recipes;
        const first = recipes[0];
        calculatedAt.value = first?.calculatedAt ?? null;
    } catch (error) {
        console.error('Failed to load ranking:', error);
        loadError.value = true;
        showError('랭킹을 불러오는데 실패했습니다.');
    } finally {
        loading.value = false;
    }
}

function loadMoreRecipes() {
    displayCount.value = Math.min(displayCount.value + LOAD_MORE_STEP, listRecipesAll.value.length);
}

function changePeriod(period: PeriodValue) {
    if (selectedPeriod.value === period) return;
    selectedPeriod.value = period;
    loadPopularRecipes();
    skipLoadFromWatch.value = true;
    const nextQuery = { ...route.query, period };
    nextTick(() => {
        router.replace({ path: '/ranking', query: nextQuery });
        nextTick(() => {
            skipLoadFromWatch.value = false;
        });
    });
}

function rankBadgeClass(rank: number): string {
    if (rank === 1) return 'rank-badge--gold';
    if (rank === 2) return 'rank-badge--silver';
    if (rank === 3) return 'rank-badge--bronze';
    return 'rank-badge--neutral';
}

type TrendView = { kind: TrendStatus; text: string; title?: string };

function getTrendView(item: PopularRecipeItem): TrendView {
    const prev = item.previousRank;
    switch (item.trendStatus) {
        case 'UP': {
            const delta = prev != null && prev > item.rank ? prev - item.rank : null;
            return {
                kind: 'UP',
                text: delta != null ? `↑${delta}` : '↑',
                title: prev != null ? `이전 ${prev}위` : undefined
            };
        }
        case 'DOWN': {
            const delta = prev != null && prev < item.rank ? item.rank - prev : null;
            return {
                kind: 'DOWN',
                text: delta != null ? `↓${delta}` : '↓',
                title: prev != null ? `이전 ${prev}위` : undefined
            };
        }
        case 'NEW':
            return { kind: 'NEW', text: 'NEW' };
        case 'SAME':
        default:
            return { kind: 'SAME', text: '—' };
    }
}

function getRowMetaParts(item: PopularRecipeItem): string[] {
    const card = getCardRecipe(item);
    const parts: string[] = [];
    if (card.cookingTime) parts.push(card.cookingTime);
    if (card.servings) parts.push(card.servings);
    const cat = getCategoryLabel(item);
    if (cat) parts.push(cat);
    return parts;
}

function getCategoryLabel(item: PopularRecipeItem): string | null {
    const first = item.recipe.categories?.[0];
    return first?.detailName ?? first?.codeName ?? null;
}

function viewRecipe(recipeId: number): void {
    router.push(`/recipe/${recipeId}`);
}

function scrollToComments(recipeId: number): void {
    router.push(`/recipe/${recipeId}#comments`);
}

async function toggleFavorite(recipeId: number): Promise<void> {
    if (!authStore.memberInfo?.id) return;
    const item = popularRecipes.value.find((r) => r.recipe.id === recipeId);
    if (!item) return;
    try {
        const response = await toggleFavoriteApi(authStore.memberInfo.id, recipeId);
        item.recipe.isFavorite = response.isFavorite;
    } catch (err) {
        console.error('찜 토글 실패:', err);
    }
}

function bookmarkRecipe(recipeId: number): void {
    if (!authStore.memberInfo?.id) {
        showWarn('로그인이 필요한 기능입니다.');
        router.push({ path: '/auth/login', query: { redirect: route.fullPath } });
        return;
    }
    bookmarkRecipeId.value = recipeId;
    bookmarkDialogVisible.value = true;
}

async function onBookmarked(): Promise<void> {
    await loadBookmarkedRecipeIds();
}

async function loadBookmarkedRecipeIds(): Promise<void> {
    if (!authStore.memberInfo?.id) {
        bookmarkedRecipeIds.value = new Set();
        return;
    }
    try {
        const recipeBooks = await getRecipeBooks();
        const ids = new Set<number>();
        for (const recipeBook of recipeBooks) {
            const bookmarks = await getBookmarksByRecipeBook(recipeBook.id);
            bookmarks.forEach((b) => ids.add(b.recipeId));
        }
        bookmarkedRecipeIds.value = ids;
    } catch {
        bookmarkedRecipeIds.value = new Set();
    }
}

function initPeriodFromQuery() {
    const period = route.query.period as string | undefined;
    if (period === '24h' || period === '7d' || period === '30d') {
        selectedPeriod.value = period;
    }
}

onMounted(() => {
    initPeriodFromQuery();
    loadPopularRecipes();
    loadBookmarkedRecipeIds();
});

watch(
    () => route.query.period,
    () => {
        if (skipLoadFromWatch.value) return;
        const prev = selectedPeriod.value;
        initPeriodFromQuery();
        if (selectedPeriod.value !== prev) {
            loadPopularRecipes();
        }
    }
);
</script>

<template>
    <div class="page-container page-container--card">
        <div class="ranking-page">
            <header class="ranking-header">
                <div class="ranking-header__intro">
                    <h1 class="ranking-title">랭킹</h1>
                    <p class="ranking-desc">지금 많은 사람들이 보고 있는 레시피를 기간별로 확인하세요.</p>
                </div>
                <div class="ranking-header__controls">
                    <div class="period-segment" role="tablist" aria-label="랭킹 기간">
                        <button
                            v-for="option in periodOptions"
                            :key="option.value"
                            type="button"
                            role="tab"
                            :aria-selected="selectedPeriod === option.value"
                            :class="['period-segment__btn', { 'is-active': selectedPeriod === option.value }]"
                            @click="changePeriod(option.value)"
                        >
                            {{ option.label }}
                        </button>
                    </div>
                    <p v-if="displayCalculatedAt" class="ranking-calculated-at">기준: {{ displayCalculatedAt }} 갱신</p>
                </div>
            </header>

            <div class="ranking-content">
                <div v-if="loading" class="ranking-skeleton" aria-busy="true" aria-label="랭킹 불러오는 중">
                    <div class="ranking-skeleton__podium">
                        <Skeleton v-for="i in 3" :key="`podium-${i}`" height="280px" border-radius="12px" />
                    </div>
                    <div class="ranking-skeleton__list">
                        <Skeleton v-for="i in 4" :key="`row-${i}`" height="88px" border-radius="12px" />
                    </div>
                </div>

                <div v-else-if="loadError" class="error-state">
                    <p class="error-state__msg">랭킹을 불러오는데 실패했습니다.</p>
                    <button type="button" class="retry-button" @click="loadPopularRecipes">다시 시도</button>
                </div>

                <div v-else-if="popularRecipes.length > 0" class="ranking-list-wrap">
                    <!-- TOP 1~3 포디엄 -->
                    <div v-if="podiumRecipes.length" class="recipe-grid ranking-podium">
                        <div
                            v-for="item in podiumRecipes"
                            :key="item.recipe.id"
                            :class="['ranking-podium__slot', `ranking-podium__slot--${item.rank}`]"
                        >
                            <span :class="['rank-badge', rankBadgeClass(item.rank)]" aria-hidden="true">{{ item.rank }}</span>
                            <template v-for="trend in [getTrendView(item)]" :key="`${item.recipe.id}-trend`">
                                <span
                                    v-if="trend.kind !== 'SAME'"
                                    :class="['rank-trend', `rank-trend--${trend.kind.toLowerCase()}`]"
                                    :title="trend.title"
                                >
                                    {{ trend.text }}
                                </span>
                            </template>
                            <RecipeGridCard
                                :recipe="getCardRecipe(item)"
                                :category-label="getCategoryLabel(item)"
                                :is-bookmarked="bookmarkedRecipeIds.has(item.recipe.id)"
                                show-bookmark
                                show-comment-count
                                @click="viewRecipe"
                                @favorite="toggleFavorite"
                                @bookmark="bookmarkRecipe"
                                @scroll-to-comments="scrollToComments"
                            />
                        </div>
                    </div>

                    <!-- 4위~ 압축 행 -->
                    <ul v-if="displayedListRecipes.length" class="ranking-row-list" aria-label="4위 이하 랭킹">
                        <li
                            v-for="item in displayedListRecipes"
                            :key="item.recipe.id"
                            class="ranking-row"
                            @click="viewRecipe(item.recipe.id)"
                        >
                            <span class="ranking-row__rank" :aria-label="`${item.rank}위`">{{ item.rank }}</span>
                            <div class="ranking-row__thumb">
                                <img :src="resolveRecipeImage(item.recipe.thumbnail)" :alt="item.recipe.title" />
                            </div>
                            <div class="ranking-row__body">
                                <h3 class="ranking-row__title">{{ item.recipe.title }}</h3>
                                <p v-if="getRowMetaParts(item).length" class="ranking-row__meta">
                                    {{ getRowMetaParts(item).join(' · ') }}
                                </p>
                                <div class="ranking-row__footer">
                                    <div class="ranking-row__author">
                                        <img
                                            v-if="item.recipe.memberProfileImage"
                                            :src="resolveProfileImage(item.recipe.memberProfileImage)"
                                            alt=""
                                            class="ranking-row__avatar"
                                        />
                                        <span v-else class="ranking-row__avatar ranking-row__avatar--placeholder" aria-hidden="true">
                                            <i class="pi pi-user"></i>
                                        </span>
                                        <span class="ranking-row__name">{{ item.recipe.memberNickname || item.recipe.memberName }}</span>
                                    </div>
                                    <template v-for="trend in [getTrendView(item)]" :key="`${item.recipe.id}-row-trend`">
                                        <span :class="['rank-trend', `rank-trend--${trend.kind.toLowerCase()}`]" :title="trend.title">
                                            {{ trend.text }}
                                        </span>
                                    </template>
                                </div>
                            </div>
                            <div class="ranking-row__actions" @click.stop>
                                <Button
                                    :icon="item.recipe.isFavorite ? 'pi pi-heart-fill' : 'pi pi-heart'"
                                    :class="['ranking-row__action', { 'is-on': item.recipe.isFavorite }]"
                                    rounded
                                    text
                                    aria-label="찜"
                                    @click="toggleFavorite(item.recipe.id)"
                                />
                                <Button
                                    :icon="bookmarkedRecipeIds.has(item.recipe.id) ? 'pi pi-bookmark-fill' : 'pi pi-bookmark'"
                                    :class="['ranking-row__action', { 'is-on': bookmarkedRecipeIds.has(item.recipe.id) }]"
                                    rounded
                                    text
                                    aria-label="북마크"
                                    @click="bookmarkRecipe(item.recipe.id)"
                                />
                            </div>
                        </li>
                    </ul>

                    <button v-if="hasMoreRecipes" type="button" class="ranking-btn-more" @click="loadMoreRecipes">더보기</button>
                </div>

                <div v-else class="empty-state">
                    <p class="empty-state__msg">아직 랭킹 데이터가 없습니다.</p>
                    <p class="empty-state__hint">다른 기간(일간/주간/월간)을 선택해 보세요.</p>
                </div>
            </div>
        </div>
        <BookmarkDialog v-model:visible="bookmarkDialogVisible" :recipe-id="bookmarkRecipeId" @bookmarked="onBookmarked" />
    </div>
</template>

<style scoped>
.ranking-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 16px;
}

@media (max-width: 768px) {
    .ranking-page {
        padding: 16px 12px;
    }
}

.ranking-header {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

@media (min-width: 769px) {
    .ranking-header {
        flex-direction: row;
        align-items: flex-end;
        justify-content: space-between;
        gap: 1.5rem;
        margin-bottom: 2rem;
    }
}

.ranking-header__intro {
    min-width: 0;
    flex: 1;
}

.ranking-title {
    margin: 0 0 0.35rem;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text-color);
    line-height: 1.25;
}

@media (min-width: 769px) {
    .ranking-title {
        font-size: 1.75rem;
    }
}

.ranking-desc {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.45;
    color: var(--text-color-secondary);
}

.ranking-header__controls {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    max-width: 320px;
}

@media (min-width: 769px) {
    .ranking-header__controls {
        width: auto;
        min-width: 280px;
        align-items: flex-end;
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
}

.period-segment__btn:hover {
    background: var(--surface-200, #e5e7eb);
}

.period-segment__btn.is-active {
    background: var(--primary-color, #f97316);
    color: #fff;
}

.ranking-calculated-at {
    margin: 0;
    font-size: 0.7rem;
    color: var(--text-color-secondary);
    line-height: 1.35;
    text-align: right;
}

@media (min-width: 640px) {
    .ranking-calculated-at {
        font-size: 0.75rem;
    }
}

.ranking-content {
    min-height: 200px;
}

.ranking-skeleton__podium {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 1.25rem;
}

@media (min-width: 769px) {
    .ranking-skeleton__podium {
        grid-template-columns: repeat(3, 1fr);
    }
}

.ranking-skeleton__list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.ranking-list-wrap {
    margin-top: 0;
}

.ranking-podium__slot {
    position: relative;
    container-type: inline-size;
    container-name: recipe-card;
}

.rank-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    font-weight: 700;
    font-size: 0.875rem;
    color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
    pointer-events: none;
}

.rank-badge--gold {
    background: #ca8a04;
}

.rank-badge--silver {
    background: #6b7280;
}

.rank-badge--bronze {
    background: #c2410c;
}

.rank-badge--neutral {
    background: #ea580c;
}

.ranking-podium__slot > .rank-trend {
    position: absolute;
    top: 10px;
    left: 46px;
    z-index: 2;
    pointer-events: none;
}

.rank-trend {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2rem;
    height: 1.5rem;
    padding: 0 0.4rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 700;
    line-height: 1;
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid var(--surface-border, #e5e7eb);
}

.rank-trend--up {
    color: #16a34a;
}

.rank-trend--down {
    color: #dc2626;
}

.rank-trend--new {
    color: var(--primary-color, #f97316);
    font-size: 0.65rem;
    letter-spacing: 0.02em;
}

.rank-trend--same {
    color: var(--text-color-secondary);
    font-weight: 600;
}

.ranking-row-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
}

.ranking-row {
    display: grid;
    grid-template-columns: 2rem 4.5rem minmax(0, 1fr) auto;
    gap: 0.65rem;
    align-items: center;
    padding: 0.65rem 0.75rem;
    border: 1px solid var(--surface-border, #e5e7eb);
    border-radius: 12px;
    background: var(--surface-card, #fff);
    cursor: pointer;
    transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease,
        transform 0.15s ease;
}

.ranking-row:hover {
    border-color: color-mix(in srgb, var(--primary-color, #f97316) 35%, var(--surface-border, #e5e7eb));
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
    transform: translateY(-1px);
}

@media (max-width: 480px) {
    .ranking-row {
        grid-template-columns: 1.75rem 3.75rem minmax(0, 1fr);
        grid-template-rows: auto auto;
    }

    .ranking-row__actions {
        grid-column: 2 / -1;
        justify-content: flex-end;
    }
}

.ranking-row__rank {
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--text-color-secondary);
    text-align: center;
    line-height: 1;
}

.ranking-row__thumb {
    width: 4.5rem;
    height: 4.5rem;
    border-radius: 10px;
    overflow: hidden;
    background: #fff7ed;
    flex-shrink: 0;
}

@media (max-width: 480px) {
    .ranking-row__thumb {
        width: 3.75rem;
        height: 3.75rem;
    }
}

.ranking-row__thumb img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.ranking-row__body {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}

.ranking-row__title {
    margin: 0;
    font-size: 0.9375rem;
    font-weight: 600;
    line-height: 1.35;
    color: var(--text-color);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.ranking-row__meta {
    margin: 0;
    font-size: 0.75rem;
    color: var(--text-color-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.ranking-row__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-top: 0.15rem;
}

.ranking-row__author {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    min-width: 0;
}

.ranking-row__avatar {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 9999px;
    object-fit: cover;
    flex-shrink: 0;
}

.ranking-row__avatar--placeholder {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--surface-100, #f3f4f6);
    color: var(--text-color-secondary);
    font-size: 0.65rem;
}

.ranking-row__name {
    font-size: 0.75rem;
    color: var(--text-color-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.ranking-row__footer .rank-trend {
    background: var(--surface-50, #fafafa);
    flex-shrink: 0;
}

.ranking-row__actions {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
}

.ranking-row__action {
    width: 2rem !important;
    height: 2rem !important;
    color: var(--text-color-secondary) !important;
}

.ranking-row__action.is-on {
    color: var(--primary-color, #f97316) !important;
}

.ranking-btn-more {
    display: block;
    width: 100%;
    max-width: 320px;
    margin: 28px auto 0;
    padding: 14px 24px;
    background: var(--surface-card);
    color: var(--text-color);
    font-size: 1rem;
    font-weight: 600;
    border: 1px solid var(--surface-border);
    border-radius: 12px;
    cursor: pointer;
    transition:
        background 0.2s,
        border-color 0.2s,
        transform 0.15s;
}

.ranking-btn-more:hover {
    background: #fff7ed;
    border-color: color-mix(in srgb, var(--primary-color, #f97316) 40%, var(--surface-border));
    transform: translateY(-1px);
}

.error-state,
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 48px 24px;
}

.error-state__msg,
.empty-state__msg {
    margin: 0 0 0.75rem;
    font-size: 1rem;
    color: var(--text-color);
}

.empty-state__hint {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-color-secondary);
}

.retry-button {
    padding: 10px 24px;
    border-radius: 8px;
    font-weight: 600;
    background: var(--primary-color, #f97316);
    color: white;
    border: none;
    cursor: pointer;
    transition: filter 0.2s;
}

.retry-button:hover {
    filter: brightness(0.95);
}

@media (max-width: 768px) {
    .rank-badge {
        top: 8px;
        left: 8px;
        width: 1.75rem;
        height: 1.75rem;
        font-size: 0.8125rem;
    }

    .ranking-podium__slot > .rank-trend {
        top: 8px;
        left: 40px;
    }
}
</style>
