<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">
        <i class="bi bi-people me-2 text-primary"></i>គ្រប់គ្រងអ្នកជួល
      </h2>
      <button class="btn btn-primary" @click="openModal()">
        <i class="bi bi-plus-lg me-1"></i>បន្ថែមអ្នកជួល
      </button>
    </div>

    <!-- Toast notifications used -->

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
      <p class="mt-2 text-muted">កំពុងផ្ទុក...</p>
    </div>

    <!-- Table -->
    <div v-else class="card shadow-sm border-0">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>#</th>
                <th>ឈ្មោះអ្នកជួល</th>
                <th>លេខទូរស័ព្ទ</th>
                <th>បន្ទប់</th>
                <th class="text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="tenants.length === 0">
                <td colspan="5" class="text-center text-muted py-4">
                  រកមិនឃើញអ្នកជួលណាមួយ។
                </td>
              </tr>
              <tr v-for="(tenant, idx) in tenants" :key="tenant.id">
                <td class="text-muted">{{ idx + 1 }}</td>
                <td class="fw-semibold">
                  <i class="bi bi-person-circle me-1 text-primary"></i
                  >{{ tenant.name }}
                </td>
                <td>{{ tenant.phone || "—" }}</td>
                <td>
                  <span
                    v-if="tenant.room_name"
                    class="badge bg-info text-dark"
                    >{{ tenant.room_name }}</span
                  >
                  <span v-else class="text-muted">—</span>
                </td>
                <td class="text-center">
                  <button
                    class="btn btn-sm btn-outline-warning me-1"
                    @click="openModal(tenant)"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    @click="confirmDelete(tenant)"
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

    <!-- Modal: Add/Edit Tenant -->
    <div class="modal fade" id="tenantModal" tabindex="-1" ref="tenantModalEl">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ form.id ? "កែប្រែអ្នកជួល" : "បន្ថែមអ្នកជួលថ្មី" }}
            </h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label"
                >ឈ្មោះអ្នកជួល <span class="text-danger">*</span></label
              >
              <input
                v-model="form.name"
                type="text"
                class="form-control"
                placeholder="ឈ្មោះពេញ"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">លេខទូរស័ព្ទ</label>
              <input
                v-model="form.phone"
                type="text"
                class="form-control"
                placeholder="ឧ. 012-345-678"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">ដាក់ចូលបន្ទប់</label>
              <select v-model="form.room_id" class="form-select">
                <option value="">— គ្មាន —</option>
                <option
                  v-for="room in availableRooms"
                  :key="room.id"
                  :value="room.id"
                >
                  {{ room.name }} ({{
                    room.status === "occupied" ? "កំពុងជួល" : "ទំនេរ"
                  }})
                </option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">
              បោះបង់
            </button>
            <button
              class="btn btn-primary"
              @click="saveTenant"
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
    <div
      class="modal fade"
      id="deleteTenantModal"
      tabindex="-1"
      ref="deleteModalEl"
    >
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
            លុបអ្នកជួល <strong>{{ deleteTarget?.name }}</strong
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
import { ref, computed, onMounted } from "vue";
import { useToast } from "../composables/useToast";
import {
  getTenants,
  createTenant,
  updateTenant,
  deleteTenant,
  getRooms,
} from "../services/api.js";

const tenants = ref([]);
const rooms = ref([]);
const loading = ref(true);
const saving = ref(false);
// Removed alert ref - using toast
const tenantModalEl = ref(null);
const deleteModalEl = ref(null);
const deleteTarget = ref(null);

let tenantModal = null;
let deleteModal = null;

const form = ref({ id: null, name: "", phone: "", room_id: "" });

const availableRooms = computed(() => {
  return rooms.value.filter(
    (r) =>
      r.status === "available" || (form.value.id && r.id == form.value.room_id)
  );
});

const toast = useToast();

const showAlert = (type, message) => {
  if (type === "success") toast.success(message);
  else if (type === "danger") toast.error(message);
  else toast.warning(message);
};

const loadData = async () => {
  loading.value = true;
  try {
    const [tRes, rRes] = await Promise.all([getTenants(), getRooms()]);
    tenants.value = tRes.data.data;
    rooms.value = rRes.data.data;
  } catch {
    showAlert("danger", "មិនអាចផ្ទុកទិន្នន័យបាន។");
  } finally {
    loading.value = false;
  }
};

const openModal = (tenant = null) => {
  if (tenant) {
    form.value = {
      id: tenant.id,
      name: tenant.name,
      phone: tenant.phone || "",
      room_id: tenant.room_id || "",
    };
  } else {
    form.value = { id: null, name: "", phone: "", room_id: "" };
  }
  tenantModal.show();
};

const saveTenant = async () => {
  if (!form.value.name.trim())
    return showAlert("warning", "ត្រូវការឈ្មោះអ្នកជួល។");
  saving.value = true;
  try {
    const payload = {
      name: form.value.name,
      phone: form.value.phone || null,
      room_id: form.value.room_id || null,
    };
    if (form.value.id) {
      await updateTenant(form.value.id, payload);
      showAlert("success", "ធ្វើបច្ចុប្បន្នភាពអ្នកជួលដោយជោគជ័យ។");
    } else {
      await createTenant(payload);
      showAlert("success", "បង្កើតអ្នកជួលដោយជោគជ័យ។");
    }
    tenantModal.hide();
    await loadData();
  } catch (e) {
    showAlert("danger", e.response?.data?.message || "ប្រតិបត្តិការបរាជ័យ។");
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (tenant) => {
  deleteTarget.value = tenant;
  deleteModal.show();
};

const doDelete = async () => {
  saving.value = true;
  try {
    await deleteTenant(deleteTarget.value.id);
    showAlert("success", "លុបអ្នកជួលដោយជោគជ័យ។");
    deleteModal.hide();
    await loadData();
  } catch (e) {
    showAlert("danger", e.response?.data?.message || "ការលុបបរាជ័យ។");
  } finally {
    saving.value = false;
  }
};

onMounted(async () => {
  await loadData();
  const bootstrap = window.bootstrap;
  tenantModal = new bootstrap.Modal(tenantModalEl.value);
  deleteModal = new bootstrap.Modal(deleteModalEl.value);
});
</script>
