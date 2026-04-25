<template>
  <div class="page">

    <!-- Header -->
    <div class="page-header">
      <h2 class="page-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
        </svg>
        ផ្ទាំងគ្រប់គ្រង
      </h2>
      <span class="current-month">{{ currentMonth }}</span>
    </div>

    <!-- Summary Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-num blue">{{ stats.totalRooms }}</div>
        <div class="stat-label">បន្ទប់សរុប</div>
      </div>
      <div class="stat-card">
        <div class="stat-num green">{{ stats.occupied }}</div>
        <div class="stat-label">កំពុងជួល</div>
      </div>
      <div class="stat-card">
        <div class="stat-num amber">{{ stats.available }}</div>
        <div class="stat-label">ទំនេរ</div>
      </div>
      <div class="stat-card">
        <div class="stat-num red">{{ formatKHR(stats.totalRevenue) }}</div>
        <div class="stat-label">ចំណូលសរុប (៛)</div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>កំពុងផ្ទុក...</p>
    </div>

    <!-- Room Cards -->
    <div v-else>
      <div class="section-title">ទិដ្ឋភាពខែបច្ចុប្បន្ន</div>
      <div class="rooms-grid">
        <div
          class="room-card"
          v-for="room in rooms"
          :key="room.id"
        >
          <!-- Card Header -->
          <div class="room-head" :class="room.status === 'occupied' ? 'occ' : 'avail'">
            <span class="room-name" :class="room.status === 'occupied' ? 'occ' : 'avail'">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              {{ room.name }}
            </span>
            <span class="room-badge" :class="room.status === 'occupied' ? 'occ' : 'avail'">
              {{ room.status === 'occupied' ? 'កំពុងជួល' : 'ទំនេរ' }}
            </span>
          </div>

          <!-- Card Body -->
          <div class="room-body">
            <div class="tenant-row">
              <div class="avatar">{{ room.tenant_name?.charAt(0) || '?' }}</div>
              <div class="tenant-info">
                <span class="tenant-lbl">អ្នកជួល</span>
                <span class="tenant-name-text">{{ room.tenant_name || '—' }}</span>
              </div>
            </div>

            <template v-if="room.month">
              <div class="usage-row">
                <div v-if="Number(room.electric_usage) > 0" class="usage-box elec">
                  <div class="usage-label">អគ្គិសនី</div>
                  <div class="usage-val elec">{{ parseFloat(room.electric_usage).toFixed(1) }} kWh</div>
                </div>
                <!-- Water usage — commented out, not needed for now
                <div v-if="Number(room.water_usage) > 0" class="usage-box water">
                  <div class="usage-label">ទឹក</div>
                  <div class="usage-val water">{{ parseFloat(room.water_usage).toFixed(1) }} m³</div>
                </div>
                -->
              </div>
              <div class="cost-row">
                <span class="cost-badge">{{ formatKHR(room.total_cost) }} ៛</span>
              </div>
            </template>
            <div v-else class="no-record">មិនទាន់មានកំណត់ត្រាខែនេះ</div>
          </div>

          <!-- Card Footer -->
          <div class="room-foot">
            <router-link :to="`/rooms/${room.id}`" class="detail-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              មើលលម្អិត
            </router-link>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useToast } from "../composables/useToast";
import { getDashboard } from "../services/api.js";

const rooms = ref([]);
const loading = ref(true);
const toast = useToast();

const currentMonth = computed(() => {
  const now = new Date();
  return now.toLocaleString("km-KH", { month: "long", year: "numeric" });
});

const stats = computed(() => {
  const totalRooms = rooms.value.length;
  const occupied = rooms.value.filter((r) => r.status === "occupied").length;
  const available = totalRooms - occupied;
  const totalRevenue = rooms.value.reduce(
    (sum, r) => sum + (parseFloat(r.total_cost) || 0),
    0
  );
  // water_usage is available in room data but not displayed — commented out
  // const totalWater = rooms.value.reduce((sum, r) => sum + (parseFloat(r.water_usage) || 0), 0);
  return { totalRooms, occupied, available, totalRevenue };
});

const formatKHR = (n) => Number(n || 0).toLocaleString("km-KH");

