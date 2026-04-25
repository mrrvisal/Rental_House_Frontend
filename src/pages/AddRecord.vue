<template>
  <div class="page">

    <!-- Back Button -->
    <div class="back-row">
      <router-link :to="`/rooms/${roomId}`" class="back-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        ត្រឡប់ទៅលម្អិតបន្ទប់
      </router-link>
    </div>

    <!-- Card -->
    <div class="card">

      <!-- Card Header -->
      <div class="card-head">
        <div class="card-head-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          បន្ថែមកំណត់ត្រាប្រចាំខែ — {{ roomName }}
        </div>
      </div>

      <div class="card-body">

        <!-- Auto-filled notice -->
        <div v-if="lastRecord" class="notice-info">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          ការអានដោយស្វ័យប្រវត្តិពី
          <strong>{{ lastRecord.month }}/{{ lastRecord.day }}</strong>:
          អគ្គិសនី <strong>{{ lastRecord.new_electric }}</strong> kWh
          <!-- , ទឹក <strong>{{ lastRecord.new_water }}</strong> m³ -->
        </div>

        <!-- Tabs -->
        <!-- Water tab commented out — not needed for now
        <div class="tabs">
          <button class="tab" :class="{ active: activeTab === 'electric' }" @click="activeTab = 'electric'">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            អគ្គិសនី
          </button>
          <button class="tab water" :class="{ active: activeTab === 'water' }" @click="activeTab = 'water'">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>
            ទឹក
          </button>
          <button class="tab both" :class="{ active: activeTab === 'both' }" @click="activeTab = 'both'">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            ទាំងពីរ
          </button>
        </div>
        -->

        <form @submit.prevent="submitForm">
          <div class="form-grid">

            <!-- Month & Day -->
            <div class="field">
              <label>ខែ <span class="required">*</span></label>
              <input v-model="form.month" type="month" required />
            </div>
            <div class="field">
              <label>ថ្ងៃ <span class="required">*</span></label>
              <input v-model="form.day" type="number" min="1" max="31" required />
            </div>
            <div class="field">
              <label>កាលបរិច្ឆេទពេញលេញ</label>
              <input type="text" :value="form.month + '/' + (form.day || '')" readonly class="readonly" />
            </div>

            <div class="divider"></div>

            <!-- ═══ ELECTRICITY SECTION ═══ -->
            <!-- v-if="activeTab === 'electric' || activeTab === 'both'" — tabs removed, always show electric -->
            <div class="section-label elec">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              អគ្គិសនី
            </div>

            <div class="field">
              <label>លេខចាស់ (kWh)</label>
              <input v-model="form.old_electric" type="number" readonly class="readonly" />
              <span class="field-hint">ស្វ័យប្រវត្តិពីខែមុន</span>
            </div>
            <div class="field">
              <label>លេខថ្មី (kWh) <span class="required">*</span></label>
              <input v-model.number="form.new_electric" type="number" step="0.1" min="0" required />
            </div>
            <div class="field">
              <label>តម្លៃក្នុង kWh (៛) <span class="required">*</span></label>
              <input v-model="form.electric_price" type="number" step="0.1" min="0" required />
            </div>

            <!-- Electric Cost Preview -->
            <div class="col-full" v-if="electricPreview.usage >= 0">
              <div class="preview-box elec">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                ការប្រើប្រាស់:
                <strong>{{ electricPreview.usage }} kWh</strong> ×
                {{ formatKHR(form.electric_price) }} ៛ =
                <strong class="preview-total elec">{{ formatKHR(electricPreview.total) }} ៛</strong>
              </div>
            </div>

            <!-- Electric Image Upload -->
            <div class="col-full">
              <label class="field-label-sm">រូបភាពម៉ែត្រអគ្គិសនី</label>
              <div class="upload-box elec">
                <input type="file" accept="image/*" @change="onFileChange($event, 'electric')" class="file-input" />
                <div v-if="previews.electric" class="upload-preview">
                  <img :src="previews.electric" class="meter-img" alt="ម៉ែត្រអគ្គិសនី" />
                  <div class="ai-scan-panel">
                    <button
                      v-if="!aiState.electric.loading && aiState.electric.value === null && !aiState.electric.error"
                      type="button"
                      class="ai-scan-btn elec"
                      @click="runAIScan('electric')"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 14 14"/></svg>
                      AI អានលេខ
                    </button>
                    <div v-if="aiState.electric.loading" class="ai-loading">
                      <div class="ai-pulse elec"></div>
                      <span>AI កំពុងស្កែន...</span>
                    </div>
                    <div v-if="aiState.electric.value !== null && !aiState.electric.loading" class="ai-result elec">
                      <div class="ai-result-label">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        AI បានរកឃើញ
                      </div>
                      <div class="ai-result-value">{{ aiState.electric.value }} <span class="ai-result-unit">kWh</span></div>
                      <div class="ai-result-actions">
                        <button type="button" class="ai-action apply" @click="form.new_electric = aiState.electric.value">✓ ប្រើលេខនេះ</button>
                        <button type="button" class="ai-action retry" @click="aiState.electric = { loading: false, value: null, error: null }; runAIScan('electric')">↺ ម្ដងទៀត</button>
                      </div>
                    </div>
                    <div v-if="aiState.electric.error && !aiState.electric.loading" class="ai-error">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      {{ aiState.electric.error }}
                      <button type="button" class="ai-action retry mt-1" @click="aiState.electric.error = null; runAIScan('electric')">↺ ព្យាយាមម្ដងទៀត</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ═══ WATER SECTION — commented out, not needed for now ═══
            <div class="divider"></div>
            <div class="section-label water">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>
              ទឹក
            </div>

            <div class="field">
              <label>លេខចាស់ (m³)</label>
              <input v-model="form.old_water" type="number" readonly class="readonly" />
              <span class="field-hint">ស្វ័យប្រវត្តិពីខែមុន</span>
            </div>
            <div class="field">
              <label>លេខថ្មី (m³) <span class="required">*</span></label>
              <input v-model.number="form.new_water" type="number" step="0.1" min="0" />
            </div>
            <div class="field">
              <label>តម្លៃក្នុង m³ (៛) <span class="required">*</span></label>
              <input v-model="form.water_price" type="number" step="0.1" min="0" />
            </div>

            <div class="col-full" v-if="waterPreview.usage >= 0">
              <div class="preview-box water">
                ការប្រើប្រាស់: <strong>{{ waterPreview.usage }} m³</strong> ×
                {{ formatKHR(form.water_price) }} ៛ =
                <strong class="preview-total water">{{ formatKHR(waterPreview.total) }} ៛</strong>
              </div>
            </div>

            <div class="col-full">
              <label class="field-label-sm">រូបភាពម៉ែត្រទឹក</label>
              <div class="upload-box water">
                <input type="file" accept="image/*" @change="onFileChange($event, 'water')" class="file-input" />
                <div v-if="previews.water" class="upload-preview">
                  <img :src="previews.water" class="meter-img" alt="ម៉ែត្រទឹក" />
                  <div class="ai-scan-panel">
                    <button v-if="!aiState.water.loading && aiState.water.value === null && !aiState.water.error"
                      type="button" class="ai-scan-btn water" @click="runAIScan('water')">
                      AI អានលេខ
                    </button>
                    <div v-if="aiState.water.loading" class="ai-loading">
                      <div class="ai-pulse water"></div>
                      <span>AI កំពុងស្កែន...</span>
                    </div>
                    <div v-if="aiState.water.value !== null && !aiState.water.loading" class="ai-result water">
                      <div class="ai-result-label">AI បានរកឃើញ</div>
                      <div class="ai-result-value">{{ aiState.water.value }} <span class="ai-result-unit">m³</span></div>
                      <div class="ai-result-actions">
                        <button type="button" class="ai-action apply" @click="form.new_water = aiState.water.value">✓ ប្រើលេខនេះ</button>
                        <button type="button" class="ai-action retry" @click="aiState.water = { loading: false, value: null, error: null }; runAIScan('water')">↺ ម្ដងទៀត</button>
                      </div>
                    </div>
                    <div v-if="aiState.water.error && !aiState.water.loading" class="ai-error">
                      {{ aiState.water.error }}
                      <button type="button" class="ai-action retry mt-1" @click="aiState.water.error = null; runAIScan('water')">↺ ព្យាយាមម្ដងទៀត</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            ═══ END WATER SECTION ═══ -->

            <!-- Total Summary — only used when both tabs active, commented with water
            <div class="col-full" v-if="activeTab === 'both' && totalCost > 0">
              <div class="total-summary">
                <span>ចំណាយសរុបប៉ាន់ស្មាន</span>
                <span class="total-amount">{{ formatKHR(totalCost) }} ៛</span>
              </div>
            </div>
            -->

            <div class="divider"></div>

            <!-- Submit -->
            <div class="col-full form-actions">
              <button type="submit" class="btn-primary" :disabled="saving">
                <span v-if="saving" class="spinner sm"></span>
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v14a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                រក្សាទុកកំណត់ត្រា
              </button>
              <router-link :to="`/rooms/${roomId}`" class="btn-ghost">បោះបង់</router-link>
            </div>

          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useToast } from "../composables/useToast";
