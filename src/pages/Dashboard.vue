<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">
        <i class="bi bi-speedometer2 me-2 text-primary"></i>ផ្ទាំងគ្រប់គ្រង
      </h2>
      <span class="text-muted">{{ currentMonth }}</span>
    </div>

    <!-- Summary Cards -->
    <div class="row g-3 mb-4">
      <div class="col-6 col-md-3">
        <div class="card border-0 shadow-sm text-center py-3">
          <div class="fs-2 fw-bold text-primary">{{ stats.totalRooms }}</div>
          <div class="text-muted small">បន្ទប់សរុប</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="card border-0 shadow-sm text-center py-3">
          <div class="fs-2 fw-bold text-success">{{ stats.occupied }}</div>
          <div class="text-muted small">កំពុងជួល</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="card border-0 shadow-sm text-center py-3">
          <div class="fs-2 fw-bold text-warning">{{ stats.available }}</div>
          <div class="text-muted small">ទំនេរ</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="card border-0 shadow-sm text-center py-3">
          <div class="fs-2 fw-bold text-danger">
            {{ formatKHR(stats.totalRevenue) }}
          </div>
          <div class="text-muted small">ចំណូលសរុប (៛)</div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
      <p class="mt-2 text-muted">កំពុងផ្ទុក...</p>
    </div>

    <!-- Error handled by toast -->

    <!-- Room Cards -->
    <div v-else>
      <h5 class="mb-3">ទិដ្ឋភាពខែបច្ចុប្បន្ន</h5>
      <div class="row g-3">
        <div
          class="col-12 col-md-6 col-lg-4"
          v-for="room in rooms"
          :key="room.id"
        >
          <div class="card h-100 shadow-sm border-0">
            <div
              class="card-header d-flex justify-content-between align-items-center"
              :class="
                room.status === 'occupied'
                  ? 'bg-success text-white'
                  : 'bg-secondary text-white'
              "
            >
              <span class="fw-semibold"
                ><i class="bi bi-door-open me-1"></i>{{ room.name }}</span
              >
              <span
                class="badge bg-white"
                :class="
                  room.status === 'occupied' ? 'text-success' : 'text-secondary'
                "
              >
                {{ room.status === "occupied" ? "កំពុងជួល" : "ទំនេរ" }}
              </span>
            </div>
            <div class="card-body">
              <p class="mb-1">
                <i class="bi bi-person me-1 text-muted"></i>
                <span class="text-muted small">អ្នកជួល:</span>
                <strong class="ms-1">{{ room.tenant_name || "—" }}</strong>
              </p>

              <template v-if="room.month">
                <hr class="my-2" />
                <div class="row text-center g-2">
                  <div class="col-6">
                    <div class="bg-warning-subtle rounded p-2">
                      <i class="bi bi-lightning-charge text-warning"></i>
                      <div class="small text-muted">អគ្គិសនី</div>
                      <div class="fw-bold">
                        {{ parseFloat(room.electric_usage).toFixed(1) }} kWh
                      </div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="bg-info-subtle rounded p-2">
                      <i class="bi bi-droplet text-info"></i>
                      <div class="small text-muted">ទឹក</div>
                      <div class="fw-bold">
                        {{ parseFloat(room.water_usage).toFixed(1) }} m³
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-2 text-end">
                  <span class="badge bg-danger fs-6">
                    {{ formatKHR(room.total_cost) }} ៛
                  </span>
                </div>
              </template>
              <div v-else class="text-muted small mt-2 fst-italic">
                មិនទាន់មានកំណត់ត្រាខែនេះ
              </div>
            </div>
            <div class="card-footer bg-transparent">
              <router-link
                :to="`/rooms/${room.id}`"
                class="btn btn-sm btn-outline-primary w-100"
              >
                <i class="bi bi-eye me-1"></i>មើលលម្អិត
              </router-link>
            </div>
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
