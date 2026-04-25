<template>
  <div class="page">
    <div class="login-wrap">
      <div class="card">
        <!-- Card Head -->
        <div class="card-head">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <span class="card-head-title">Admin Login</span>
        </div>

        <!-- Card Body -->
        <div class="card-body">
          <!-- Email -->
          <div class="field">
            <label>អ៊ីមែល</label>
            <div class="input-wrap">
              <svg
                class="input-icon"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <rect x="1" y="3" width="14" height="10" rx="2" />
                <path d="M1 5l7 5 7-5" />
              </svg>
              <input
                v-model="email"
                type="email"
                placeholder="you@example.com"
                @keyup.enter="handleLogin"
              />
            </div>
          </div>

          <!-- Password -->
          <div class="field">
            <label>ពាក្យសម្ងាត់</label>
            <div class="input-wrap">
              <svg
                class="input-icon"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <rect x="3" y="7" width="10" height="8" rx="1.5" />
                <path d="M5 7V5a3 3 0 016 0v2" />
              </svg>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                @keyup.enter="handleLogin"
              />
              <button
                class="toggle-pw"
                type="button"
                @click="showPassword = !showPassword"
              >
                👁
              </button>
            </div>
          </div>

          <!-- Error -->
          <div v-if="errorMsg" class="error-msg">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {{ errorMsg }}
          </div>

          <!-- Success -->
          <div v-if="successMsg" class="success-msg">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            {{ successMsg }}
          </div>

          <!-- Submit Button -->
          <button class="btn-login" :disabled="isLoading" @click="handleLogin">
            <span v-if="isLoading" class="spinner sm"></span>
            <svg
              v-else
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            <span>{{ isLoading ? "កំពុងចូល ..." : "ចូលគណនី" }}</span>
          </button>
        </div>

        <!-- Card Footer -->
        <div class="card-foot">បំពេញព័ត៌មានដើម្បីចូលគ្រប់គ្រង</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
// import { useRouter } from "vue-router";
import { login } from "../services/api.js";

// const router = useRouter();

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const isLoading = ref(false);
const errorMsg = ref("");
const successMsg = ref("");

async function handleLogin() {
  errorMsg.value = "";
  successMsg.value = "";

  if (!email.value || !password.value) {
    errorMsg.value = "សូមបញ្ចូលអ៊ីមែល និងពាក្យសម្ងាត់របស់អ្នក។";
    return;
  }

  isLoading.value = true;

  try {
    const res = await login({ email: email.value, password: password.value });
    localStorage.setItem("token", res.data.data.token);
    successMsg.value = "ចូលដោយជោគជ័យ។";
    setTimeout(() => {
      window.location.href = "/";
    }, 800);
  } catch (err) {
    errorMsg.value =
      err.response?.data?.message ||
      "Invalid email or password. Please try again.";
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
/* ── Page ── */
.page {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: "Outfit", "Segoe UI", sans-serif;
  color: #d0e4ff;
}

/* ── Login Wrap ── */
.login-wrap {
  width: 100%;
  max-width: 420px;
}

/* ── Card ── */
.card {
  background: #111e33;
  border: 0.5px solid rgba(99, 180, 255, 0.1);
  border-radius: 14px;
  overflow: hidden;
}

/* ── Card Head ── */
.card-head {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 13px 18px;
  background: rgba(26, 79, 160, 0.35);
  border-bottom: 0.5px solid rgba(99, 180, 255, 0.15);
}

.card-head svg {
  color: #4aadff;
  flex-shrink: 0;
}

.card-head-title {
  font-size: 15px;
  font-weight: 600;
  color: #d0e4ff;
}

/* ── Card Body ── */
.card-body {
  padding: 1.4rem 1.25rem;
}

/* ── Field ── */
.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 1.1rem;
}

.field label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(150, 190, 255, 0.55);
}

/* ── Input Wrap ── */
.input-wrap {
  position: relative;
  border: 0.5px solid rgba(99, 180, 255, 0.15);
  border-radius: 9px;
  overflow: hidden;
  transition: border-color 0.15s, background 0.15s;
}

.input-wrap:focus-within {
  border-color: rgba(99, 180, 255, 0.4);
  background: rgba(99, 180, 255, 0.05);
}

.input-wrap input {
  width: 100%;
  height: 42px;
  padding: 0 40px 0 38px;
  background: rgba(255, 255, 255, 0.04);
  border: none;
  outline: none;
  font-size: 13.5px;
  color: #d0e4ff;
  font-family: inherit;
}

.input-wrap input::placeholder {
  color: rgba(150, 190, 255, 0.3);
}

/* ── Input Icon ── */
.input-icon {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  width: 15px;
  height: 15px;
  color: rgba(150, 190, 255, 0.5);
  pointer-events: none;
}

/* ── Toggle Password ── */
.toggle-pw {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(150, 190, 255, 0.45);
  font-size: 14px;
  padding: 0;
  line-height: 1;
  transition: color 0.15s;
}

.toggle-pw:hover {
  color: rgba(150, 190, 255, 0.85);
}

/* ── Error ── */
.error-msg {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 13px;
  background: rgba(248, 113, 113, 0.08);
  border: 0.5px solid rgba(248, 113, 113, 0.2);
  border-radius: 9px;
  font-size: 12.5px;
  color: #f87171;
  margin-bottom: 1rem;
}

.error-msg svg {
  flex-shrink: 0;
}

/* ── Success ── */
.success-msg {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 13px;
  background: rgba(74, 222, 128, 0.08);
  border: 0.5px solid rgba(74, 222, 128, 0.2);
  border-radius: 9px;
  font-size: 12.5px;
  color: #4ade80;
  margin-bottom: 1rem;
}

.success-msg svg {
  flex-shrink: 0;
}

/* ── Login Button ── */
.btn-login {
  width: 100%;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #1a4fa0;
  color: #fff;
  border: 0.5px solid rgba(99, 180, 255, 0.3);
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.18s;
}

.btn-login:hover {
  background: #2563b8;
}
.btn-login:active {
  transform: scale(0.98);
}
.btn-login:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
}

/* ── Spinner ── */
.spinner {
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

.spinner.sm {
  width: 14px;
  height: 14px;
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  border-top-color: #fff;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── Card Footer ── */
.card-foot {
  padding: 11px 18px;
  border-top: 0.5px solid rgba(99, 180, 255, 0.08);
  background: rgba(99, 180, 255, 0.03);
  font-size: 11.5px;
  color: rgba(150, 190, 255, 0.35);
  text-align: center;
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .page {
    padding: 1rem;
  }
}
</style>