import { useRoute, useRouter } from "vue-router";
import { getRooms, getLastRecord, createRecord } from "../services/api.js";
import { scanMeterImage } from "../services/meterAI.js";

const route  = useRoute();
const router = useRouter();
const roomId = route.params.id;

const roomName   = ref("");
const lastRecord = ref(null);
const saving     = ref(false);
// const activeTab  = ref("electric"); // tabs removed — only electric shown

const previews = ref({ electric: null /*, water: null */ });
const files    = ref({ electric: null /*, water: null */ });

const form = ref({
  month:          new Date().toISOString().slice(0, 7),
  day:            new Date().getDate().toString(),
  old_electric:   0,
  new_electric:   "",
  electric_price: 610,
  // old_water:   0,    // water — commented out
  // new_water:   "",   // water — commented out
  // water_price: 2500, // water — commented out
});

const aiState = ref({
  electric: { loading: false, value: null, error: null },
  // water: { loading: false, value: null, error: null }, // water — commented out
});

// ─── AI Scan ───────────────────────────────────────────────
const runAIScan = async (type) => {
  const file = files.value[type];
  if (!file) return;
  aiState.value[type] = { loading: true, value: null, error: null };
  try {
    const detected = await scanMeterImage(file, type);
    aiState.value[type].value = detected;
    if (detected !== null) {
      if (type === "electric") form.value.new_electric = detected;
      // if (type === "water") form.value.new_water = detected; // water — commented out
    }
  } catch (e) {
    aiState.value[type].error = e.message;
  } finally {
    aiState.value[type].loading = false;
  }
};

