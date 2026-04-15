<template>
  <div>
    <!-- Back Button -->
    <div class="mb-3">
      <router-link to="/rooms" class="btn btn-sm btn-outline-secondary">
        <i class="bi bi-arrow-left me-1"></i>ត្រឡប់ទៅបន្ទប់
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
      <p class="mt-2 text-muted">កំពុងផ្ទុកព័ត៌មានបន្ទប់...</p>
    </div>

    <div v-else>
      <!-- Room Header -->
      <div class="card shadow-sm border-0 mb-4">
        <div
          class="card-body d-flex flex-wrap justify-content-between align-items-center gap-3"
        >
          <div>
            <h3 class="mb-1">
              <i class="bi bi-door-open me-2 text-primary"></i>{{ roomName }}
            </h3>
            <p class="mb-0 text-muted">
              <i class="bi bi-person me-1"></i>
              អ្នកជួល: <strong>{{ tenantName }}</strong>
            </p>
          </div>
          <router-link
            :to="`/rooms/${roomId}/add-record`"
            class="btn btn-primary"
          >
            <i class="bi bi-plus-lg me-1"></i>បន្ថែមកំណត់ត្រាប្រចាំខែ
          </router-link>
        </div>
      </div>

      <!-- No records -->
      <div v-if="records.length === 0" class="alert alert-info">
        <i class="bi bi-info-circle me-2"></i
        >រកមិនឃើញកំណត់ត្រាប្រចាំខែសម្រាប់បន្ទប់នេះ។
        <router-link :to="`/rooms/${roomId}/add-record`" class="alert-link ms-1"
          >បន្ថែមកំណត់ត្រាដំបូង។</router-link
        >
      </div>

      <div v-else>
        <!-- Current Month Card -->
        <div v-if="current" class="card shadow-sm border-0 mb-4">
          <div class="card-header bg-primary text-white">
            <i class="bi bi-calendar-check me-2"></i>កំណត់ត្រាថ្មីៗ —
            {{ current ? current.month + "/" + current.day : "" }}
          </div>
          <div class="card-body">
            <div class="row g-4">
              <!-- Electric -->
              <div class="col-md-6">
                <div class="border rounded p-3">
                  <h6 class="text-warning mb-3">
                    <i class="bi bi-lightning-charge-fill me-1"></i>អគ្គិសនី
                  </h6>
                  <table class="table table-sm table-borderless mb-0">
                    <tr>
                      <td class="text-muted">លេខចាស់</td>
                      <td class="fw-semibold">
                        {{ parseFloat(current.old_electric).toFixed(1) }} kWh
                      </td>
                    </tr>
                    <tr>
                      <td class="text-muted">លេខថ្មី</td>
                      <td class="fw-semibold">
                        {{ parseFloat(current.new_electric).toFixed(1) }} kWh
                      </td>
                    </tr>
                    <tr>
                      <td class="text-muted">ការប្រើប្រាស់</td>
                      <td class="fw-bold text-warning">
                        {{ parseFloat(current.electric_usage).toFixed(1) }} kWh
                      </td>
                    </tr>
                    <tr>
                      <td class="text-muted">តម្លៃក្នុង kWh</td>
                      <td>{{ formatKHR(current.electric_price) }} ៛</td>
                    </tr>
                    <tr class="table-warning">
                      <td class="fw-bold">សរុប</td>
                      <td class="fw-bold">
                        {{ formatKHR(current.electric_total) }} ៛
                      </td>
                    </tr>
                  </table>
                  <div class="row g-2 mt-3">
                    <div v-if="current.old_electric_image" class="col">
                      <small class="text-muted d-block mb-1">ខែមុន</small>
                      <img
                        :src="getImageUrl(current.old_electric_image)"
                        class="img-thumbnail cursor-pointer w-100"
                        style="height: 200px"
                        alt="រូបភាពម៉ែត្រអគ្គិសនី ខែមុន"
                        @click="showImageModal(current.old_electric_image)"
                      />
                    </div>
                    <div v-if="current.electric_image" class="col">
                      <small class="text-muted d-block mb-1">ខែនេះ</small>
                      <img
                        :src="getImageUrl(current.electric_image)"
                        class="img-thumbnail cursor-pointer w-100"
                        style="height: 200px"
                        alt="រូបភាពម៉ែត្រអគ្គិសនី ខែនេះ"
                        @click="showImageModal(current.electric_image)"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- Water -->
              <div class="col-md-6">
                <div class="border rounded p-3">
                  <h6 class="text-info mb-3">
                    <i class="bi bi-droplet-fill me-1"></i>ទឹក
                  </h6>
                  <table class="table table-sm table-borderless mb-0">
                    <tr>
                      <td class="text-muted">លេខចាស់</td>
                      <td class="fw-semibold">
                        {{ parseFloat(current.old_water).toFixed(1) }} m³
                      </td>
                    </tr>
                    <tr>
                      <td class="text-muted">លេខថ្មី</td>
                      <td class="fw-semibold">
                        {{ parseFloat(current.new_water).toFixed(1) }} m³
                      </td>
                    </tr>
                    <tr>
                      <td class="text-muted">ការប្រើប្រាស់</td>
                      <td class="fw-bold text-info">
                        {{ parseFloat(current.water_usage).toFixed(1) }} m³
                      </td>
                    </tr>
                    <tr>
                      <td class="text-muted">តម្លៃក្នុង m³</td>
                      <td>{{ formatKHR(current.water_price) }} ៛</td>
                    </tr>
                    <tr class="table-info">
                      <td class="fw-bold">សរុប</td>
                      <td class="fw-bold">
                        {{ formatKHR(current.water_total) }} ៛
                      </td>
                    </tr>
                  </table>
                  <div class="row g-2 mt-3">
                    <div v-if="current.old_water_image" class="col">
                      <small class="text-muted d-block mb-1">ខែមុន</small>
                      <img
                        :src="getImageUrl(current.old_water_image)"
                        class="img-thumbnail cursor-pointer w-100"
                        style="height: 200px"
                        alt="រូបភាពម៉ែត្រទឹក ខែមុន"
                        @click="showImageModal(current.old_water_image)"
                      />
                    </div>
                    <div v-if="current.water_image" class="col">
                      <small class="text-muted d-block mb-1">ខែនេះ</small>
                      <img
                        :src="getImageUrl(current.water_image)"
                        class="img-thumbnail cursor-pointer w-100"
                        style="height: 200px"
                        alt="រូបភាពម៉ែត្រទឹក ខែនេះ"
                        @click="showImageModal(current.water_image)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Total Cost -->
            <div
              class="alert alert-danger mt-3 mb-0 d-flex justify-content-between align-items-center"
            >
              <span class="fw-bold fs-5">ចំនួនទឹកប្រាក់សរុបត្រូវបង់</span>
              <span class="fw-bold fs-4"
                >{{ formatKHR(current.total_cost) }} ៛</span
              >
            </div>
          </div>
        </div>

        <!-- Previous Month Card -->
        <div v-if="previous" class="card shadow-sm border-0 mb-4">
          <div class="card-header bg-secondary text-white">
            <i class="bi bi-calendar me-2"></i>កំណត់ត្រាមុន —
            {{ previous ? previous.month + "/" + previous.day : "" }}
          </div>
          <div class="card-body">
            <div class="row g-4">
              <div class="col-md-6">
                <div class="border rounded p-3 bg-light">
                  <h6 class="text-warning mb-2">
                    <i class="bi bi-lightning-charge-fill me-1"></i>អគ្គិសនី
                  </h6>
                  <table class="table table-sm table-borderless mb-0">
                    <tr>
                      <td class="text-muted">ការប្រើប្រាស់</td>
                      <td>
                        {{ parseFloat(previous.electric_usage).toFixed(1) }} kWh
                      </td>
                    </tr>
                    <tr>
                      <td class="text-muted">សរុប</td>
                      <td>{{ formatKHR(previous.electric_total) }} ៛</td>
                    </tr>
                  </table>
                </div>
              </div>
              <div class="col-md-6">
                <div class="border rounded p-3 bg-light">
                  <h6 class="text-info mb-2">
                    <i class="bi bi-droplet-fill me-1"></i>ទឹក
                  </h6>
                  <table class="table table-sm table-borderless mb-0">
                    <tr>
                      <td class="text-muted">ការប្រើប្រាស់</td>
                      <td>
                        {{ parseFloat(previous.water_usage).toFixed(1) }} m³
                      </td>
                    </tr>
                    <tr>
                      <td class="text-muted">សរុប</td>
                      <td>{{ formatKHR(previous.water_total) }} ៛</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
            <div class="mt-2 text-end text-muted">
              សរុបខែមុន:
              <strong>{{ formatKHR(previous.total_cost) }} ៛</strong>
            </div>
          </div>
        </div>

        <!-- Comparison Card -->
        <div
          v-if="current && previous"
          class="card shadow-sm border-0 border-start border-4 border-primary"
        >
          <div class="card-header bg-light">
            <i class="bi bi-bar-chart-line me-2 text-primary"></i
            >ការប្រៀបធៀបពីខែទៅខែ
          </div>
          <div class="card-body">
            <div class="row g-3 text-center">
              <div class="col-md-4">
                <div class="p-3 border rounded">
                  <div class="text-muted small mb-1">
                    ការផ្លាស់ប្តូរការប្រើអគ្គិសនី
                  </div>
                  <div
                    class="fs-4 fw-bold"
                    :class="diff.electric >= 0 ? 'text-danger' : 'text-success'"
                  >
                    <i
                      class="bi"
                      :class="
                        diff.electric >= 0
                          ? 'bi-arrow-up-circle-fill'
                          : 'bi-arrow-down-circle-fill'
                      "
                    ></i>
                    {{ Math.abs(diff.electric).toFixed(1) }} kWh
                  </div>
                  <div class="small text-muted">
                    {{ parseFloat(previous.electric_usage).toFixed(1) }} → {{ parseFloat(current.electric_usage).toFixed(1) }}
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="p-3 border rounded">
                  <div class="text-muted small mb-1">
                    ការផ្លាស់ប្តូរការប្រើទឹក
                  </div>
                  <div
                    class="fs-4 fw-bold"
                    :class="diff.water >= 0 ? 'text-danger' : 'text-success'"
                  >
                    <i
                      class="bi"
                      :class="
                        diff.water >= 0
                          ? 'bi-arrow-up-circle-fill'
                          : 'bi-arrow-down-circle-fill'
                      "
                    ></i>
                    {{ Math.abs(diff.water).toFixed(1) }} m³
                  </div>
                  <div class="small text-muted">
                    {{ parseFloat(previous.water_usage).toFixed(1) }} → {{ parseFloat(current.water_usage).toFixed(1) }}
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="p-3 border rounded">
                  <div class="text-muted small mb-1">
                    ការផ្លាស់ប្តូរចំណាយសរុប
                  </div>
                  <div
                    class="fs-4 fw-bold"
                    :class="diff.cost >= 0 ? 'text-danger' : 'text-success'"
                  >
                    <i
                      class="bi"
                      :class="
                        diff.cost >= 0
                          ? 'bi-arrow-up-circle-fill'
                          : 'bi-arrow-down-circle-fill'
                      "
                    ></i>
                    {{ formatKHR(Math.abs(diff.cost)) }} ៛
                  </div>
                  <div class="small text-muted">
                    {{ formatKHR(previous.total_cost) }} →
                    {{ formatKHR(current.total_cost) }} ៛
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Image Modal -->
        <div class="modal fade" id="imageModal" tabindex="-1" ref="imageModal">
          <div class="modal-dialog modal-xl modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">រូបភាពម៉ែត្រ</h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <div class="modal-body text-center p-5">
                <img
                  :src="currentImage"
                  class="img-fluid"
                  style="width: 400px; object-fit: contain"
                  alt="Meter image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
  getRooms,
  getRecordsByRoom,
  getImageUrl as imgUrl,
} from "../services/api.js";

