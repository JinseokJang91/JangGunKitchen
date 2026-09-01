<script setup lang="ts">
import type { RecipeIngredientGroup } from '@/types/recipe';

defineProps<{
    ingredientGroups: RecipeIngredientGroup[];
}>();
</script>

<template>
    <div v-if="ingredientGroups && ingredientGroups.length > 0" class="recipe-section-card">
        <h2 class="recipe-section-card__title">
            <i class="pi pi-shopping-cart shrink-0"></i>
            준비물
        </h2>

        <div class="recipe-ingredients">
            <section v-for="(group, groupIndex) in ingredientGroups" :key="`group-${groupIndex}-${group.order}`" class="recipe-ingredients__group">
                <h3 class="recipe-ingredients__group-title">
                    <span class="recipe-ingredients__group-num">{{ groupIndex + 1 }}</span>
                    <span class="min-w-0 break-words">{{ group.customTypeName || group.detailName || '재료' }}</span>
                </h3>

                <ul v-if="group.items && group.items.length > 0" class="recipe-ingredients__list">
                    <li v-for="(item, itemIndex) in group.items" :key="`item-${groupIndex}-${itemIndex}-${item.name}`" class="recipe-ingredients__item">
                        <span class="recipe-ingredients__name">{{ item.name }}</span>
                        <span class="recipe-ingredients__qty">
                            <template v-if="item.quantity">{{ item.quantity }}{{ item.customUnitName || item.detailName }}</template>
                            <template v-else-if="item.customUnitName || item.detailName">{{ item.customUnitName || item.detailName }}</template>
                        </span>
                    </li>
                </ul>

                <p v-else class="recipe-ingredients__empty">항목이 없습니다.</p>
            </section>
        </div>
    </div>
</template>

<style scoped>
.recipe-ingredients {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.recipe-ingredients__group + .recipe-ingredients__group {
    padding-top: 1.25rem;
    border-top: 1px solid #f3e8d8;
}

.recipe-ingredients__group-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0 0 0.75rem;
    font-size: 0.9375rem;
    font-weight: 600;
    color: #1f2937;
}

@media (min-width: 640px) {
    .recipe-ingredients__group-title {
        font-size: 1rem;
    }
}

.recipe-ingredients__group-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 9999px;
    background: var(--primary-color, #f97316);
    color: #fff;
    font-size: 0.75rem;
    font-weight: 700;
    flex-shrink: 0;
}

.recipe-ingredients__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
}

@media (min-width: 768px) {
    .recipe-ingredients__list {
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem 1.5rem;
    }
}

.recipe-ingredients__item {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.75rem;
    min-width: 0;
    padding: 0.25rem 0;
    border-bottom: 1px dashed #f3e8d8;
}

.recipe-ingredients__name {
    font-size: 0.875rem;
    color: #1f2937;
    font-weight: 500;
    min-width: 0;
    word-break: break-word;
}

@media (min-width: 640px) {
    .recipe-ingredients__name {
        font-size: 0.9375rem;
    }
}

.recipe-ingredients__qty {
    font-size: 0.875rem;
    color: #6b7280;
    flex-shrink: 0;
    text-align: right;
    font-variant-numeric: tabular-nums;
}

.recipe-ingredients__empty {
    margin: 0;
    padding: 0.5rem 0;
    text-align: center;
    font-size: 0.875rem;
    color: #9ca3af;
}
</style>