// ─── Computed ──────────────────────────────────────────────
const electricPreview = computed(() => {
  const usage = parseFloat(form.value.new_electric || 0) - parseFloat(form.value.old_electric || 0);
  return { usage: usage.toFixed(2), total: usage * parseFloat(form.value.electric_price || 0) };
});

// Water preview — commented out
// const waterPreview = computed(() => {
//   const usage = parseFloat(form.value.new_water || 0) - parseFloat(form.value.old_water || 0);
//   return { usage: usage.toFixed(2), total: usage * parseFloat(form.value.water_price || 0) };
// });

// Total cost — commented out (only relevant when both electric + water active)
// const totalCost = computed(() =>
//   parseFloat(electricPreview.value.total || 0) + parseFloat(waterPreview.value.total || 0)
// );

const formatKHR = (n) => Number(n || 0).toLocaleString("km-KH");

// ─── File Handling ─────────────────────────────────────────
const onFileChange = (event, type) => {
  const file = event.target.files[0];
  if (!file) return;
  files.value[type]    = file;
  previews.value[type] = URL.createObjectURL(file);
};

// ─── Toast ─────────────────────────────────────────────────
const toast = useToast();
const showAlert = (type, message) => {
  if (type === "success") toast.success(message);
  else if (type === "danger") toast.error(message);
  else toast.warning(message);
};

// ─── Submit ────────────────────────────────────────────────
const submitForm = async () => {
  if (parseFloat(form.value.new_electric) < parseFloat(form.value.old_electric)) {
    return showAlert("warning", "លេខអគ្គិសនីថ្មីត្រូវតែ ≥ លេខចាស់។");
  }
  // Water validation — commented out
  // if (parseFloat(form.value.new_water) < parseFloat(form.value.old_water)) {
  //   return showAlert("warning", "លេខទឹកថ្មីត្រូវតែ ≥ លេខចាស់។");
  // }

  saving.value = true;
  try {
    const fd = new FormData();
    fd.append("room_id",        roomId);
    fd.append("month",          form.value.month);
    fd.append("day",            form.value.day);
    fd.append("new_electric",   form.value.new_electric);
    fd.append("electric_price", form.value.electric_price);
    if (files.value.electric) fd.append("electric_image", files.value.electric);

    // Water fields — commented out
    // fd.append("new_water",   form.value.new_water);
    // fd.append("water_price", form.value.water_price);
    // if (files.value.water) fd.append("water_image", files.value.water);

    await createRecord(fd);
    showAlert("success", "រក្សាទុកកំណត់ត្រាដោយជោគជ័យ!");
    setTimeout(() => router.push(`/rooms/${roomId}`), 1500);
  } catch (e) {
    showAlert("danger", e.response?.data?.message || "មិនអាចរក្សាទុកកំណត់ត្រា។");
  } finally {
    saving.value = false;
  }
};

