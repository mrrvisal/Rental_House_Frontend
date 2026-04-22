<template>
  <div>
    <div class="mb-3">
      <router-link
        :to="`/rooms/${roomId}`"
        class="btn btn-sm btn-outline-secondary"
      >
        <i class="bi bi-arrow-left me-1"></i>ត្រឡប់ទៅលម្អិតបន្ទប់
      </router-link>
    </div>

    <div class="card shadow-sm border-0">
      <div class="card-header bg-primary text-white">
        <i class="bi bi-plus-circle me-2"></i>បន្ថែមកំណត់ត្រាប្រចាំខែ —
        {{ roomName }}
      </div>
      <div class="card-body">
        <!-- Auto-filled notice -->
        <div v-if="lastRecord" class="alert alert-info mb-3">
          <i class="bi bi-info-circle me-2"></i>
          ការអានដោយស្វ័យប្រវត្តិពី
          <strong>{{ lastRecord.month }}/{{ lastRecord.day }}</strong
          >: អគ្គិសនី <strong>{{ lastRecord.new_electric }}</strong> kWh, ទឹក
          <strong>{{ lastRecord.new_water }}</strong> m³
        </div>

        <!-- Existing record warning — PATCH mode -->
        <div v-if="existingRecord" class="alert alert-warning mb-3">
          <i class="bi bi-pencil-square me-2"></i>
          មានកំណត់ត្រាខែ <strong>{{ form.month }}</strong> រួចហើយ។ នឹង<strong
            >បន្ថែម/កែប្រែ</strong
          >
          <span v-if="activeTab === 'electric'">អគ្គិសនី</span>
          <span v-else-if="activeTab === 'water'">ទឹក</span>
          <span v-else>អគ្គិសនី និង ទឹក</span>
          លើកំណត់ត្រាដែលមានស្រាប់។
        </div>

        <!-- ═══ TABS ═══ -->
        <ul class="nav nav-tabs mb-4">
          <li class="nav-item">
            <button
              class="nav-link d-flex text-warning align-items-center gap-1"
              :class="{ active: activeTab === 'electric' }"
              @click="activeTab = 'electric'"
            >
              <i class="bi bi-lightning-charge-fill text-warning"></i>
              អគ្គិសនី
              <span
                v-if="existingRecord?.electric_image"
                class="badge bg-success ms-1"
                style="font-size: 0.65rem"
                >✓</span
              >
            </button>
          </li>
          <li class="nav-item">
            <button
              class="nav-link d-flex text-info align-items-center gap-1"
              :class="{ active: activeTab === 'water' }"
              @click="activeTab = 'water'"
            >
              <i class="bi bi-droplet-fill text-info"></i>
              ទឹក
              <span
                v-if="existingRecord?.water_image"
                class="badge bg-success ms-1"
                style="font-size: 0.65rem"
                >✓</span
              >
            </button>
          </li>
          <li class="nav-item">
            <button
              class="nav-link d-flex text-success align-items-center gap-1"
              :class="{ active: activeTab === 'both' }"
              @click="activeTab = 'both'"
            >
              <i class="bi bi-collection-fill text-success"></i>
              ទាំងពីរ
            </button>
          </li>
        </ul>

        <form @submit.prevent="submitForm">
          <div class="row g-3">
            <!-- ═══ Month & Day ═══ -->
            <div class="col-md-4">
              <label class="form-label fw-semibold"
                >ខែ <span class="text-danger">*</span></label
              >
              <input
                v-model="form.month"
                type="month"
                class="form-control"
                required
                @change="onMonthChange"
              />
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold"
                >ថ្ងៃ <span class="text-danger">*</span></label
              >
              <input
                v-model="form.day"
                type="number"
                min="1"
                max="31"
                class="form-control"
                required
              />
            </div>
            <div class="col-md-4">
              <label class="form-label">កាលបរិច្ឆេទពេញលេញ</label>
              <input
                type="text"
                :value="form.month + '/' + (form.day || '')"
                class="form-control bg-light"
                readonly
              />
            </div>

            <div class="col-12"><hr class="my-1" /></div>

            <!-- ═══════════ ELECTRICITY SECTION ═══════════ -->
            <template v-if="activeTab === 'electric' || activeTab === 'both'">
              <div class="col-12">
                <h6 class="text-warning">
                  <i class="bi bi-lightning-charge-fill me-1"></i>អគ្គិសនី
                </h6>
              </div>

              <div class="col-md-4">
                <label class="form-label">លេខចាស់ (kWh)</label>
                <input
                  v-model="form.old_electric"
                  type="number"
                  class="form-control bg-light"
                  readonly
                />
                <div class="form-text">ស្វ័យប្រវត្តិពីខែមុន</div>
              </div>

              <div class="col-md-4">
                <label class="form-label"
                  >លេខថ្មី (kWh) <span class="text-danger">*</span></label
                >
                <input
                  v-model.number="form.new_electric"
                  type="number"
                  step="0.1"
                  min="0"
                  class="form-control"
                  :required="activeTab === 'electric' || activeTab === 'both'"
                />
              </div>

              <div class="col-md-4">
                <label class="form-label"
                  >តម្លៃក្នុង kWh (៛) <span class="text-danger">*</span></label
                >
                <input
                  v-model="form.electric_price"
                  type="number"
                  step="0.1"
                  min="0"
                  class="form-control"
                  :required="activeTab === 'electric' || activeTab === 'both'"
                />
              </div>

              <!-- Electric Cost Preview -->
              <div class="col-12" v-if="electricPreview.usage >= 0">
                <div class="bg-warning-subtle rounded p-2 small">
                  ការប្រើប្រាស់:
                  <strong>{{ electricPreview.usage }} kWh</strong> ×
                  {{ formatKHR(form.electric_price) }} ៛ =
                  <strong class="text-warning"
                    >{{ formatKHR(electricPreview.total) }} ៛</strong
                  >
                </div>
              </div>

              <!-- Electric Image Upload -->
              <div class="col-12">
                <label class="form-label">រូបភាពម៉ែត្រអគ្គិសនី</label>
                <div class="border rounded p-3" style="background: #fffdf0">
                  <input
                    type="file"
                    class="form-control"
                    accept="image/*"
                    @change="onFileChange($event, 'electric')"
                  />

                  <!-- Preview + AI scan row -->
                  <div v-if="previews.electric" class="mt-3">
                    <div class="d-flex align-items-start gap-3 flex-wrap">
                      <!-- Meter image preview -->
                      <div class="position-relative">
                        <img
                          :src="previews.electric"
                          class="img-thumbnail shadow-sm"
                          style="
                            max-height: 160px;
                            max-width: 220px;
                            object-fit: contain;
                          "
                          alt="ម៉ែត្រអគ្គិសនី"
                        />
                      </div>

                      <!-- AI scan panel -->
                      <div class="ai-scan-panel ai-scan-panel--electric">
                        <!-- Idle: scan button -->
                        <button
                          v-if="
                            !aiState.electric.loading &&
                            aiState.electric.value === null &&
                            !aiState.electric.error
                          "
                          type="button"
                          class="ai-scan-btn ai-scan-btn--electric"
                          @click="runAIScan('electric')"
                        >
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2.2"
                          >
                            <path
                              d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"
                            />
                            <path d="M12 8v4l3 3" />
                          </svg>
                          AI អានលេខ
                        </button>

                        <!-- Loading -->
                        <div
                          v-if="aiState.electric.loading"
                          class="ai-scan-loading"
                        >
                          <div
                            class="ai-scan-pulse ai-scan-pulse--electric"
                          ></div>
                          <span>AI កំពុងស្កែន...</span>
                        </div>

                        <!-- Success result -->
                        <div
                          v-if="
                            aiState.electric.value !== null &&
                            !aiState.electric.loading
                          "
                          class="ai-scan-result ai-scan-result--electric"
                        >
                          <div class="ai-scan-result__label">
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2.5"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            AI បានរកឃើញ
                          </div>
                          <div class="ai-scan-result__value">
                            {{ aiState.electric.value }}
                            <span class="ai-scan-result__unit">kWh</span>
                          </div>
                          <div class="ai-scan-result__actions">
                            <button
                              type="button"
                              class="ai-action-btn ai-action-btn--apply"
                              @click="
                                form.new_electric = aiState.electric.value
                              "
                            >
                              ✓ ប្រើលេខនេះ
                            </button>
                            <button
                              type="button"
                              class="ai-action-btn ai-action-btn--retry"
                              @click="
                                aiState.electric = {
                                  loading: false,
                                  value: null,
                                  error: null,
                                };
                                runAIScan('electric');
                              "
                            >
                              ↺ ស្កែនម្ដងទៀត
                            </button>
                          </div>
                        </div>

                        <!-- Error -->
                        <div
                          v-if="
                            aiState.electric.error && !aiState.electric.loading
                          "
                          class="ai-scan-error"
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                          {{ aiState.electric.error }}
                          <button
                            type="button"
                            class="ai-action-btn ai-action-btn--retry mt-1"
                            @click="
                              aiState.electric.error = null;
                              runAIScan('electric');
                            "
                          >
                            ↺ ព្យាយាមម្ដងទៀត
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-12" v-if="activeTab === 'both'">
                <hr class="my-1" />
              </div>
            </template>

            <!-- ═══════════ WATER SECTION ═══════════ -->
            <template v-if="activeTab === 'water' || activeTab === 'both'">
              <div class="col-12">
                <h6 class="text-info">
                  <i class="bi bi-droplet-fill me-1"></i>ទឹក
                </h6>
              </div>

              <div class="col-md-4">
                <label class="form-label">លេខចាស់ (m³)</label>
                <input
                  v-model="form.old_water"
                  type="number"
                  class="form-control bg-light"
                  readonly
                />
                <div class="form-text">ស្វ័យប្រវត្តិពីខែមុន</div>
              </div>

              <div class="col-md-4">
                <label class="form-label"
                  >លេខថ្មី (m³) <span class="text-danger">*</span></label
                >
                <input
                  v-model.number="form.new_water"
                  type="number"
                  step="0.1"
                  min="0"
                  class="form-control"
                  :required="activeTab === 'water' || activeTab === 'both'"
                />
              </div>

              <div class="col-md-4">
                <label class="form-label"
                  >តម្លៃក្នុង m³ (៛) <span class="text-danger">*</span></label
                >
                <input
                  v-model="form.water_price"
                  type="number"
                  step="0.1"
                  min="0"
                  class="form-control"
                  :required="activeTab === 'water' || activeTab === 'both'"
                />
              </div>

              <!-- Water Cost Preview -->
              <div class="col-12" v-if="waterPreview.usage >= 0">
                <div class="bg-info-subtle rounded p-2 small">
                  ការប្រើប្រាស់: <strong>{{ waterPreview.usage }} m³</strong> ×
                  {{ formatKHR(form.water_price) }} ៛ =
                  <strong class="text-info"
                    >{{ formatKHR(waterPreview.total) }} ៛</strong
                  >
                </div>
              </div>

              <!-- Water Image Upload -->
              <div class="col-12">
                <label class="form-label">រូបភាពម៉ែត្រទឹក</label>
                <div class="border rounded p-3" style="background: #f0fbff">
                  <input
                    type="file"
                    class="form-control"
                    accept="image/*"
                    @change="onFileChange($event, 'water')"
                  />

                  <!-- Preview + AI scan row -->
                  <div v-if="previews.water" class="mt-3">
                    <div class="d-flex align-items-start gap-3 flex-wrap">
                      <!-- Meter image preview -->
                      <div class="position-relative">
                        <img
                          :src="previews.water"
                          class="img-thumbnail shadow-sm"
                          style="
                            max-height: 160px;
                            max-width: 220px;
                            object-fit: contain;
                          "
                          alt="ម៉ែត្រទឹក"
                        />
                      </div>

                      <!-- AI scan panel -->
                      <div class="ai-scan-panel ai-scan-panel--water">
                        <button
                          v-if="
                            !aiState.water.loading &&
                            aiState.water.value === null &&
                            !aiState.water.error
                          "
                          type="button"
                          class="ai-scan-btn ai-scan-btn--water"
                          @click="runAIScan('water')"
                        >
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2.2"
                          >
                            <path
                              d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"
                            />
                            <path d="M12 8v4l3 3" />
                          </svg>
                          AI អានលេខ
                        </button>

                        <div
                          v-if="aiState.water.loading"
                          class="ai-scan-loading"
                        >
                          <div class="ai-scan-pulse ai-scan-pulse--water"></div>
                          <span>AI កំពុងស្កែន...</span>
                        </div>

                        <div
                          v-if="
                            aiState.water.value !== null &&
                            !aiState.water.loading
                          "
                          class="ai-scan-result ai-scan-result--water"
                        >
                          <div class="ai-scan-result__label">
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2.5"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            AI បានរកឃើញ
                          </div>
                          <div class="ai-scan-result__value">
                            {{ aiState.water.value }}
                            <span class="ai-scan-result__unit">m³</span>
                          </div>
                          <div class="ai-scan-result__actions">
                            <button
                              type="button"
                              class="ai-action-btn ai-action-btn--apply"
                              @click="form.new_water = aiState.water.value"
                            >
                              ✓ ប្រើលេខនេះ
                            </button>
                            <button
                              type="button"
                              class="ai-action-btn ai-action-btn--retry"
                              @click="
                                aiState.water = {
                                  loading: false,
                                  value: null,
                                  error: null,
                                };
                                runAIScan('water');
                              "
                            >
                              ↺ ស្កែនម្ដងទៀត
                            </button>
                          </div>
                        </div>

                        <div
                          v-if="aiState.water.error && !aiState.water.loading"
                          class="ai-scan-error"
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                          {{ aiState.water.error }}
                          <button
                            type="button"
                            class="ai-action-btn ai-action-btn--retry mt-1"
                            @click="
                              aiState.water.error = null;
                              runAIScan('water');
                            "
                          >
                            ↺ ព្យាយាមម្ដងទៀត
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <div class="col-12"><hr /></div>

            <!-- Total Summary -->
            <div class="col-12" v-if="activeTab === 'both' && totalCost > 0">
              <div
                class="alert alert-danger d-flex justify-content-between align-items-center"
              >
                <span class="fw-bold fs-6">ចំណាយសរុបប៉ាន់ស្មាន</span>
                <span class="fw-bold fs-5">{{ formatKHR(totalCost) }} ៛</span>
              </div>
            </div>

            <!-- Submit -->
            <div class="col-12 d-flex gap-2 align-items-center">
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <span
                  v-if="saving"
                  class="spinner-border spinner-border-sm me-1"
                ></span>
                <i v-else class="bi bi-save me-1"></i>
                {{ existingRecord ? "កែប្រែកំណត់ត្រា" : "រក្សាទុកកំណត់ត្រា" }}
              </button>
              <router-link :to="`/rooms/${roomId}`" class="btn btn-secondary"
                >បោះបង់</router-link
              >
              <!-- Mode badge -->
              <span
                class="ms-auto badge"
                :class="existingRecord ? 'bg-warning text-dark' : 'bg-success'"
              >
                <!-- {{ existingRecord ? '✎ PATCH mode' : '+ CREATE mode' }} -->
              </span>
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
import {
  getRooms,
  getLastRecord,
  createRecord,
  checkRecord,
  patchRecord,
} from "../services/api.js";
import { scanMeterImage } from "../services/meterAI.js";