const route = useRoute();
const roomId = route.params.id;

const loading = ref(true);
const records = ref([]);
const roomName = ref("");
const tenantName = ref("—");
const imageModal = ref(null);
const currentImage = ref("");

const current = computed(() => records.value[0] || null);
const previous = computed(() => records.value[1] || null);

const diff = computed(() => {
  if (!current.value || !previous.value) return {};
  return {
    electric: current.value.electric_usage - previous.value.electric_usage,
    water: current.value.water_usage - previous.value.water_usage,
    cost: current.value.total_cost - previous.value.total_cost,
  };
});

const formatKHR = (n) => Number(n || 0).toLocaleString("km-KH");

const showImageModal = (filename) => {
  currentImage.value = imgUrl(filename);
  new bootstrap.Modal(imageModal.value).show();
};

const getImageUrl = (filename) => imgUrl(filename);

onMounted(async () => {
  try {
    const [roomsRes, recordsRes] = await Promise.all([
      getRooms(),
      getRecordsByRoom(roomId),
    ]);
    const room = roomsRes.data.data.find((r) => r.id == roomId);
    if (room) {
      roomName.value = room.name;
      tenantName.value = room.tenant_name || "—";
    }
    records.value = recordsRes.data.data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
  object-fit: cover;
}
.cursor-pointer:hover {
  transform: scale(1.02);
  transition: transform 0.2s;
}
</style>