onMounted(async () => {
  try {
    const res = await getDashboard();
    rooms.value = res.data.data;
  } catch (e) {
    toast.error("មិនអាចផ្ទុកផ្ទាំងគ្រប់គ្រង។ សូមពិនិត្យការតភ្ជាប់ API។");
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* ── Page ── */
.page {
  padding: 2rem 0;
  max-width: 1440px;
  margin: 0 auto;
  font-family: 'Outfit', 'Segoe UI', sans-serif;
}

/* ── Header ── */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.75rem;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 19px;
  font-weight: 600;
  color: #d0e4ff;
  margin: 0;
}

.page-title svg { color: #4aadff; }

.current-month {
  font-size: 13px;
  color: rgba(150, 190, 255, 0.45);
}

/* ── Stats Grid ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 1.75rem;
}

.stat-card {
  background: #111e33;
  border: 0.5px solid rgba(99, 180, 255, 0.1);
  border-radius: 14px;
  padding: 1.1rem 1rem;
  text-align: center;
}

.stat-num {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 5px;
}

.stat-num.blue  { color: #4aadff; }
.stat-num.green { color: #4ade80; }
.stat-num.amber { color: #fbbf24; }
.stat-num.red   { color: #f87171; font-size: 18px; margin-top: 4px; }

.stat-label {
  font-size: 11.5px;
  color: rgba(150, 190, 255, 0.45);
}

/* ── Section title ── */
.section-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: rgba(150, 190, 255, 0.45);
  margin-bottom: 12px;
}

/* ── Loading ── */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5rem 0;
  gap: 14px;
  color: rgba(180, 210, 255, 0.35);
  font-size: 14px;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 2px solid rgba(99, 180, 255, 0.12);
  border-top-color: #4aadff;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ── Rooms Grid ── */
.rooms-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

/* ── Room Card ── */
.room-card {
  background: #111e33;
  border: 0.5px solid rgba(99, 180, 255, 0.1);
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Card Header */
.room-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
}

.room-head.occ {
  background: rgba(74, 222, 128, 0.08);
  border-bottom: 0.5px solid rgba(74, 222, 128, 0.15);
}

.room-head.avail {
  background: rgba(99, 180, 255, 0.04);
  border-bottom: 0.5px solid rgba(99, 180, 255, 0.08);
}

.room-name {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 600;
}

.room-name.occ   { color: #4ade80; }
.room-name.avail { color: rgba(150, 190, 255, 0.45); }

.room-badge {
  font-size: 11px;
  padding: 2px 10px;
  border-radius: 20px;
  font-weight: 500;
}

.room-badge.occ {
  background: rgba(74, 222, 128, 0.15);
  color: #4ade80;
  border: 0.5px solid rgba(74, 222, 128, 0.25);
}

.room-badge.avail {
  background: rgba(150, 190, 255, 0.07);
  color: rgba(150, 190, 255, 0.45);
  border: 0.5px solid rgba(150, 190, 255, 0.12);
}

/* Card Body */
.room-body {
  padding: 12px 14px;
  flex: 1;
}

.tenant-row {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 11px;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(37, 99, 184, 0.4);
  border: 0.5px solid rgba(99, 180, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #7dc4ff;
  flex-shrink: 0;
}

.tenant-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.tenant-lbl {
  font-size: 10px;
  color: rgba(150, 190, 255, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.tenant-name-text {
  font-size: 13px;
  font-weight: 500;
  color: rgba(210, 230, 255, 0.85);
}

/* Usage */
.usage-row {
  display: grid;
  /* grid-template-columns: 1fr 1fr; */
  gap: 8px;
  margin-bottom: 10px;
}

.usage-box {
  border-radius: 9px;
  padding: 8px 10px;
  text-align: center;
}

.usage-box.elec {
  background: rgba(251, 191, 36, 0.08);
  border: 0.5px solid rgba(251, 191, 36, 0.15);
}

/* Water usage styles — commented out, not needed for now
.usage-box.water {
  background: rgba(74, 173, 255, 0.08);
  border: 0.5px solid rgba(74, 173, 255, 0.15);
}
*/

.usage-label {
  font-size: 10px;
  color: rgba(150, 190, 255, 0.35);
  margin-bottom: 3px;
}

.usage-val {
  font-size: 12px;
  font-weight: 600;
}

.usage-val.elec  { color: #fbbf24; }
/* .usage-val.water { color: #4aadff; } */

.cost-row {
  display: flex;
  justify-content: flex-end;
}

.cost-badge {
  background: rgba(248, 113, 113, 0.12);
  color: #f87171;
  border: 0.5px solid rgba(248, 113, 113, 0.2);
  border-radius: 20px;
  padding: 3px 12px;
  font-size: 12px;
  font-weight: 600;
}

.no-record {
  font-size: 12px;
  color: rgba(150, 190, 255, 0.28);
  font-style: italic;
  padding: 4px 0;
}

/* Card Footer */
.room-foot {
  padding: 10px 14px;
  border-top: 0.5px solid rgba(99, 180, 255, 0.06);
}

.detail-btn {
  width: 100%;
  padding: 7px 12px;
  font-size: 12px;
  font-weight: 500;
  color: #4aadff;
  background: rgba(37, 99, 184, 0.15);
  border: 0.5px solid rgba(99, 180, 255, 0.2);
  border-radius: 9px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: inherit;
  text-decoration: none;
  transition: background 0.15s;
}

.detail-btn:hover { background: rgba(37, 99, 184, 0.28); }

/* ── Responsive ── */
@media (max-width: 768px) {
  .page { padding: 1rem; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .stat-num { font-size: 22px; }
  .stat-num.red { font-size: 15px; }
  .page-title { font-size: 16px; }
}

@media (max-width: 1024px) {
  .rooms-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
  .rooms-grid { grid-template-columns: 1fr; }
}
</style>