const route = useRoute();
const router = useRouter();
const roomId = route.params.id;

const roomName = ref("");
const lastRecord = ref(null);
const existingRecord = ref(null); // record that already exists for selected month
const saving = ref(false);
const activeTab = ref("both");

const previews = ref({ electric: null, water: null });
const files = ref({ electric: null, water: null });

const form = ref({
  month: new Date().toISOString().slice(0, 7),
  day: new Date().getDate().toString(),
  old_electric: 0,
  new_electric: "",
  electric_price: 700,
  old_water: 0,
  new_water: "",
  water_price: 2500,
});

const aiState = ref({
  electric: { loading: false, value: null, error: null },
  water: { loading: false, value: null, error: null },
});

const runAIScan = async (type) => {
  const file = files.value[type];
  if (!file) return;
  aiState.value[type] = { loading: true, value: null, error: null };
  try {
    const detected = await scanMeterImage(file, type);
    aiState.value[type].value = detected;
    if (detected !== null) {
      if (type === "electric") form.value.new_electric = detected;
      if (type === "water") form.value.new_water = detected;
    }
  } catch (e) {
    aiState.value[type].error = e.message;
  } finally {
    aiState.value[type].loading = false;
  }
};

// ─── Computed ───────────────────────────────────────────────
const electricPreview = computed(() => {
  const usage =
    parseFloat(form.value.new_electric || 0) -
    parseFloat(form.value.old_electric || 0);
  const total = usage * parseFloat(form.value.electric_price || 0);
  return { usage: usage.toFixed(2), total };
});

