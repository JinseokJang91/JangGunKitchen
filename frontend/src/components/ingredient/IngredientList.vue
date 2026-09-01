<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Skeleton from 'primevue/skeleton';
import { getIngredientGroups, getIngredients } from '@/api/ingredientApi';
import type { IngredientGroup, Ingredient, IngredientType } from '@/types/ingredient';
import IngredientGroupSelector from './IngredientGroupSelector.vue';
import IngredientGrid from './IngredientGrid.vue';

const router = useRouter();

const props = defineProps<{
    type: IngredientType;
    selectedGroupId?: number | null;
    searchQuery?: string;
}>();

const emit = defineEmits<{
    (e: 'group-selected', groupId: number | null): void;
}>();

/** 로딩 스켈레톤 카드 수 (한 화면 그리드 분량) */
const SKELETON_CARD_COUNT = 12;

const groups = ref<IngredientGroup[]>([]);
const ingredients = ref<Ingredient[]>([]);
// 진입 직후 스피너/빈 화면 깜빡임을 막기 위해 초기값을 true로 둔다
const loading = ref(true);
const error = ref<string | null>(null);
const localSearchQuery = ref(props.searchQuery || '');
const selectedGroupId = ref<number | null>(props.selectedGroupId || null);

const handleGroupSelect = (groupId: number | null) => {
    selectedGroupId.value = groupId;
    emit('group-selected', groupId);
    loadIngredients();
};

const handleIngredientClick = (ingredient: Ingredient) => {
    router.push({
        name: 'ingredientDetail',
        params: { id: ingredient.id },
        query: { type: props.type }
    });
};

const loadGroups = async () => {
    try {
        groups.value = await getIngredientGroups();
    } catch (err) {
        console.error('재료 그룹 로딩 실패:', err);
        error.value = '재료 그룹을 불러올 수 없습니다.';
    }
};

const loadIngredients = async () => {
    loading.value = true;
    error.value = null;

    try {
        const result = await getIngredients({
            groupId: selectedGroupId.value || undefined,
            searchQuery: localSearchQuery.value || undefined,
            type: props.type,
            limit: 100,
            offset: 0
        });

        ingredients.value = result.ingredients;

        // 그룹 목록이 비어있으면 로드
        if (groups.value.length === 0) {
            groups.value = result.groups;
        }
    } catch (err: unknown) {
        console.error('재료 목록 로딩 실패:', err);
        error.value = err instanceof Error ? err.message : '재료를 불러올 수 없습니다.';
    } finally {
        loading.value = false;
    }
};

// props 변경 감지 (탭/그룹/검색 변경 시 재조회)
watch(
    () => props.selectedGroupId,
    (newValue) => {
        selectedGroupId.value = newValue ?? null;
        loadIngredients();
    }
);

watch(
    () => props.searchQuery,
    (newValue) => {
        localSearchQuery.value = newValue || '';
        loadIngredients();
    }
);

watch(
    () => props.type,
    () => {
        loadIngredients();
    }
);

onMounted(() => {
    loadGroups();
    loadIngredients();
});
</script>

<template>
    <div class="ingredient-list">
        <!-- 재료 그룹 선택 -->
        <IngredientGroupSelector :groups="groups" :selected-group-id="selectedGroupId" @select="handleGroupSelect" />

        <!-- 그룹 선택 ↔ 재료 목록 구분 -->
        <div class="list-section-divider" aria-hidden="true"></div>

        <!-- 로딩: 실제 그리드와 같은 레이아웃으로 높이 예약 -->
        <div v-if="loading" class="ingredient-skeleton-grid" aria-busy="true" aria-label="재료 불러오는 중">
            <div v-for="i in SKELETON_CARD_COUNT" :key="`ingredient-skeleton-${i}`" class="ingredient-skeleton-card">
                <div class="ingredient-skeleton-card__image-wrap">
                    <Skeleton shape="circle" width="100%" height="100%" />
                </div>
                <Skeleton width="70%" height="0.875rem" border-radius="6px" />
            </div>
        </div>

        <!-- 에러 상태 -->
        <div v-else-if="error" class="list-state list-state--error text-center py-8">
            <i class="pi pi-exclamation-triangle list-state__icon list-state__icon--error mb-4" aria-hidden="true"></i>
            <h3 class="list-state__title">재료를 불러올 수 없습니다</h3>
            <p class="list-state__message mb-4">{{ error }}</p>
            <Button label="다시 시도" @click="loadIngredients" />
        </div>

        <!-- 재료 목록 -->
        <div v-else-if="ingredients.length > 0">
            <IngredientGrid :ingredients="ingredients" :type="type" @ingredient-click="handleIngredientClick" />
        </div>

        <!-- 빈 상태 -->
        <div v-else class="list-state list-state--empty text-center py-12">
            <i class="pi pi-inbox list-state__icon list-state__icon--muted mb-4" aria-hidden="true"></i>
            <h3 class="list-state__title list-state__title--sub">재료가 없습니다</h3>
            <p class="list-state__hint list-state__hint--muted">검색 조건을 변경해보세요.</p>
        </div>
    </div>
