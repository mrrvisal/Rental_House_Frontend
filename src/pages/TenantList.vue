<template>
  <div class="page">

    <!-- Header -->
    <div class="page-header">
      <h2 class="page-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
        </svg>
        គ្រប់គ្រងអ្នកជួល
      </h2>
      <button class="btn-primary" @click="openModal()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        បន្ថែមអ្នកជួល
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>កំពុងផ្ទុក...</p>
    </div>

    <!-- Table -->
    <!-- Table — desktop -->
<div v-else class="table-card">

  <!-- Desktop table -->
  <table class="data-table desktop-only">
    <thead>
      <tr>
        <th style="width:48px">#</th>
        <th>ឈ្មោះអ្នកជួល</th>
        <th>លេខទូរស័ព្ទ</th>
        <th>បន្ទប់</th>
        <th style="text-align:center; width:110px">សកម្មភាព</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="tenants.length === 0">
        <td colspan="5" class="empty-row">រកមិនឃើញអ្នកជួលណាមួយ។</td>
      </tr>
      <tr v-for="(tenant, idx) in tenants" :key="tenant.id" class="data-row">
        <td class="row-num">{{ idx + 1 }}</td>
        <td class="tenant-name">
          <span class="avatar">{{ tenant.name?.charAt(0) }}</span>
          {{ tenant.name }}
        </td>
        <td class="cell-muted">{{ tenant.phone || '—' }}</td>
        <td>
          <span v-if="tenant.room_name" class="room-badge">{{ tenant.room_name }}</span>
          <span v-else class="cell-muted">—</span>
        </td>
        <td class="actions">
          <button class="action-btn edit" @click="openModal(tenant)" title="កែប្រែ">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="action-btn delete" @click="confirmDelete(tenant)" title="លុប">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
            </svg>
          </button>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- Mobile cards -->
  <div class="mobile-only">
    <div v-if="tenants.length === 0" class="empty-card">
      រកមិនឃើញអ្នកជួលណាមួយ។
    </div>
    <div v-for="(tenant, idx) in tenants" :key="tenant.id" class="tenant-card">
      <div class="tenant-card-top">
        <div class="tenant-card-info">
          <span class="avatar lg">{{ tenant.name?.charAt(0) }}</span>
          <div>
            <div class="tenant-card-name">{{ tenant.name }}</div>
            <div class="tenant-card-phone">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.0 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              {{ tenant.phone || '—' }}
            </div>
          </div>
        </div>
        <span class="tenant-card-num">#{{ idx + 1 }}</span>
      </div>
      <div class="tenant-card-bottom">
        <div class="tenant-card-room">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9,22 9,12 15,12 15,22"/>
          </svg>
          <span v-if="tenant.room_name" class="room-badge">{{ tenant.room_name }}</span>
          <span v-else class="cell-muted">គ្មានបន្ទប់</span>
        </div>
        <div class="tenant-card-actions">
          <button class="action-btn edit" @click="openModal(tenant)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            កែប្រែ
          </button>
          <button class="action-btn delete" @click="confirmDelete(tenant)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
            </svg>
            លុប
          </button>
        </div>
      </div>
    </div>
  </div>