const waterPreview = computed(() => {
  const usage =
    parseFloat(form.value.new_water || 0) -
    parseFloat(form.value.old_water || 0);
  const total = usage * parseFloat(form.value.water_price || 0);
  return { usage: usage.toFixed(2), total };
});

const totalCost = computed(
  () =>
    parseFloat(electricPreview.value.total || 0) +
    parseFloat(waterPreview.value.total || 0)
);

const formatKHR = (n) => Number(n || 0).toLocaleString("km-KH");

// ─── File Handling ──────────────────────────────────────────
const onFileChange = (event, type) => {
  const file = event.target.files[0];
  if (!file) return;
  files.value[type] = file;
  previews.value[type] = URL.createObjectURL(file);
};

// ─── Month Change → check if record exists ──────────────────
const onMonthChange = async () => {
  existingRecord.value = null;
  try {
    const res = await checkRecord(roomId, form.value.month);
    if (res.data.data) {
      existingRecord.value = res.data.data;
      // Pre-fill form with existing values so user sees current state
      const r = res.data.data;
      form.value.new_electric = r.new_electric;
      form.value.electric_price = r.electric_price;
      form.value.new_water = r.new_water;
      form.value.water_price = r.water_price;
      // old values stay as last record (meter start)
    }
  } catch (e) {
    console.error("checkRecord error", e);
  }
};

