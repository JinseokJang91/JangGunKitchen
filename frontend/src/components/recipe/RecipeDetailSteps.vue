<script setup lang="ts">
import type { RecipeStep } from '@/types/recipe';
import { resolveMediaUrl } from '@/utils/image';

defineProps<{
    steps: RecipeStep[];
}>();
</script>

<template>
    <div class="recipe-section-card">
        <h2 class="recipe-section-card__title">
            <i class="pi pi-list shrink-0"></i>
            조리 순서
        </h2>

        <ol class="recipe-steps">
            <li v-for="(step, index) in steps" :key="`step-${index}-${step.order}`" class="recipe-steps__item" :class="{ 'recipe-steps__item--with-image': !!step.imageUrl }">
                <div v-if="step.imageUrl" class="recipe-steps__media">
                    <img :src="resolveMediaUrl(step.imageUrl)" :alt="`단계 ${index + 1} 이미지`" class="recipe-steps__img" />
                </div>
                <div class="recipe-steps__body">
                    <span class="recipe-steps__num" aria-hidden="true">{{ index + 1 }}</span>
                    <p class="recipe-steps__text">{{ step.text }}</p>
                </div>
            </li>
        </ol>
    </div>
</template>

<style scoped>
.recipe-steps {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.recipe-steps__item {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

@media (min-width: 768px) {
    .recipe-steps__item--with-image {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.25rem;
        align-items: start;
    }
}

.recipe-steps__media {
    width: 100%;
    overflow: hidden;
    border-radius: 0.5rem;
    border: 1px solid #f3e8d8;
    background: #fff7ed;
}

.recipe-steps__img {
    display: block;
    width: 100%;
    height: 12rem;
    max-height: 50vh;
    object-fit: contain;
}

@media (min-width: 480px) {
    .recipe-steps__img {
        height: 14rem;
    }
}

@media (min-width: 768px) {
    .recipe-steps__img {
        height: 16rem;
    }
}

.recipe-steps__body {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    min-width: 0;
}

.recipe-steps__num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    background: var(--primary-color, #f97316);
    color: #fff;
    font-size: 0.875rem;
    font-weight: 700;
    flex-shrink: 0;
}

@media (min-width: 640px) {
    .recipe-steps__num {
        width: 2.25rem;
        height: 2.25rem;
        font-size: 1rem;
    }
}

.recipe-steps__text {
    margin: 0;
    flex: 1;
    min-width: 0;
    font-size: 0.9375rem;
    line-height: 1.65;
    color: #374151;
    white-space: pre-line;
    padding-top: 0.2rem;
}

@media (min-width: 640px) {
    .recipe-steps__text {
        font-size: 1rem;
    }
}
</style>