</div>

    <!-- Modal: Add/Edit Tenant -->
    <div class="modal fade" id="tenantModal" tabindex="-1" ref="tenantModalEl">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-head">
            <h3>{{ form.id ? 'កែប្រែអ្នកជួល' : 'បន្ថែមអ្នកជួលថ្មី' }}</h3>
            <button class="modal-close" data-bs-dismiss="modal">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="field">
              <label>ឈ្មោះអ្នកជួល <span class="required">*</span></label>
              <input v-model="form.name" type="text" placeholder="ឈ្មោះពេញ" />
            </div>
            <div class="field">
              <label>លេខទូរស័ព្ទ</label>
              <input v-model="form.phone" type="text" placeholder="ឧ. 012-345-678" />
            </div>
            <div class="field">
              <label>ដាក់ចូលបន្ទប់</label>
              <select v-model="form.room_id">
                <option value="">— គ្មាន —</option>
                <option v-for="room in availableRooms" :key="room.id" :value="room.id">
                  {{ room.name }} ({{ room.status === 'occupied' ? 'កំពុងជួល' : 'ទំនេរ' }})
                </option>
              </select>
            </div>
          </div>
          <div class="modal-foot">
            <button class="btn-ghost" data-bs-dismiss="modal">បោះបង់</button>
            <button class="btn-primary" @click="saveTenant" :disabled="saving">
              <span v-if="saving" class="spinner sm"></span>
              {{ form.id ? 'ធ្វើបច្ចុប្បន្នភាព' : 'បង្កើត' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Confirm Delete -->
    <div class="modal fade" id="deleteTenantModal" tabindex="-1" ref="deleteModalEl">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-head danger">
            <h3>បញ្ជាក់ការលុប</h3>
            <button class="modal-close" data-bs-dismiss="modal">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <p class="delete-msg">
              តើអ្នកប្រាកដថាចង់លុបអ្នកជួល <strong>{{ deleteTarget?.name }}</strong>?
            </p>
          </div>
          <div class="modal-foot">
            <button class="btn-ghost" data-bs-dismiss="modal">បោះបង់</button>
            <button class="btn-danger" @click="doDelete" :disabled="saving">លុប</button>
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

/* ── Buttons ── */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  background: #1a4fa0;
  color: #fff;
  border: 0.5px solid rgba(99, 180, 255, 0.3);
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.18s ease;
  font-family: inherit;
}

.btn-primary:hover { background: #2563b8; border-color: rgba(99,180,255,0.5); }
.btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }

.btn-ghost {
  padding: 9px 16px;
  background: transparent;
  color: rgba(200, 220, 255, 0.6);
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 9px;
  font-size: 13.5px;
  cursor: pointer;
  transition: all 0.18s;
  font-family: inherit;
}

.btn-ghost:hover { background: rgba(255,255,255,0.05); color: #fff; }

.btn-danger {
  padding: 9px 18px;
  background: rgba(180, 40, 40, 0.6);
  color: #ffbcbc;
  border: 0.5px solid rgba(255, 100, 100, 0.3);
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.18s;
  font-family: inherit;
}

.btn-danger:hover { background: rgba(200,50,50,0.8); }
.btn-danger:disabled { opacity: 0.45; cursor: not-allowed; }

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

/* ── Spinner ── */
.spinner {
  width: 30px;
  height: 30px;
  border: 2px solid rgba(99, 180, 255, 0.12);
  border-top-color: #4aadff;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

.spinner.sm {
  width: 14px;
  height: 14px;
  border-width: 1.5px;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ── Table Card ── */
.table-card {
  background: #111e33;
  border: 0.5px solid rgba(99, 180, 255, 0.1);
  border-radius: 14px;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}

.data-table thead tr {
  border-bottom: 0.5px solid rgba(99, 180, 255, 0.1);
}

.data-table th {
  padding: 11px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: rgba(150, 190, 255, 0.45);
}

.data-table td {
  padding: 13px 16px;
  color: rgba(210, 230, 255, 0.82);
  border-bottom: 0.5px solid rgba(99, 180, 255, 0.06);
  vertical-align: middle;
}

.data-row:last-child td { border-bottom: none; }
.data-row:hover td { background: rgba(99, 180, 255, 0.04); }

.row-num { color: rgba(150, 190, 255, 0.3) !important; font-size: 12px; }

.tenant-name {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
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

.cell-muted { color: rgba(150, 190, 255, 0.35) !important; }

.room-badge {
  display: inline-flex;
  padding: 3px 10px;
  background: rgba(15, 90, 130, 0.4);
  color: #7dd3fc;
  border: 0.5px solid rgba(99, 200, 255, 0.2);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.empty-row {
  text-align: center;
  color: rgba(150, 190, 255, 0.28) !important;
  padding: 3.5rem 1rem !important;
  font-size: 14px;
}

/* ── Action buttons ── */
.actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.action-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  cursor: pointer;
  border: 0.5px solid transparent;
  background: transparent;
  transition: all 0.15s;
}

.action-btn.edit {
  color: rgba(250, 190, 60, 0.7);
  background: rgba(250, 190, 60, 0.08);
  border-color: rgba(250, 190, 60, 0.15);
}

.action-btn.edit:hover {
  color: #fabd3c;
  background: rgba(250, 190, 60, 0.16);
  border-color: rgba(250, 190, 60, 0.3);
}

.action-btn.delete {
  color: rgba(255, 100, 100, 0.7);
  background: rgba(255, 100, 100, 0.08);
  border-color: rgba(255, 100, 100, 0.15);
}

.action-btn.delete:hover {
  color: #ff7070;
  background: rgba(255, 100, 100, 0.16);
  border-color: rgba(255, 100, 100, 0.3);
}

/* ── Bootstrap Modal — override with dark theme ── */
:deep(.modal-content) {
  background: #111e33;
  border: 0.5px solid rgba(99, 180, 255, 0.15);
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
}

:deep(.modal-backdrop) {
  background: rgba(4, 10, 22, 0.8);
}

/* ── Custom modal head/body/foot ── */
.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 0.5px solid rgba(99, 180, 255, 0.1);
}

.modal-head h3 {
  font-size: 15px;
  font-weight: 600;
  color: #d0e4ff;
  margin: 0;
}

.modal-head.danger {
  background: rgba(160, 30, 30, 0.25);
  border-bottom-color: rgba(255, 80, 80, 0.15);
  border-radius: 16px 16px 0 0;
}

.modal-head.danger h3 { color: #ffbcbc; }

.modal-close {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  background: transparent;
  border: none;
  color: rgba(200, 220, 255, 0.4);
  cursor: pointer;
  transition: all 0.15s;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.07);
  color: #fff;
}

.modal-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-foot {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 1rem 1.25rem;
  border-top: 0.5px solid rgba(99, 180, 255, 0.1);
}

/* ── Form fields ── */
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-size: 12px;
  font-weight: 500;
  color: rgba(150, 190, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.required { color: #ff7070; }

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

.field input:focus,
.field select:focus {
  border-color: rgba(99, 180, 255, 0.4);
  background: rgba(99, 180, 255, 0.05);
}

.field select option {
  background: #111e33;
  color: #d0e4ff;
}

.delete-msg {
  font-size: 14px;
  color: rgba(210, 230, 255, 0.7);
  line-height: 1.6;
  margin: 0;
}

.delete-msg strong { color: #ffbcbc; }

/* ── Show/hide by breakpoint ── */
.desktop-only { display: table; }
.mobile-only  { display: none; }

@media (max-width: 600px) {
  .page { padding: 1rem; }
  .page-title { font-size: 16px; }
  .desktop-only { display: none; }
  .mobile-only  { display: block; }

  /* ── Tenant cards ── */
  .tenant-card {
    background: #111e33;
    border: 0.5px solid rgba(99, 180, 255, 0.1);
    border-radius: 14px;
    padding: 14px;
    margin: 0 0 10px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: background 0.15s;
  }

  .tenant-card:last-child { margin-bottom: 0; }
  .tenant-card:active { background: rgba(99, 180, 255, 0.06); }

  .tenant-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .tenant-card-info {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .avatar.lg {
    width: 42px;
    height: 42px;
    font-size: 16px;
    flex-shrink: 0;
  }

  .tenant-card-name {
    font-size: 14px;
    font-weight: 600;
    color: #d0e4ff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tenant-card-phone {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    color: rgba(150, 190, 255, 0.5);
    margin-top: 3px;
  }

  .tenant-card-num {
    font-size: 11px;
    color: rgba(150, 190, 255, 0.25);
    flex-shrink: 0;
  }

  .tenant-card-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 10px;
    border-top: 0.5px solid rgba(99, 180, 255, 0.08);
  }

  .tenant-card-room {
    display: flex;
    align-items: center;
    gap: 6px;
    color: rgba(150, 190, 255, 0.4);
    font-size: 12px;
  }

  .tenant-card-actions {
    display: flex;
    gap: 6px;
  }

  /* wider action buttons with label on mobile */
  .tenant-card-actions .action-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
    width: auto;
    font-size: 12px;
    font-family: inherit;
    border-radius: 8px;
  }

  /* ── Empty card ── */
  .empty-card {
    text-align: center;
    color: rgba(150, 190, 255, 0.28);
    padding: 3rem 1rem;
    font-size: 14px;
    background: #111e33;
    border: 0.5px solid rgba(99, 180, 255, 0.1);
    border-radius: 14px;
  }
}
</style>