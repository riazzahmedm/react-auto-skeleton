<script setup lang="ts">
import type { Bone } from "@auto-skeleton/core";

defineProps<{
  bones: Bone[];
  animation: "wave" | "pulse" | "none";
  debug: boolean;
}>();
</script>

<template>
  <div class="as-overlay" aria-hidden="true">
    <span
      v-for="(bone, i) in bones"
      :key="`${bone.x}-${bone.y}-${i}`"
      :class="`as-bone as-${animation}${debug ? ' as-debug' : ''}`"
      :style="{
        left: `${bone.x}px`,
        top: `${bone.y}px`,
        width: `${bone.width}px`,
        height: `${bone.height}px`,
        borderRadius: bone.kind === 'circle' ? '50%' : `${bone.radius}px`,
      }"
    />
  </div>
</template>