</template>

<style scoped>
.ingredient-list {
    min-height: 400px;
}

@media (max-width: 768px) {
    .ingredient-list {
        min-height: 280px;
    }
}

/* 재료 그룹 선택 ↔ 재료 목록 구분선 */
.list-section-divider {
    height: 1px;
    margin: 1.5rem 0 1.25rem;
    background: var(--surface-border);
}

@media (max-width: 768px) {
    .list-section-divider {
        margin: 1rem 0 0.875rem;
    }
}

/* IngredientGrid와 동일한 열 구성 */
.ingredient-skeleton-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;
}

.ingredient-skeleton-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 20px;
    border: 1px solid rgba(180, 150, 110, 0.2);
    border-radius: 16px;
    background: linear-gradient(165deg, #fefcf9 0%, #faf6f1 50%, #f5f0e8 100%);
    box-sizing: border-box;
}

.ingredient-skeleton-card__image-wrap {
    width: 100%;
    aspect-ratio: 1;
}

.ingredient-skeleton-card__image-wrap :deep(.p-skeleton) {
    width: 100% !important;
    height: 100% !important;
}

@media (max-width: 1024px) {
    .ingredient-skeleton-grid {
        grid-template-columns: repeat(auto-fill, minmax(128px, 1fr));
        gap: 16px;
    }
}

@media (max-width: 768px) {
    .ingredient-skeleton-grid {
        grid-template-columns: repeat(auto-fill, minmax(108px, 1fr));
        gap: 12px;
    }

    .ingredient-skeleton-card {
        padding: 14px;
        border-radius: 14px;
        gap: 8px;
    }
}

@media (max-width: 480px) {
    .ingredient-skeleton-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
    }

    .ingredient-skeleton-card {
        padding: 12px;
        border-radius: 12px;
    }
}

@media (max-width: 360px) {
    .ingredient-skeleton-grid {
        gap: 8px;
    }
}

.list-state__icon {
    display: inline-block;
    font-size: 3rem;
    line-height: 1;
}

.list-state__icon--error {
    color: var(--red-500, #ef4444);
}

.list-state__icon--muted {
    color: #9ca3af;
}

.list-state__title {
    margin: 0 0 0.5rem;
    font-size: 1.375rem;
    font-weight: 600;
    color: #4b5563;
}

.list-state__title--sub {
    font-size: 1.125rem;
}

.list-state__message {
    margin: 0;
    font-size: 0.9375rem;
    color: #4b5563;
    line-height: 1.5;
    word-break: break-word;
}

.list-state__hint {
    margin: 0.75rem 0 0;
    font-size: 0.9375rem;
    color: #4b5563;
}

.list-state__hint--muted {
    color: #6b7280;
}

@media (max-width: 768px) {
    .list-state--error,
    .list-state--empty {
        padding-top: 1.5rem;
        padding-bottom: 1.5rem;
    }

    .list-state__icon {
        font-size: 2.5rem;
    }

    .list-state__title {
        font-size: 1.125rem;
    }

    .list-state__title--sub {
        font-size: 1rem;
    }

    .list-state__message,
    .list-state__hint {
        font-size: 0.875rem;
    }
}
</style>