const toast = useToast();

const showAlert = (type, message) => {
  if (type === "success") toast.success(message);
  else if (type === "danger") toast.error(message);
  else toast.warning(message);
};

// ─── Submit: POST or PATCH ───────────────────────────────────
const submitForm = async () => {
  const hasElectric =
    activeTab.value === "electric" || activeTab.value === "both";
  const hasWater = activeTab.value === "water" || activeTab.value === "both";

  if (
    hasElectric &&
    parseFloat(form.value.new_electric) < parseFloat(form.value.old_electric)
  ) {
    return showAlert("warning", "លេខអគ្គិសនីថ្មីត្រូវតែ ≥ លេខចាស់។");
  }
  if (
    hasWater &&
    parseFloat(form.value.new_water) < parseFloat(form.value.old_water)
  ) {
    return showAlert("warning", "លេខទឹកថ្មីត្រូវតែ ≥ លេខចាស់។");
  }

  saving.value = true;
  try {
    const fd = new FormData();

    if (existingRecord.value) {
      // ── PATCH: update only the relevant fields ──
      fd.append("type", activeTab.value); // "electric" | "water" | "both"

      if (hasElectric) {
        fd.append("new_electric", form.value.new_electric);
        fd.append("electric_price", form.value.electric_price);
        if (files.value.electric)
          fd.append("electric_image", files.value.electric);
      }
      if (hasWater) {
        fd.append("new_water", form.value.new_water);
        fd.append("water_price", form.value.water_price);
        if (files.value.water) fd.append("water_image", files.value.water);
      }

      await patchRecord(existingRecord.value.id, fd);
      showAlert("success", "កែប្រែកំណត់ត្រាដោយជោគជ័យ!");
    } else {
      // ── POST: create new record ──
      fd.append("room_id", roomId);
      fd.append("month", form.value.month);
      fd.append("day", form.value.day);

      if (hasElectric) {
        fd.append("new_electric", form.value.new_electric);
        fd.append("electric_price", form.value.electric_price);
        if (files.value.electric)
          fd.append("electric_image", files.value.electric);
      }
      if (hasWater) {
        fd.append("new_water", form.value.new_water);
        fd.append("water_price", form.value.water_price);
        if (files.value.water) fd.append("water_image", files.value.water);
      }

      await createRecord(fd);
      showAlert("success", "រក្សាទុកកំណត់ត្រាដោយជោគជ័យ!");
    }

    setTimeout(() => router.push(`/rooms/${roomId}`), 1500);
  } catch (e) {
    const errorMsg = e.response?.data?.message;
    showAlert("danger", errorMsg || "មិនអាចរក្សាទុកកំណត់ត្រា។");
  } finally {
    saving.value = false;
  }
};

