<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import IngredientList from '@/components/ingredient/IngredientList.vue';

const route = useRoute();
const router = useRouter();

const activeTab = ref<'storage' | 'preparation'>('storage');
const selectedGroupId = ref<number | null>(null);
const searchQuery = ref('');

/** 768px 이하에서만 검색 UI 간소화 (데스크톱은 기존과 동일) */
const isNarrowTopBar = ref(typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches);

let narrowTopBarMql: MediaQueryList | null = null;

function syncNarrowTopBar() {
    isNarrowTopBar.value = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
}

const searchPlaceholder = computed(() => (isNarrowTopBar.value ? '재료명 검색 (예: 감자, 계란)' : '재료명을 검색하세요...(예: 감자, 계란)'));

// URL 쿼리 파라미터로 탭 상태 복원
onMounted(() => {
    narrowTopBarMql = window.matchMedia('(max-width: 768px)');
    syncNarrowTopBar();
    narrowTopBarMql.addEventListener('change', syncNarrowTopBar);

    const type = route.query.type as string;
    if (type === 'preparation') {
        activeTab.value = 'preparation';
    } else {
        activeTab.value = 'storage';
    }

    const groupId = route.query.groupId as string;
    if (groupId) {
        selectedGroupId.value = parseInt(groupId);
    }

    const search = route.query.search as string;
    if (search) {
        searchQuery.value = search;
    }
});

// 탭 변경 시 URL 쿼리 파라미터 업데이트
watch(activeTab, () => {
    updateQuery();
});

const handleGroupSelected = (groupId: number | null) => {
    selectedGroupId.value = groupId;
    updateQuery();
};

const updateQuery = () => {
    const query: Record<string, string> = { type: activeTab.value };

    if (selectedGroupId.value) {
        query.groupId = selectedGroupId.value.toString();
    }

    if (searchQuery.value) {
        query.search = searchQuery.value;
    }

    router.replace({ query });
};

// URL 쿼리 변경 감지
watch(
    () => route.query,
    (newQuery) => {
        if (newQuery.type === 'preparation' && activeTab.value !== 'preparation') {
            activeTab.value = 'preparation';
        } else if (newQuery.type !== 'preparation' && activeTab.value !== 'storage') {
            activeTab.value = 'storage';
        }

        if (newQuery.groupId) {
            selectedGroupId.value = parseInt(newQuery.groupId as string);
        } else {
            selectedGroupId.value = null;
        }

        if (newQuery.search) {
            searchQuery.value = newQuery.search as string;
        } else {
            searchQuery.value = '';
        }
    },
    { immediate: true }
);

onUnmounted(() => {
    narrowTopBarMql?.removeEventListener('change', syncNarrowTopBar);
});
</script>

<template>
    <div class="page-container page-container--card ingredient-management" :class="{ 'page-container--wide': isNarrowTopBar }">
        <div class="ingredient-panel">
            <!-- 검색: 모바일(≤768px)만 간소화, 데스크톱은 기존 긴 placeholder -->
            <div class="top-row">
                <span class="p-input-icon-left search-bar">
                    <InputText v-model="searchQuery" :placeholder="searchPlaceholder" class="w-full" @input="updateQuery()" />
                </span>
            </div>

            <!-- 검색 영역 하단 구분선 (Category.vue .category-tabs-panel과 동일) -->
            <div class="tab-panel-wrap">
                <Tabs v-model:value="activeTab" class="ingredient-tabs">
                    <TabList>
                        <Tab value="storage">재료 보관법</Tab>
                        <Tab value="preparation">재료 손질법</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel value="storage">
                            <IngredientList type="storage" :selected-group-id="selectedGroupId" :search-query="searchQuery" @group-selected="handleGroupSelected" />
                        </TabPanel>
                        <TabPanel value="preparation">
                            <IngredientList type="preparation" :selected-group-id="selectedGroupId" :search-query="searchQuery" @group-selected="handleGroupSelected" />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* 바깥 카드: 모바일에서 좌우 여백 회수 (.page-container--card 패딩 보정) */
