import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import type { Ref } from "vue";
import { scanBones, type Bone } from "@auto-skeleton/core";
import { getCachedBones, setCachedBones, clearCachedBones } from "./cache";
import type { AutoSkeletonOptions } from "./types";

export function useAutoSkeleton(
  id: Ref<string>,
  loading: Ref<boolean>,
  options: Ref<AutoSkeletonOptions | undefined>
) {
  const rootRef = ref<HTMLDivElement | null>(null);
  const cacheEnabled = computed(() => options.value?.cache ?? true);
  const bones = ref<Bone[] | null>(
    cacheEnabled.value ? getCachedBones(id.value) : null
  );

  let scanTimer: number | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let mutationObserver: MutationObserver | null = null;

  function runScan() {
    if (!rootRef.value) return;
    const next = scanBones(rootRef.value, {
      ignoreSelectors: options.value?.ignoreSelectors,
      minSize: options.value?.minSize,
    });
    bones.value = next;
    setCachedBones(id.value, next, cacheEnabled.value);
  }

  function schedule() {
    if (scanTimer !== null) window.clearTimeout(scanTimer);
    scanTimer = window.setTimeout(runScan, options.value?.watchDebounceMs ?? 120);
  }

  function setupWatchers() {
    if (!rootRef.value || loading.value) return;
    if ((options.value?.watch ?? true) === false) return;

    const rootEl = rootRef.value;

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", schedule);
      return;
    }

    resizeObserver = new ResizeObserver(() => schedule());
    mutationObserver = new MutationObserver(() => schedule());
    resizeObserver.observe(rootEl);
    mutationObserver.observe(rootEl, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    });
    // Window resize is the fallback — only used when ResizeObserver is unavailable
  }

  function teardownWatchers() {
    if (scanTimer !== null) {
      window.clearTimeout(scanTimer);
      scanTimer = null;
    }
    window.removeEventListener("resize", schedule);
    resizeObserver?.disconnect();
    mutationObserver?.disconnect();
    resizeObserver = null;
    mutationObserver = null;
  }

  // Re-scan and re-wire watchers whenever loading flips
  watch(loading, (isLoading) => {
    teardownWatchers();
    if (!isLoading) {
      runScan();
      setupWatchers();
    }
  });

  watch(cacheEnabled, (enabled) => {
    if (!enabled) clearCachedBones(id.value);
  });

  onMounted(() => {
    if (!loading.value) runScan();
    setupWatchers();
  });

  onUnmounted(teardownWatchers);

  const animation = computed(() => options.value?.animation ?? "wave");
  const debug = computed(() => options.value?.debug ?? false);
  const shouldShow = computed(
    () => loading.value && !!bones.value && bones.value.length > 0
  );

  return { rootRef, bones, animation, debug, shouldShow };
}
