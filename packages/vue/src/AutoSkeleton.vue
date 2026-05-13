<script setup lang="ts">
import { computed, toRef } from "vue";
import { useAutoSkeleton } from "./useAutoSkeleton";
import SkeletonOverlay from "./SkeletonOverlay.vue";
import type { AutoSkeletonProps } from "./types";

const props = defineProps<AutoSkeletonProps>();

const { rootRef, bones, animation, debug, shouldShow } = useAutoSkeleton(
  toRef(props, "id"),
  toRef(props, "loading"),
  toRef(props, "options")
);

// Vue auto-merges any class/style the parent passes onto the root element,
// so we only need to manage the library's own classes here.
const rootClass = computed(() =>
  ["as-root", shouldShow.value ? "as-loading" : ""].filter(Boolean)
);
</script>

<template>
  <div ref="rootRef" :class="rootClass">
    <slot />
    <SkeletonOverlay
      v-if="shouldShow && bones"
      :bones="bones"
      :animation="animation"
      :debug="debug"
    />
  </div>
</template>
