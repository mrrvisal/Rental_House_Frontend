<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">
        <i class="bi bi-door-open me-2 text-primary"></i>គ្រប់គ្រងបន្ទប់
      </h2>
      <button class="btn btn-primary" @click="openModal()">
        <i class="bi bi-plus-lg me-1"></i>បន្ថែមបន្ទប់
      </button>
    </div>

    <!-- Toast notifications used -->

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <!-- Table -->
    <div v-else class="card shadow-sm border-0">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>#</th>
                <th>ឈ្មោះបន្ទប់</th>
                <th>អ្នកជួល</th>
                <th>លេខទូរស័ព្ទ</th>
                <th>ស្ថានភាព</th>
                <th class="text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="rooms.length === 0">
                <td colspan="6" class="text-center text-muted py-4">
                  រកមិនឃើញបន្ទប់ណាមួយ។
                </td>
              </tr>
              <tr v-for="(room, idx) in rooms" :key="room.id">
                <td class="text-muted">{{ idx + 1 }}</td>
                <td class="fw-semibold">{{ room.name }}</td>
                <td>{{ room.tenant_name || "—" }}</td>
                <td>{{ room.tenant_phone || "—" }}</td>
                <td>
                  <span
                    class="badge"
                    :class="
                      room.status === 'occupied' ? 'bg-success' : 'bg-secondary'
                    "
                  >
                    {{ room.status === "occupied" ? "កំពុងជួល" : "ទំនេរ" }}
                  </span>
                </td>
                <td class="text-center">
                  <router-link
                    :to="`/rooms/${room.id}`"
                    class="btn btn-sm btn-outline-info me-1"
                  >
                    <i class="bi bi-eye"></i>
                  </router-link>
                  <button
                    class="btn btn-sm btn-outline-warning me-1"
                    @click="openModal(room)"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    @click="confirmDelete(room)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal: Add/Edit Room -->
    <div class="modal fade" id="roomModal" tabindex="-1" ref="roomModalEl">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ form.id ? "កែប្រែបន្ទប់" : "បន្ថែមបន្ទប់ថ្មី" }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label"
                >ឈ្មោះបន្ទប់ <span class="text-danger">*</span></label
              >
              <input
                v-model="form.name"
                type="text"
                class="form-control"
                placeholder="ឧ. បន្ទប់ 101"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">ស្ថានភាព</label>
              <select v-model="form.status" class="form-select">
                <option value="available">ទំនេរ</option>
                <option value="occupied">កំពុងជួល</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">
              បោះបង់
            </button>
            <button
              class="btn btn-primary"
              @click="saveRoom"
              :disabled="saving"
            >
              <span
                v-if="saving"
                class="spinner-border spinner-border-sm me-1"
              ></span>
              {{ form.id ? "ធ្វើបច្ចុប្បន្នភាព" : "បង្កើត" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Confirm Delete -->
    <div class="modal fade" id="deleteModal" tabindex="-1" ref="deleteModalEl">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">បញ្ជាក់ការលុប</h5>
            <button
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            តើអ្នកពិតជាចង់លុប <strong>{{ deleteTarget?.name }}</strong
            >?
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">
              បោះបង់
            </button>
            <button class="btn btn-danger" @click="doDelete" :disabled="saving">
              លុប
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "../composables/useToast";
import {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../services/api.js";

const rooms = ref([]);
const loading = ref(true);
const saving = ref(false);
// Removed alert ref - using toast
const roomModalEl = ref(null);
const deleteModalEl = ref(null);
const deleteTarget = ref(null);

let roomModal = null;
let deleteModal = null;

const form = ref({ id: null, name: "", status: "available" });

const toast = useToast();

const showAlert = (type, message) => {
  if (type === "success") toast.success(message);
  else if (type === "danger") toast.error(message);
  else toast.warning(message);
};

const loadRooms = async () => {
  loading.value = true;
  try {
    const res = await getRooms();
    rooms.value = res.data.data;
  } catch {
    showAlert("danger", "មិនអាចផ្ទុកបន្ទប់បាន។");
  } finally {
    loading.value = false;
  }
};

const openModal = (room = null) => {
  if (room) {
    form.value = { id: room.id, name: room.name, status: room.status };
  } else {
    form.value = { id: null, name: "", status: "available" };
  }
  roomModal.show();
};

const saveRoom = async () => {
  if (!form.value.name.trim())
    return showAlert("warning", "ត្រូវការឈ្មោះបន្ទប់។");
  saving.value = true;
  try {
    if (form.value.id) {
      await updateRoom(form.value.id, {
        name: form.value.name,
        status: form.value.status,
      });
      showAlert("success", "ធ្វើបច្ចុប្បន្នភាពបន្ទប់ដោយជោគជ័យ។");
    } else {
      await createRoom({ name: form.value.name, status: form.value.status });
      showAlert("success", "បង្កើតបន្ទប់ដោយជោគជ័យ។");
    }
    roomModal.hide();
    await loadRooms();
  } catch (e) {
    showAlert("danger", e.response?.data?.message || "ប្រតិបត្តិការបរាជ័យ។");
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (room) => {
  deleteTarget.value = room;
  deleteModal.show();
};

const doDelete = async () => {
  saving.value = true;
  try {
    await deleteRoom(deleteTarget.value.id);
    showAlert("success", "លុបបន្ទប់ដោយជោគជ័យ។");
    deleteModal.hide();
    await loadRooms();
  } catch (e) {
    showAlert("danger", e.response?.data?.message || "ការលុបបរាជ័យ។");
  } finally {
    saving.value = false;
  }
};

onMounted(async () => {
  await loadRooms();
  const bootstrap = window.bootstrap;
  roomModal = new bootstrap.Modal(roomModalEl.value);
  deleteModal = new bootstrap.Modal(deleteModalEl.value);
});
</script>