// ─── Init ──────────────────────────────────────────────────
onMounted(async () => {
  try {
    const [roomsRes, lastRes] = await Promise.all([
      getRooms(),
      getLastRecord(roomId),
    ]);
    const room = roomsRes.data.data.find((r) => r.id == roomId);
    if (room) roomName.value = room.name;

    if (lastRes.data.data) {
      lastRecord.value        = lastRes.data.data;
      form.value.old_electric = lastRecord.value.new_electric;
      // form.value.old_water = lastRecord.value.new_water; // water — commented out
    }
  } catch (e) {
    console.error(e);
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

/* ── Back Button ── */
.back-row { margin-bottom: 1.25rem; }

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  background: transparent;
  color: rgba(150, 190, 255, 0.6);
  border: 0.5px solid rgba(99, 180, 255, 0.15);
  border-radius: 9px;
  font-size: 13px;
  text-decoration: none;
  transition: all 0.15s;
}
.back-btn:hover { background: rgba(99, 180, 255, 0.07); color: #d0e4ff; }

/* ── Card ── */
.card {
  background: #111e33;
  border: 0.5px solid rgba(99, 180, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
}

.card-head {
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem;
  background: rgba(26, 79, 160, 0.35);
  border-bottom: 0.5px solid rgba(99, 180, 255, 0.15);
}

.card-head-title {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 15px;
  font-weight: 600;
  color: #d0e4ff;
}

.card-head-title svg { color: #4aadff; }

.card-body { padding: 1.5rem 1.25rem; }

/* ── Notice ── */
.notice-info {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 14px;
  background: rgba(74, 173, 255, 0.08);
  border: 0.5px solid rgba(74, 173, 255, 0.2);
  border-radius: 10px;
  font-size: 13px;
  color: rgba(180, 220, 255, 0.75);
  margin-bottom: 1.25rem;
}
.notice-info svg { color: #4aadff; flex-shrink: 0; }
.notice-info strong { color: #d0e4ff; }

/* ── Form Grid ── */
.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.col-full { grid-column: 1 / -1; }

.divider {
  grid-column: 1 / -1;
  height: 0.5px;
  background: rgba(99, 180, 255, 0.1);
}

/* ── Section Label ── */
.section-label {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
}
.section-label.elec { color: #fbbf24; }
.section-label.water { color: #4aadff; }

/* ── Fields ── */
.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.field label {
  font-size: 11.5px;
  font-weight: 600;
  color: rgba(150, 190, 255, 0.55);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.field-label-sm {
  display: block;
  font-size: 11.5px;
  font-weight: 600;
  color: rgba(150, 190, 255, 0.55);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 6px;
}

.field input,
.field select {
  padding: 9px 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 0.5px solid rgba(99, 180, 255, 0.15);
  border-radius: 9px;
  color: #d0e4ff;
  font-size: 13.5px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s, background 0.15s;
  width: 100%;
  box-sizing: border-box;
}

.field input::placeholder { color: rgba(150, 190, 255, 0.25); }
.field input:focus { border-color: rgba(99, 180, 255, 0.4); background: rgba(99, 180, 255, 0.05); }
.field input.readonly { color: rgba(150, 190, 255, 0.4); cursor: default; }

.required { color: #f87171; }

.field-hint {
  font-size: 11px;
  color: rgba(150, 190, 255, 0.3);
}

/* ── Preview Box ── */
.preview-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  color: rgba(210, 230, 255, 0.7);
  flex-wrap: wrap;
}
.preview-box.elec {
  background: rgba(251, 191, 36, 0.07);
  border: 0.5px solid rgba(251, 191, 36, 0.15);
}
.preview-box.water {
  background: rgba(74, 173, 255, 0.07);
  border: 0.5px solid rgba(74, 173, 255, 0.15);
}
.preview-box strong { color: rgba(210, 230, 255, 0.9); }
.preview-total.elec { color: #fbbf24; }
.preview-total.water { color: #4aadff; }

/* ── Upload Box ── */
.upload-box {
  padding: 14px;
  border-radius: 12px;
  border: 0.5px solid rgba(99, 180, 255, 0.12);
}
.upload-box.elec { background: rgba(251, 191, 36, 0.04); border-color: rgba(251, 191, 36, 0.12); }
.upload-box.water { background: rgba(74, 173, 255, 0.04); border-color: rgba(74, 173, 255, 0.12); }

.file-input {
  width: 100%;
  padding: 7px 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 0.5px solid rgba(99, 180, 255, 0.15);
  border-radius: 9px;
  color: rgba(180, 210, 255, 0.7);
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  box-sizing: border-box;
}

.upload-preview {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.meter-img {
  max-height: 160px;
  max-width: 220px;
  object-fit: contain;
  border-radius: 9px;
  border: 0.5px solid rgba(99, 180, 255, 0.15);
}

/* ── AI Scan Panel ── */
.ai-scan-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  min-width: 160px;
}

.ai-scan-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 16px;
  border-radius: 10px;
  border: none;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s;
  font-family: inherit;
}
.ai-scan-btn.elec { background: rgba(251, 191, 36, 0.2); color: #fbbf24; border: 0.5px solid rgba(251, 191, 36, 0.3); }
.ai-scan-btn.elec:hover { background: rgba(251, 191, 36, 0.3); }
.ai-scan-btn.water { background: rgba(74, 173, 255, 0.2); color: #4aadff; border: 0.5px solid rgba(74, 173, 255, 0.3); }
.ai-scan-btn.water:hover { background: rgba(74, 173, 255, 0.3); }

.ai-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 10px 0;
  font-size: 12px;
  color: rgba(150, 190, 255, 0.5);
}

.ai-pulse {
  width: 100px;
  height: 3px;
  border-radius: 2px;
  animation: pulse-scan 1.4s ease-in-out infinite;
  background-size: 200% 100%;
}
.ai-pulse.elec  { background: linear-gradient(90deg, rgba(251,191,36,0.1), #fbbf24, rgba(251,191,36,0.1)); background-size: 200% 100%; }
.ai-pulse.water { background: linear-gradient(90deg, rgba(74,173,255,0.1), #4aadff, rgba(74,173,255,0.1)); background-size: 200% 100%; }

@keyframes pulse-scan {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.ai-result {
  border-radius: 12px;
  padding: 12px 14px;
  animation: fadeIn 0.25s ease;
}
.ai-result.elec  { background: rgba(251, 191, 36, 0.08); border: 0.5px solid rgba(251, 191, 36, 0.2); }
.ai-result.water { background: rgba(74, 173, 255, 0.08); border: 0.5px solid rgba(74, 173, 255, 0.2); }

.ai-result-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #4ade80;
  margin-bottom: 6px;
}

.ai-result-value {
  font-size: 26px;
  font-weight: 800;
  color: #d0e4ff;
  line-height: 1;
  margin-bottom: 10px;
}

.ai-result-unit {
  font-size: 13px;
  font-weight: 500;
  color: rgba(150, 190, 255, 0.4);
  margin-left: 3px;
}

.ai-result-actions { display: flex; gap: 6px; flex-wrap: wrap; }

.ai-action {
  display: inline-flex;
  align-items: center;
  padding: 5px 11px;
  border-radius: 7px;
  border: none;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}
.ai-action.apply { background: rgba(74, 222, 128, 0.2); color: #4ade80; border: 0.5px solid rgba(74, 222, 128, 0.3); }
.ai-action.apply:hover { background: rgba(74, 222, 128, 0.3); }
.ai-action.retry { background: rgba(255, 255, 255, 0.05); color: rgba(150, 190, 255, 0.5); border: 0.5px solid rgba(99, 180, 255, 0.12); }
.ai-action.retry:hover { background: rgba(255, 255, 255, 0.09); }
.mt-1 { margin-top: 4px; }

.ai-error {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(248, 113, 113, 0.08);
  border: 0.5px solid rgba(248, 113, 113, 0.2);
  color: #f87171;
  font-size: 12px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Total Summary ── */
.total-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(248, 113, 113, 0.1);
  border: 0.5px solid rgba(248, 113, 113, 0.2);
  border-radius: 10px;
  font-size: 14px;
  color: rgba(210, 230, 255, 0.8);
}
.total-amount { font-size: 18px; font-weight: 700; color: #f87171; }

/* ── Buttons ── */
.form-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 20px;
  background: #1a4fa0;
  color: #fff;
  border: 0.5px solid rgba(99, 180, 255, 0.3);
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.18s;
}
.btn-primary:hover { background: #2563b8; }
.btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }

.btn-ghost {
  display: inline-flex;
  align-items: center;
  padding: 9px 16px;
  background: transparent;
  color: rgba(200, 220, 255, 0.6);
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 9px;
  font-size: 13.5px;
  text-decoration: none;
  transition: all 0.18s;
  font-family: inherit;
}
.btn-ghost:hover { background: rgba(255, 255, 255, 0.05); color: #fff; }

/* ── Spinner ── */
.spinner {
  width: 14px;
  height: 14px;
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Responsive ── */
@media (max-width: 640px) {
  .page { padding: 1rem; }
  .form-grid { grid-template-columns: 1fr; }
  .col-full { grid-column: 1; }
}
</style>