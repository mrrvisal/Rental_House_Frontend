<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar">
      <div class="nav-container">
        <!-- Brand -->
        <router-link class="navbar-brand" to="/">
          <img
            src="https://res.cloudinary.com/daji2ml3y/image/upload/v1777089428/ChatGPT_Image_Apr_25_2026_10_56_42_AM_vvro0h.png"
            alt="logo"
          />
        </router-link>

        <!-- Hamburger -->
        <button class="nav-toggler" @click="isOpen = !isOpen" aria-label="Toggle menu">
          <span :class="{ open: isOpen }"></span>
          <span :class="{ open: isOpen }"></span>
          <span :class="{ open: isOpen }"></span>
        </button>

        <!-- Links -->
        <ul class="nav-links" :class="{ 'nav-open': isOpen }">
          <li>
            <router-link to="/" exact-active-class="active" @click="isOpen = false">
              <i class="bi bi-speedometer2"></i>
              ផ្ទាំងគ្រប់គ្រង
            </router-link>
          </li>
          <li>
            <router-link to="/rooms" active-class="active" @click="isOpen = false">
              <i class="bi bi-door-open"></i>
              បន្ទប់
            </router-link>
          </li>
          <li>
            <router-link to="/tenants" active-class="active" @click="isOpen = false">
              <i class="bi bi-people"></i>
              អ្នកជួល
            </router-link>
          </li>

          <!-- ✅ Logout button — only when logged in -->
          <li v-if="isLoggedIn">
            <button class="btn-logout-nav" @click="showConfirm = true">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              ចាកចេញ
            </button>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Page Content -->
    <div class="container m-auto">
      <router-view />
    </div>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-container">
        <p class="footer-text">
          &copy; {{ new Date().getFullYear() }} ប្រព័ន្ធគ្រប់គ្រងផ្ទះជួល
        </p>
      </div>
    </footer>

    <!-- ✅ Confirm Logout Modal (no Bootstrap dependency) -->
    <div v-if="showConfirm" class="modal-overlay" @click.self="showConfirm = false">
      <div class="modal-box">
        <div class="modal-head danger">
          <h3>បញ្ជាក់ការចាកចេញ</h3>
          <button class="modal-close" @click="showConfirm = false">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <p class="delete-msg">តើអ្នកប្រាកដថាចង់ចាកចេញពីប្រព័ន្ធ?</p>
        </div>
        <div class="modal-foot">
          <button class="btn-ghost" @click="showConfirm = false">បោះបង់</button>
          <button class="btn-danger" @click="handleLogout" :disabled="saving">
            <span v-if="saving" class="spinner sm"></span>
            <span v-else>ចាកចេញ</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { logout } from './services/api.js'

const router = useRouter()
const route  = useRoute()

const isLoggedIn = ref(!!localStorage.getItem('token'))
const isOpen     = ref(false)
const showConfirm = ref(false)
const saving     = ref(false)

// ✅ Re-check login state on route change (after login/logout)
watch(() => route.path, () => {
  isLoggedIn.value = !!localStorage.getItem('token')
})

// ✅ Logout
const handleLogout = async () => {
  saving.value = true
  try {
    await logout() // call DELETE /api/logout to clear token in DB
  } catch (_) {
    // even if API fails, still logout locally
  } finally {
    localStorage.removeItem('token')
    isLoggedIn.value = false
    showConfirm.value = false
    saving.value = false
    router.push('/login')
  }
}
</script>

<style scoped>
/* ── Page ── */
.navbar {
  background: #0f1a2e;
  height: 64px;
  border-bottom: 0.5px solid rgba(99, 180, 255, 0.12);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(99, 180, 255, 0.35), transparent);
}

.nav-container {
  width: 1440px !important;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-brand img {
  margin-top: 5px;
  max-width: 70px;
  max-height: 100%;
  display: block;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-links a {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(200, 220, 255, 0.65);
  text-decoration: none;
  border: 0.5px solid transparent;
  transition: all 0.18s ease;
  white-space: nowrap;
}

.nav-links a:hover {
  color: #fff;
  background: rgba(99, 180, 255, 0.1);
  border-color: rgba(99, 180, 255, 0.18);
}

.nav-links a.active {
  color: #fff;
  background: rgba(37, 99, 184, 0.35);
  border-color: rgba(99, 180, 255, 0.25);
}

.nav-links i { font-size: 15px; }

/* ✅ Logout Nav Button */
.btn-logout-nav {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(248, 113, 113, 0.75);
  background: transparent;
  border: 0.5px solid transparent;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.18s ease;
  white-space: nowrap;
}

.btn-logout-nav:hover {
  color: #f87171;
  background: rgba(248, 113, 113, 0.1);
  border-color: rgba(248, 113, 113, 0.2);
}

/* Hamburger */
.nav-toggler {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
}

.nav-toggler span {
  display: block;
  width: 18px;
  height: 1.5px;
  background: rgba(200, 220, 255, 0.7);
  border-radius: 2px;
  transition: all 0.25s ease;
}

.nav-toggler span:nth-child(1).open { transform: translateY(6.5px) rotate(45deg); }
.nav-toggler span:nth-child(2).open { opacity: 0; transform: scaleX(0); }
.nav-toggler span:nth-child(3).open { transform: translateY(-6.5px) rotate(-45deg); }

/* Footer */
.footer {
  background: #0f1a2e;
  border-top: 0.5px solid rgba(99, 180, 255, 0.12);
  padding: 1rem 0;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-text {
  font-size: 13px;
  color: rgba(200, 220, 255, 0.6);
  margin: 0;
}

/* ✅ Custom Modal Overlay (no Bootstrap needed) */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 10, 22, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  backdrop-filter: blur(2px);
}

.modal-box {
  background: #111e33;
  border: 0.5px solid rgba(99, 180, 255, 0.15);
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
  width: 100%;
  max-width: 360px;
  overflow: hidden;
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

.modal-close:hover { background: rgba(255,255,255,0.07); color: #fff; }

.modal-body {
  padding: 1.25rem;
}

.modal-foot {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 1rem 1.25rem;
  border-top: 0.5px solid rgba(99, 180, 255, 0.1);
}

.delete-msg {
  font-size: 14px;
  color: rgba(210, 230, 255, 0.7);
  line-height: 1.6;
  margin: 0;
}

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
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-danger:hover { background: rgba(200,50,50,0.8); }
.btn-danger:disabled { opacity: 0.45; cursor: not-allowed; }

/* Spinner */
.spinner {
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

.spinner.sm {
  width: 13px;
  height: 13px;
  border: 1.5px solid rgba(255, 200, 200, 0.3);
  border-top-color: #ffbcbc;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Mobile */
@media (max-width: 768px) {
  .navbar { height: auto; min-height: 64px; }

  .nav-container { flex-wrap: wrap; padding: 0 1rem; }

  .navbar-brand { height: 64px; display: flex; align-items: center; }

  .nav-toggler { display: flex; }

  .nav-links {
    display: none;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    padding: 0.75rem 0 1rem;
    gap: 2px;
    border-top: 0.5px solid rgba(99, 180, 255, 0.1);
  }

  .nav-links.nav-open { display: flex; }

  .nav-links a,
  .btn-logout-nav { padding: 10px 12px; width: 100%; }
}
</style>