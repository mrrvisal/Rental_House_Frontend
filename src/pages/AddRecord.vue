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
          <strong>{{ lastRecord.month }}/{{ lastRecord.day }}</strong>:
          អគ្គិសនី <strong>{{ lastRecord.new_electric }}</strong> kWh,
          ទឹក <strong>{{ lastRecord.new_water }}</strong> m³
        </div>

        <!-- Existing record warning — PATCH mode -->
        <div v-if="existingRecord" class="alert alert-warning mb-3">
          <i class="bi bi-pencil-square me-2"></i>
          មានកំណត់ត្រាខែ <strong>{{ form.month }}</strong> រួចហើយ។
          នឹង<strong>បន្ថែម/កែប្រែ</strong>
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
              <span v-if="existingRecord?.electric_image" class="badge bg-success ms-1" style="font-size:0.65rem">✓</span>
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
              <span v-if="existingRecord?.water_image" class="badge bg-success ms-1" style="font-size:0.65rem">✓</span>
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
              <label class="form-label fw-semibold">ខែ <span class="text-danger">*</span></label>
              <input
                v-model="form.month"
                type="month"
                class="form-control"
                required
                @change="onMonthChange"
              />
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">ថ្ងៃ <span class="text-danger">*</span></label>
              <input v-model="form.day" type="number" min="1" max="31" class="form-control" required />
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
                <input v-model="form.old_electric" type="number" class="form-control bg-light" readonly />
                <div class="form-text">ស្វ័យប្រវត្តិពីខែមុន</div>
              </div>

              <div class="col-md-4">
                <label class="form-label">លេខថ្មី (kWh) <span class="text-danger">*</span></label>
                <input
                  v-model="form.new_electric"
                  type="number"
                  step="0.1"
                  min="0"
                  class="form-control"
                  :required="activeTab === 'electric' || activeTab === 'both'"
                />
              </div>

              <div class="col-md-4">
                <label class="form-label">តម្លៃក្នុង kWh (៛) <span class="text-danger">*</span></label>
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
                  ការប្រើប្រាស់: <strong>{{ electricPreview.usage }} kWh</strong> ×
                  {{ formatKHR(form.electric_price) }} ៛ =
                  <strong class="text-warning">{{ formatKHR(electricPreview.total) }} ៛</strong>
                </div>
              </div>

              <!-- Electric Image Upload -->
              <div class="col-12">
                <label class="form-label">រូបភាពម៉ែត្រអគ្គិសនី</label>
                <div class="border rounded p-3" style="background: #fffdf0">
                  <input type="file" class="form-control" accept="*/*" @change="onFileChange($event, 'electric')" />
                  <div v-if="previews.electric" class="mt-3">
                    <img
                      :src="previews.electric"
                      class="img-thumbnail shadow-sm"
                      style="max-height: 160px; max-width: 220px; object-fit: contain"
                      alt="ម៉ែត្រអគ្គិសនី"
                    />
                  </div>
                </div>
              </div>

              <div class="col-12" v-if="activeTab === 'both'"><hr class="my-1" /></div>
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
                <input v-model="form.old_water" type="number" class="form-control bg-light" readonly />
                <div class="form-text">ស្វ័យប្រវត្តិពីខែមុន</div>
              </div>

              <div class="col-md-4">
                <label class="form-label">លេខថ្មី (m³) <span class="text-danger">*</span></label>
                <input
                  v-model="form.new_water"
                  type="number"
                  step="0.1"
                  min="0"
                  class="form-control"
                  :required="activeTab === 'water' || activeTab === 'both'"
                />
              </div>

              <div class="col-md-4">
                <label class="form-label">តម្លៃក្នុង m³ (៛) <span class="text-danger">*</span></label>
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
                  <strong class="text-info">{{ formatKHR(waterPreview.total) }} ៛</strong>
                </div>
              </div>

              <!-- Water Image Upload -->
              <div class="col-12">
                <label class="form-label">រូបភាពម៉ែត្រទឹក</label>
                <div class="border rounded p-3" style="background: #f0fbff">
                  <input type="file" class="form-control" accept="*/*" @change="onFileChange($event, 'water')" />
                  <div v-if="previews.water" class="mt-3">
                    <img
                      :src="previews.water"
                      class="img-thumbnail shadow-sm"
                      style="max-height: 160px; max-width: 220px; object-fit: contain"
                      alt="ម៉ែត្រទឹក"
                    />
                  </div>
                </div>
              </div>
            </template>

            <div class="col-12"><hr /></div>

            <!-- Total Summary -->
            <div class="col-12" v-if="activeTab === 'both' && totalCost > 0">
              <div class="alert alert-danger d-flex justify-content-between align-items-center">
                <span class="fw-bold fs-6">ចំណាយសរុបប៉ាន់ស្មាន</span>
                <span class="fw-bold fs-5">{{ formatKHR(totalCost) }} ៛</span>
              </div>
            </div>

            <!-- Submit -->
            <div class="col-12 d-flex gap-2 align-items-center">
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
                <i v-else class="bi bi-save me-1"></i>
                {{ existingRecord ? 'កែប្រែកំណត់ត្រា' : 'រក្សាទុកកំណត់ត្រា' }}
              </button>
              <router-link :to="`/rooms/${roomId}`" class="btn btn-secondary">បោះបង់</router-link>
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
import { getRooms, getLastRecord, createRecord, checkRecord, patchRecord } from "../services/api.js";

