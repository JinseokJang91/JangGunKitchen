<script setup lang="ts">
import { computed } from 'vue';
import Galleria from 'primevue/galleria';
import type { RecipeImage } from '@/types/recipe';
import { resolveMediaUrl } from '@/utils/image';

const props = defineProps<{
    images: RecipeImage[];
}>();

/** 메인 이미지 제외. 남은 게 없으면(또는 원래 1장뿐이면) 섹션 자체를 숨김 */
const galleryImages = computed(() => {
    const list = props.images || [];
    if (list.length <= 1) return [];

    const isMain = (img: RecipeImage & { mainImage?: boolean }) => !!(img.mainImage ?? img.isMainImage);
    const hasExplicitMain = list.some((img) => isMain(img as RecipeImage & { mainImage?: boolean }));

    if (hasExplicitMain) {
        return list.filter((img) => !isMain(img as RecipeImage & { mainImage?: boolean }));
    }
    // 플래그가 없으면 첫 장을 메인으로 간주
    return list.slice(1);
});

const galleriaResponsiveOptions = [
    { breakpoint: '1400px', numVisible: 5 },
    { breakpoint: '992px', numVisible: 4 },
    { breakpoint: '768px', numVisible: 3 },
    { breakpoint: '576px', numVisible: 2 },
    { breakpoint: '420px', numVisible: 1 }
];
</script>

<template>
    <div v-if="galleryImages.length > 0" class="recipe-section-card">
        <h2 class="recipe-section-card__title">
            <i class="pi pi-images shrink-0"></i>
            이미지 갤러리
        </h2>
        <Galleria :value="galleryImages" :num-visible="5" :responsive-options="galleriaResponsiveOptions" thumbnails-position="bottom" container-class="galleria-thumbnail-container" show-item-navigators show-thumbnail-navigators>
            <template #item="slotProps">
                <img :src="resolveMediaUrl(slotProps.item.url)" :alt="slotProps.item.fileName || '갤러리 이미지'" class="galleria-main-img w-full block object-contain rounded-lg" />
            </template>
            <template #thumbnail="slotProps">
                <img :src="resolveMediaUrl(slotProps.item.url)" :alt="slotProps.item.fileName || '썸네일'" class="w-full block object-cover rounded cursor-pointer" />
            </template>
        </Galleria>
    </div>
</template>

<style scoped>
.galleria-main-img {
    max-height: min(50vh, 280px);
    width: 100%;
    background: #fff7ed;
}

@media (min-width: 480px) {
    .galleria-main-img {
        max-height: min(55vh, 380px);
    }
}

@media (min-width: 768px) {
    .galleria-main-img {
        max-height: 480px;
    }
}

:deep(.galleria-thumbnail-container) {
    max-width: 100%;
}

:deep([data-pc-group-section='itemnavigator']) {
    width: 2.75rem;
    height: 2.75rem;
    min-width: 44px;
    min-height: 44px;
}

@media (min-width: 768px) {
    :deep([data-pc-group-section='itemnavigator']) {
        width: 2.5rem;
        height: 2.5rem;
        min-width: unset;
        min-height: unset;
    }
}

:deep([data-pc-group-section='thumbnailnavigator']) {
    min-width: 2.75rem;
    min-height: 2.75rem;
}

@media (min-width: 768px) {
    :deep([data-pc-group-section='thumbnailnavigator']) {
        min-width: unset;
        min-height: unset;
    }
}
</style>