@media (max-width: 768px) {
    .ingredient-management.page-container--card {
        padding: 0.625rem;
    }
}

/* 배경 단순화: 페이지 배경(오렌지) → 하나의 흰색 카드. 테두리는 Category.vue .category-selector와 동일 */
.ingredient-panel {
    background: var(--surface-card);
    border: 1px solid #fed7aa;
    border-radius: 12px;
    padding: 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
}

@media (max-width: 768px) {
    .ingredient-panel {
        box-shadow: none;
        border-radius: 10px;
    }
}

.top-row {
    display: flex;
    width: 100%;
    box-sizing: border-box;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: #fff7ed;
    border-bottom: 1px solid #fed7aa;
    flex-shrink: 0;
}

/* 검색창 너비: 데스크톱은 Category.vue .category-search-input 과 동일(최대 400px) */
.search-bar {
    flex: 0 1 400px;
    max-width: 400px;
    min-width: 0;
}

/* Category.vue .category-search 와 동일한 입력 타이포 (placeholder 포함 동일 크기) */
.search-bar :deep(.p-inputtext) {
    width: 100%;
    box-sizing: border-box;
    font-size: 0.8125rem;
    padding: 0.4rem 0.65rem;
    min-height: 2.35rem;
}

@media (min-width: 768px) {
    .search-bar :deep(.p-inputtext) {
        font-size: 0.875rem;
        padding: 0.5rem 0.75rem;
        min-height: 2.5rem;
    }
}

/* 탭/리스트 영역: 같은 카드 안에 이어지도록 테두리만 구분 (별도 흰 박스 제거) */
.tab-panel-wrap {
    padding: 0.5rem 0.5rem 0.5rem;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
}

/* PrimeVue Tabs: 내부 박스 스타일 제거 → 카드와 한 블록으로 보이게 */
.ingredient-tabs {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    border: none;
    border-radius: 0;
    overflow: hidden;
    background: transparent;
}

.ingredient-tabs :deep(.p-tablist) {
    flex-shrink: 0;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.5rem;
}

.ingredient-tabs :deep(.p-tabpanels) {
    flex: 1;
    min-height: 0;
    padding-left: 1rem;
    padding-right: 1rem;
}

.ingredient-tabs :deep(.p-tabpanel) {
    min-height: 0;
    padding-top: 1rem;
}

@media (max-width: 768px) {
    /* 모바일: 검색이 남는 가로를 채움 */
    .search-bar {
        flex: 1 1 0;
        max-width: none;
    }

    .top-row {
        flex-direction: row;
        align-items: center;
        gap: 0.625rem;
        padding: 0.875rem 1rem;
    }

    /* 입력 타이포는 상단 공통 규칙(Category.vue와 동일) 유지 — 여기서 font-size 덮어쓰지 않음 */
    /* 모바일 탭: 균등 분할 + 터치 영역 */
    .ingredient-tabs :deep(.p-tablist) {
        width: 100%;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        padding-top: 0.375rem;
    }

    .ingredient-tabs :deep(.p-tablist-content) {
        width: 100%;
    }

    .ingredient-tabs :deep(.p-tablist-tab-list) {
        display: flex;
        width: 100%;
        align-items: stretch;
    }

    .ingredient-tabs :deep(.p-tab) {
        flex: 1 1 0;
        min-width: 0;
        justify-content: center;
        text-align: center;
        min-height: 2.75rem;
        font-size: 0.9rem;
        padding: 0.6rem 0.35rem;
    }

    .tab-panel-wrap {
        padding: 0.25rem 0 0.625rem;
    }

    .ingredient-tabs :deep(.p-tabpanels) {
        padding-left: 0.5rem;
        padding-right: 0.5rem;
    }

    .ingredient-tabs :deep(.p-tabpanel) {
        padding-top: 0.75rem;
    }
}
</style>