const route  = useRoute();
const router = useRouter();
const roomId = route.params.id;

const roomName     = ref("");
const lastRecord   = ref(null);
const existingRecord = ref(null); // record that already exists for selected month
const saving       = ref(false);
const activeTab    = ref("both");

const previews = ref({ electric: null, water: null });
const files    = ref({ electric: null, water: null });

const form = ref({
  month:         new Date().toISOString().slice(0, 7),
  day:           new Date().getDate().toString(),
  old_electric:  0,
  new_electric:  "",
  electric_price: 700,
  old_water:     0,
  new_water:     "",
  water_price:   2500,
});

// ─── Computed ───────────────────────────────────────────────
const electricPreview = computed(() => {
  const usage  = parseFloat(form.value.new_electric || 0) - parseFloat(form.value.old_electric || 0);
  const total  = usage * parseFloat(form.value.electric_price || 0);
  return { usage: usage.toFixed(2), total };
});

const waterPreview = computed(() => {
  const usage = parseFloat(form.value.new_water || 0) - parseFloat(form.value.old_water || 0);
  const total = usage * parseFloat(form.value.water_price || 0);
  return { usage: usage.toFixed(2), total };
});

const totalCost = computed(
  () => parseFloat(electricPreview.value.total || 0) + parseFloat(waterPreview.value.total || 0)
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
      form.value.new_electric   = r.new_electric;
      form.value.electric_price = r.electric_price;
      form.value.new_water      = r.new_water;
      form.value.water_price    = r.water_price;
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
  const hasElectric = activeTab.value === "electric" || activeTab.value === "both";
  const hasWater    = activeTab.value === "water"    || activeTab.value === "both";

  if (hasElectric && parseFloat(form.value.new_electric) < parseFloat(form.value.old_electric)) {
    return showAlert("warning", "លេខអគ្គិសនីថ្មីត្រូវតែ ≥ លេខចាស់។");
  }
  if (hasWater && parseFloat(form.value.new_water) < parseFloat(form.value.old_water)) {
    return showAlert("warning", "លេខទឹកថ្មីត្រូវតែ ≥ លេខចាស់។");
  }

  saving.value = true;
  try {
    const fd = new FormData();

    if (existingRecord.value) {
      // ── PATCH: update only the relevant fields ──
      fd.append("type", activeTab.value); // "electric" | "water" | "both"

      if (hasElectric) {
        fd.append("new_electric",   form.value.new_electric);
        fd.append("electric_price", form.value.electric_price);
        if (files.value.electric) fd.append("electric_image", files.value.electric);
      }
      if (hasWater) {
        fd.append("new_water",   form.value.new_water);
        fd.append("water_price", form.value.water_price);
        if (files.value.water) fd.append("water_image", files.value.water);
      }

      await patchRecord(existingRecord.value.id, fd);
      showAlert("success", "កែប្រែកំណត់ត្រាដោយជោគជ័យ!");

    } else {
      // ── POST: create new record ──
      fd.append("room_id", roomId);
      fd.append("month",   form.value.month);
      fd.append("day",     form.value.day);

      if (hasElectric) {
        fd.append("new_electric",   form.value.new_electric);
        fd.append("electric_price", form.value.electric_price);
        if (files.value.electric) fd.append("electric_image", files.value.electric);
      }
      if (hasWater) {
        fd.append("new_water",   form.value.new_water);
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
      lastRecord.value          = lastRes.data.data;
      form.value.old_electric   = lastRecord.value.new_electric;
      form.value.old_water      = lastRecord.value.new_water;
    }

    // Check if current month already has a record
    await onMonthChange();
  } catch (e) {
    console.error(e);
  }
});
</script>