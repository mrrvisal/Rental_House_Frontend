<template>
  <div class="page">

    <!-- Header -->
    <div class="page-header">
      <h2 class="page-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
        គ្រប់គ្រងបន្ទប់
      </h2>
      <button class="btn-primary" @click="openModal()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        បន្ថែមបន្ទប់
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>កំពុងផ្ទុក...</p>
    </div>

    <!-- Content -->
    <div v-else class="table-card">

      <!-- Desktop table -->
      <table class="data-table desktop-only">
        <thead>
          <tr>
            <th style="width:48px">#</th>
            <th>ឈ្មោះបន្ទប់</th>
            <th>អ្នកជួល</th>
            <th>លេខទូរស័ព្ទ</th>
            <th>ស្ថានភាព</th>
            <th style="text-align:center; width:120px">សកម្មភាព</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="rooms.length === 0">
            <td colspan="6" class="empty-row">រកមិនឃើញបន្ទប់ណាមួយ។</td>
          </tr>
          <tr v-for="(room, idx) in rooms" :key="room.id" class="data-row">
            <td class="row-num">{{ idx + 1 }}</td>
            <td class="room-name-cell">
              <span class="room-icon">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  <polyline points="9,22 9,12 15,12 15,22"/>
                </svg>
              </span>
              {{ room.name }}
            </td>
            <td class="cell-muted">{{ room.tenant_name || '—' }}</td>
            <td class="cell-muted">{{ room.tenant_phone || '—' }}</td>
            <td>
              <span class="status-badge" :class="room.status === 'occupied' ? 'occupied' : 'available'">
                {{ room.status === 'occupied' ? 'កំពុងជួល' : 'ទំនេរ' }}
              </span>
            </td>
            <td class="actions">
              <router-link :to="`/rooms/${room.id}`" class="action-btn view" title="មើល">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </router-link>
              <button class="action-btn edit" @click="openModal(room)" title="កែប្រែ">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button class="action-btn delete" @click="confirmDelete(room)" title="លុប">
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
        <div v-if="rooms.length === 0" class="empty-card">
          រកមិនឃើញបន្ទប់ណាមួយ។
        </div>
        <div v-for="(room, idx) in rooms" :key="room.id" class="room-card">
          <div class="room-card-top">
            <div class="room-card-left">
              <div class="room-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  <polyline points="9,22 9,12 15,12 15,22"/>
                </svg>
              </div>
              <div>
                <div class="room-card-name">{{ room.name }}</div>
                <span class="status-badge sm" :class="room.status === 'occupied' ? 'occupied' : 'available'">
                  {{ room.status === 'occupied' ? 'កំពុងជួល' : 'ទំនេរ' }}
                </span>
              </div>
            </div>
            <span class="room-card-num">#{{ idx + 1 }}</span>
          </div>

          <div v-if="room.tenant_name" class="room-card-tenant">
            <div class="tenant-row">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <span>{{ room.tenant_name }}</span>
            </div>
            <div class="tenant-row" v-if="room.tenant_phone">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.0 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              <span>{{ room.tenant_phone }}</span>
            </div>
          </div>
          <div v-else class="room-card-tenant empty-tenant">
            គ្មានអ្នកជួល
          </div>

          <div class="room-card-actions">
            <router-link :to="`/rooms/${room.id}`" class="action-btn view card-action-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              មើល
            </router-link>
            <button class="action-btn edit card-action-btn" @click="openModal(room)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              កែប្រែ
            </button>
            <button class="action-btn delete card-action-btn" @click="confirmDelete(room)">
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

    <!-- Modal: Add/Edit Room -->
    <div class="modal fade" id="roomModal" tabindex="-1" ref="roomModalEl">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-head">
            <h3>{{ form.id ? 'កែប្រែបន្ទប់' : 'បន្ថែមបន្ទប់ថ្មី' }}</h3>
            <button type="button" class="modal-close" data-bs-dismiss="modal">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="field">
              <label>ឈ្មោះបន្ទប់ <span class="required">*</span></label>
              <input v-model="form.name" type="text" placeholder="ឧ. បន្ទប់ 101" />
            </div>
            <div class="field">
              <label>ស្ថានភាព</label>
              <select v-model="form.status">
                <option value="available">ទំនេរ</option>
                <option value="occupied">កំពុងជួល</option>
              </select>
            </div>
          </div>
          <div class="modal-foot">
            <button class="btn-ghost" data-bs-dismiss="modal">បោះបង់</button>
            <button class="btn-primary" @click="saveRoom" :disabled="saving">
              <span v-if="saving" class="spinner sm"></span>
              {{ form.id ? 'ធ្វើបច្ចុប្បន្នភាព' : 'បង្កើត' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Confirm Delete -->
    <div class="modal fade" id="deleteModal" tabindex="-1" ref="deleteModalEl">
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
              តើអ្នកពិតជាចង់លុប <strong>{{ deleteTarget?.name }}</strong>?
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

<style scoped>
/* ── Page ── */
.page {
  padding: 2rem 0px;
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
  text-decoration: none;
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

/* ── Responsive toggle ── */
.desktop-only { display: table; width: 100%; }
.mobile-only  { display: none; }

/* ── Table ── */
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

.room-name-cell {
  display: flex;
  align-items: center;
  gap: 9px;
  font-weight: 500;
}

.room-icon {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: rgba(37, 99, 184, 0.3);
  border: 0.5px solid rgba(99, 180, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7dc4ff;
  flex-shrink: 0;
}

.cell-muted { color: rgba(150, 190, 255, 0.4) !important; }

/* ── Status badges ── */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.occupied {
  background: rgba(20, 120, 60, 0.25);
  color: #6ee7a0;
  border: 0.5px solid rgba(80, 200, 120, 0.2);
}

.status-badge.available {
  background: rgba(80, 90, 120, 0.3);
  color: rgba(180, 200, 255, 0.6);
  border: 0.5px solid rgba(120, 140, 200, 0.15);
}

.status-badge.sm {
  font-size: 11px;
  padding: 2px 8px;
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
  gap: 5px;
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
  text-decoration: none;
}

.action-btn.view {
  color: rgba(80, 190, 255, 0.7);
  background: rgba(80, 190, 255, 0.08);
  border-color: rgba(80, 190, 255, 0.15);
}

.action-btn.view:hover {
  color: #50beff;
  background: rgba(80, 190, 255, 0.16);
  border-color: rgba(80, 190, 255, 0.3);
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

/* ── Bootstrap Modal dark override ── */
:deep(.modal-content) {
  background: #111e33;
  border: 0.5px solid rgba(99, 180, 255, 0.15);
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
}

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

/* ── Mobile ── */
@media (max-width: 600px) {
  .page { padding: 1rem; }
  .page-title { font-size: 16px; }
  .desktop-only { display: none; }
  .mobile-only  { display: block; padding: 10px; }

  .table-card {
    background: transparent;
    border: none;
    border-radius: 0;
  }

  /* Room card */
  .room-card {
    background: #111e33;
    border: 0.5px solid rgba(99, 180, 255, 0.1);
    border-radius: 14px;
    padding: 14px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: background 0.15s;
  }

  .room-card:last-child { margin-bottom: 0; }
  .room-card:active { background: rgba(99, 180, 255, 0.06); }

  .room-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .room-card-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .room-avatar {
    width: 42px;
    height: 42px;
    border-radius: 11px;
    background: rgba(37, 99, 184, 0.3);
    border: 0.5px solid rgba(99, 180, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #7dc4ff;
    flex-shrink: 0;
  }

  .room-card-name {
    font-size: 15px;
    font-weight: 600;
    color: #d0e4ff;
    margin-bottom: 4px;
  }

  .room-card-num {
    font-size: 11px;
    color: rgba(150, 190, 255, 0.25);
    flex-shrink: 0;
  }

  /* Tenant info row */
  .room-card-tenant {
    padding: 10px 12px;
    background: rgba(99, 180, 255, 0.04);
    border: 0.5px solid rgba(99, 180, 255, 0.08);
    border-radius: 9px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .tenant-row {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 13px;
    color: rgba(200, 220, 255, 0.7);
  }

  .tenant-row svg { color: rgba(150, 190, 255, 0.4); flex-shrink: 0; }

  .empty-tenant {
    font-size: 12px;
    color: rgba(150, 190, 255, 0.28);
    font-style: italic;
  }

  /* Action row */
  .room-card-actions {
    display: flex;
    gap: 6px;
    padding-top: 10px;
    border-top: 0.5px solid rgba(99, 180, 255, 0.08);
  }

  .card-action-btn {
    flex: 1;
    width: auto;
    height: 36px;
    padding: 0 10px;
    font-size: 12px;
    font-family: inherit;
    gap: 5px;
    border-radius: 8px;
    justify-content: center;
  }

  /* Empty */
  .empty-card {
    text-align: center;
    color: rgba(150, 190, 255, 0.28);
    padding: 3rem 1rem;
    font-size: 14px;
    background: #111e33;
    border: 0.5px solid rgba(99, 180, 255, 0.1);
    border-radius: 14px;
  }

  /* Modal as bottom sheet */
  :deep(.modal-dialog) {
    margin: 0;
    max-width: 100%;
    min-height: 100dvh;
    display: flex;
    align-items: flex-end;
  }

  :deep(.modal-content) {
    border-radius: 20px 20px 0 0;
    border-bottom: none;
  }

  .modal-head {
    border-radius: 20px 20px 0 0;
  }

  .modal-head.danger {
    border-radius: 20px 20px 0 0;
  }
}
</style>