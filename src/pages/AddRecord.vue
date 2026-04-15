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
        <!-- Toast notifications used -->

        <!-- Auto-filled notice -->
        <div v-if="lastRecord" class="alert alert-info mb-3">
          <i class="bi bi-info-circle me-2"></i>
          ការអានដោយស្វ័យប្រវត្តិពី
          <strong>{{ lastRecord.month }}/{{ lastRecord.day }}</strong
          >: អគ្គិសនី <strong>{{ lastRecord.new_electric }}</strong> kWh, ទឹក
          <strong>{{ lastRecord.new_water }}</strong> m³
        </div>

        <form @submit.prevent="submitForm">
          <div class="row g-3">
            <!-- Month & Day -->
            <div class="col-md-4">
              <label class="form-label fw-semibold"
                >ខែ <span class="text-danger">*</span></label
              >
              <input
                v-model="form.month"
                type="month"
                class="form-control"
                required
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
              <div class="input-group">
                <input
                  v-model="form.new_electric"
                  type="number"
                  step="0.1"
                  min="0"
                  class="form-control"
                  required
                />
              </div>
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
                required
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
                <div class="d-flex flex-wrap gap-2 align-items-start">
                  <div class="flex-grow-1">
                    <input
                      type="file"
                      class="form-control"
                      accept="*/*"
                      @change="onFileChange($event, 'electric')"
                    />
                  </div>
                </div>

                <!-- Preview result panel -->
                <div
                  v-if="previews.electric"
                  class="mt-3 d-flex flex-wrap gap-3 align-items-start"
                >
                  <div>
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
                </div>
              </div>
            </div>

            <div class="col-12"><hr class="my-1" /></div>

            <!-- ═══════════ WATER SECTION ═══════════ -->
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
              <div class="input-group">
                <input
                  v-model="form.new_water"
                  type="number"
                  step="0.1"
                  min="0"
                  class="form-control"
                  required
                />
              </div>
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
                required
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
                <div class="d-flex flex-wrap gap-2 align-items-start">
                  <div class="flex-grow-1">
                    <input
                      type="file"
                      class="form-control"
                      accept="*/*"
                      @change="onFileChange($event, 'water')"
                    />
                  </div>
                </div>

                <!-- Preview result panel -->
                <div
                  v-if="previews.water"
                  class="mt-3 d-flex flex-wrap gap-3 align-items-start"
                >
                  <div>
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
                </div>
              </div>
            </div>

            <div class="col-12"><hr /></div>

            <!-- Total Summary -->
            <div class="col-12" v-if="totalCost > 0">
              <div
                class="alert alert-danger d-flex justify-content-between align-items-center"
              >
                <span class="fw-bold fs-6">ចំណាយសរុបប៉ាន់ស្មាន</span>
                <span class="fw-bold fs-5">{{ formatKHR(totalCost) }} ៛</span>
              </div>
            </div>

            <!-- Submit -->
            <div class="col-12 d-flex gap-2">
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <span
                  v-if="saving"
                  class="spinner-border spinner-border-sm me-1"
                ></span>
                <i v-else class="bi bi-save me-1"></i>រក្សាទុកកំណត់ត្រា
              </button>
              <router-link :to="`/rooms/${roomId}`" class="btn btn-secondary"
                >បោះបង់</router-link
              >
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

const route = useRoute();
const router = useRouter();
const roomId = route.params.id;

const roomName = ref("");
const lastRecord = ref(null);
const saving = ref(false);
// Removed alert ref - using toast

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

// ─── Computed ──────────────────────────────────────────────
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

// ─── File Handling ─────────────────────────────────────────
const onFileChange = (event, type) => {
  const file = event.target.files[0];
  if (!file) return;
  files.value[type] = file;
  previews.value[type] = URL.createObjectURL(file);
};

// Helper for base64 (restore from original)
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const toast = useToast();

// ─── Alert ─────────────────────────────────────────────────
const showAlert = (type, message) => {
  if (type === "success") toast.success(message);
  else if (type === "danger") toast.error(message);
  else toast.warning(message);
};

// ─── Submit ─────────────────────────────────────────────────
const submitForm = async () => {
  if (
    parseFloat(form.value.new_electric) < parseFloat(form.value.old_electric)
  ) {
    return showAlert("warning", "លេខអគ្គិសនីថ្មីត្រូវតែ ≥ លេខចាស់។");
  }
  if (parseFloat(form.value.new_water) < parseFloat(form.value.old_water)) {
    return showAlert("warning", "លេខទឹកថ្មីត្រូវតែ ≥ លេខចាស់។");
  }

  saving.value = true;
  try {
    const fd = new FormData();
    fd.append("room_id", roomId);
    fd.append("month", form.value.month);
    fd.append("day", form.value.day);
    fd.append("new_electric", form.value.new_electric);
    fd.append("electric_price", form.value.electric_price);
    fd.append("new_water", form.value.new_water);
    fd.append("water_price", form.value.water_price);
    if (files.value.electric) fd.append("electric_image", files.value.electric);
    if (files.value.water) fd.append("water_image", files.value.water);

    await createRecord(fd);
    showAlert("success", "រក្សាទុកកំណត់ត្រាដោយជោគជ័យ!");
    setTimeout(() => router.push(`/rooms/${roomId}`), 1500);
  } catch (e) {
    const errorMsg = e.response?.data?.message;
    if (errorMsg === "Record for this month and day already exists") {
      showAlert("danger", "កំណត់ត្រាសម្រាប់ខែនេះ និងថ្ងៃនេះមានរួចហើយ។");
    } else {
      showAlert("danger", errorMsg || "មិនអាចរក្សាទុកកំណត់ត្រា។");
    }
  } finally {
    saving.value = false;
  }
};

// ─── Init ───────────────────────────────────────────────────
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
  } catch (e) {
    console.error(e);
  }
});
</script>