// ─── Init ────────────────────────────────────────────────────
onMounted(async () => {
  try {
    const [roomsRes, lastRes] = await Promise.all([
      getRooms(),
      getLastRecord(roomId),
    ]);
    const room = roomsRes.data.data.find((r) => r.id == roomId);
    if (room) roomName.value = room.name;

    if (lastRes.data.data) {
      lastRecord.value = lastRes.data.data;
      form.value.old_electric = lastRecord.value.new_electric;
      form.value.old_water = lastRecord.value.new_water;
    }

    // Check if current month already has a record
    await onMonthChange();
  } catch (e) {
    console.error(e);
  }
});
</script>
<style scoped>
/* ── AI Scan Panel ───────────────────────────── */
.ai-scan-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 160px;
}

/* ── Scan Button ─────────────────────────────── */
.ai-scan-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 16px;
  border-radius: 10px;
  border: none;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}
.ai-scan-btn--electric {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #78350f;
}
.ai-scan-btn--water {
  background: linear-gradient(135deg, #38bdf8, #0ea5e9);
  color: #0c4a6e;
}
.ai-scan-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
}
.ai-scan-btn:active {
  transform: translateY(0);
}

/* ── Loading ─────────────────────────────────── */
.ai-scan-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 10px 0;
  font-size: 0.8rem;
  color: #64748b;
}
.ai-scan-pulse {
  width: 120px;
  height: 4px;
  border-radius: 2px;
  background-size: 200% 100%;
  animation: pulse-scan 1.4s ease-in-out infinite;
}
.ai-scan-pulse--electric {
  background: linear-gradient(90deg, #fde68a, #f59e0b, #fde68a);
  background-size: 200% 100%;
}
.ai-scan-pulse--water {
  background: linear-gradient(90deg, #bae6fd, #0ea5e9, #bae6fd);
  background-size: 200% 100%;
}
@keyframes pulse-scan {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* ── Result Card ─────────────────────────────── */
.ai-scan-result {
  border-radius: 12px;
  padding: 12px 14px;
  border: 1.5px solid;
  animation: fadeSlideIn 0.3s ease;
}
.ai-scan-result--electric {
  background: #fffbeb;
  border-color: #fde68a;
}
.ai-scan-result--water {
  background: #f0f9ff;
  border-color: #bae6fd;
}

.ai-scan-result__label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
  color: #22c55e;
}

.ai-scan-result__value {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
  margin-bottom: 10px;
}
.ai-scan-result__unit {
  font-size: 0.85rem;
  font-weight: 500;
  color: #94a3b8;
  margin-left: 3px;
}

.ai-scan-result__actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

/* ── Action Buttons ──────────────────────────── */
.ai-action-btn {
  display: inline-flex;
  align-items: center;
  padding: 5px 11px;
  border-radius: 7px;
  border: none;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}
.ai-action-btn--apply {
  background: #22c55e;
  color: white;
}
.ai-action-btn--apply:hover {
  background: #16a34a;
}
.ai-action-btn--retry {
  background: #f1f5f9;
  color: #64748b;
}
.ai-action-btn--retry:hover {
  background: #e2e8f0;
}

/* ── Error ───────────────────────────────────── */
.ai-scan-error {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  font-size: 0.8rem;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>