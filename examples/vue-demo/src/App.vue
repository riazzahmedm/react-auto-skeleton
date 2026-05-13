<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { AutoSkeleton } from "@auto-skeleton/vue";
import "@auto-skeleton/vue/styles.css";

const loading = ref(true);
const debug = ref(false);
let timer: number;

function cycle(showSkeleton: boolean) {
  loading.value = showSkeleton;
  timer = window.setTimeout(() => cycle(!showSkeleton), showSkeleton ? 1500 : 2500);
}

onMounted(() => cycle(false));
onUnmounted(() => window.clearTimeout(timer));

const metrics: [string, string][] = [
  ["Revenue", "$184k"],
  ["Conversion", "4.8%"],
  ["NPS", "58"],
  ["Churn", "1.6%"],
];

const activity = [
  { name: "Amara", action: "Merged PR #312", time: "2m ago" },
  { name: "Kai", action: "Opened issue #88", time: "14m ago" },
  { name: "Priya", action: "Deployed v2.4.1", time: "1h ago" },
];
</script>

<template>
  <div class="page">
    <header class="nav">
      <span class="logo">auto<span class="accent">-skeleton</span> · Vue 3</span>
      <button class="debug-btn" :class="{ active: debug }" @click="debug = !debug">
        Debug {{ debug ? "ON" : "OFF" }}
      </button>
    </header>

    <main class="content">
      <p class="label">auto-cycling · skeleton ↔ content every 1.5s / 2.5s</p>

      <!-- Profile card: circle + text lines -->
      <p class="section-title">Profile Card</p>
      <AutoSkeleton id="vue-profile" :loading="loading" :options="{ debug }">
        <article data-skeleton-container class="card">
          <img
            src="https://picsum.photos/seed/vue/72/72"
            alt="avatar"
            width="72"
            height="72"
            data-skeleton-shape="circle"
            class="avatar"
          />
          <div class="card-body">
            <h2 data-skeleton-lines="1" class="name">Amara Osei · Frontend</h2>
            <p data-skeleton-lines="2" class="bio">
              Building design systems and component libraries. Previously at Vercel and Linear.
            </p>
            <div class="tags">
              <span>Vue 3</span>
              <span>TypeScript</span>
              <span data-skeleton-ignore class="live-badge">● Online</span>
            </div>
          </div>
        </article>
      </AutoSkeleton>

      <!-- Metrics strip: rect bones -->
      <p class="section-title">Metrics Strip</p>
      <AutoSkeleton id="vue-metrics" :loading="loading" :options="{ debug }">
        <div data-skeleton-container class="metrics">
          <article v-for="[label, value] in metrics" :key="label" class="metric-card">
            <p data-skeleton-lines="1" class="metric-label">{{ label }}</p>
            <p data-skeleton-lines="1" class="metric-value">{{ value }}</p>
          </article>
        </div>
      </AutoSkeleton>

      <!-- Activity list: pulse animation -->
      <p class="section-title">Activity List (pulse animation)</p>
      <AutoSkeleton id="vue-activity" :loading="loading" :options="{ animation: 'pulse', debug }">
        <div data-skeleton-container class="activity">
          <div v-for="row in activity" :key="row.name" class="activity-row">
            <img
              :src="`https://picsum.photos/seed/${row.name}/40/40`"
              :alt="row.name"
              width="40"
              height="40"
              data-skeleton-shape="circle"
              class="row-avatar"
            />
            <div class="row-text">
              <p data-skeleton-lines="1" class="row-name">{{ row.name }}</p>
              <p data-skeleton-lines="1" class="row-action">{{ row.action }}</p>
            </div>
            <span data-skeleton-ignore class="row-time">{{ row.time }}</span>
          </div>
        </div>
      </AutoSkeleton>
    </main>
  </div>
</template>

<style>
*, *::before, *::after { box-sizing: border-box; }
body {
  margin: 0;
  background: #07070f;
  color: #e2e4f0;
  font-family: 'DM Sans', ui-sans-serif, sans-serif;
  -webkit-font-smoothing: antialiased;
  --as-base: #1a1a2e;
  --as-highlight: rgba(255,255,255,0.04);
}
</style>

<style scoped>
.page { min-height: 100vh; }

.nav {
  position: sticky; top: 0; z-index: 50;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 24px; height: 52px;
  background: rgba(7,7,15,0.85);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.logo { font-size: 15px; font-weight: 700; }
.accent { color: #7c3aed; }

.debug-btn {
  font-size: 11px; font-weight: 500;
  padding: 5px 12px; border-radius: 6px; cursor: pointer;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05); color: #64748b;
  transition: all 0.2s;
}
.debug-btn.active { background: rgba(124,58,237,0.15); color: #a78bfa; border-color: rgba(124,58,237,0.3); }

.content { max-width: 680px; margin: 0 auto; padding: 48px 20px 100px; display: grid; gap: 12px; }

.label { font-size: 12px; color: #4a5068; text-align: center; margin: 0 0 8px; }

.section-title {
  margin: 20px 0 4px;
  font-size: 11px; font-weight: 600; color: #7c3aed;
  text-transform: uppercase; letter-spacing: 0.08em;
}

.card {
  display: flex; gap: 16px; align-items: center;
  padding: 18px 20px; border-radius: 14px;
  background: #0f0f1a; border: 1px solid rgba(255,255,255,0.07);
}
.avatar { border-radius: 50%; flex-shrink: 0; }
.card-body { flex: 1; }
.name { margin: 0 0 6px; font-size: 15px; font-weight: 600; }
.bio { margin: 0 0 10px; font-size: 13px; color: #4a5068; line-height: 1.55; }
.tags { display: flex; gap: 6px; flex-wrap: wrap; }
.tags span {
  font-size: 11px; padding: 3px 10px; border-radius: 999px;
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: #64748b;
}
.live-badge { color: #06d6a0; border-color: rgba(6,214,160,0.2); background: rgba(6,214,160,0.08); }

.metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.metric-card {
  padding: 14px 16px; border-radius: 12px;
  background: #0f0f1a; border: 1px solid rgba(255,255,255,0.07);
}
.metric-label { margin: 0 0 6px; font-size: 12px; color: #4a5068; }
.metric-value { margin: 0; font-size: 22px; font-weight: 700; }

.activity { display: grid; gap: 6px; }
.activity-row {
  display: grid; grid-template-columns: 40px 1fr auto;
  gap: 12px; align-items: center;
  padding: 10px 14px; border-radius: 10px;
  background: #0f0f1a; border: 1px solid rgba(255,255,255,0.07);
}
.row-avatar { border-radius: 50%; }
.row-name { margin: 0 0 3px; font-size: 13px; font-weight: 500; }
.row-action { margin: 0; font-size: 12px; color: #4a5068; }
.row-time { font-size: 11px; color: #4a5068; white-space: nowrap; }
</style>
