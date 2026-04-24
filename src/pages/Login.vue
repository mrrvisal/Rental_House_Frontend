<template>
  <div class="login-wrapper">
    <div class="login-card rounded-4 bg-primary">

      <h2 class="login-title mb-4 text-center">Admin</h2>

      <div class="field">
        <label>Email address</label>
        <div class="input-wrap">
          <svg class="input-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="1" y="3" width="14" height="10" rx="2" />
            <path d="M1 5l7 5 7-5" />
          </svg>
          <input
            v-model="email"
            type="email"
            placeholder="Enter your email"
            autocomplete="email"
            @keyup.enter="handleLogin"
          />
        </div>
      </div>

      <div class="field">
        <label>Password</label>
        <div class="input-wrap">
          <svg class="input-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="7" width="10" height="8" rx="1.5" />
            <path d="M5 7V5a3 3 0 016 0v2" />
          </svg>
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Enter your password"
            autocomplete="current-password"
            @keyup.enter="handleLogin"
          />
          <button class="toggle-pw" type="button" @click="showPassword = !showPassword" aria-label="Toggle password visibility">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
              <template v-if="showPassword">
                <path d="M2 2l12 12M6.5 6.6A2 2 0 0010.4 10M1 8s2.5-5 7-5c1.2 0 2.3.3 3.3.8M15 8s-1 2-3 3.5M6 13.3C6.6 13.7 7.3 14 8 14c4.5 0 7-5 7-5"/>
              </template>
              <template v-else>
                <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"/>
                <circle cx="8" cy="8" r="2"/>
              </template>
            </svg>
          </button>
        </div>
      </div>

      <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>

      <button
        class="btn-login"
        :class="{ loading: isLoading }"
        :disabled="isLoading"
        @click="handleLogin"
      >
        {{ isLoading ? 'Signing in…' : 'Login' }}
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "../services/api.js";

const router = useRouter();

const email        = ref("");
const password     = ref("");
const showPassword = ref(false);
const isLoading    = ref(false);
const errorMsg     = ref("");

console.log(email.value);


async function handleLogin() {
  errorMsg.value = "";

  if (!email.value || !password.value) {
    errorMsg.value = "Please enter your email and password.";
    return;
  }

  isLoading.value = true;

  try {
    const res = await login({ email: email.value, password: password.value });
    localStorage.setItem("token", res.data.token);
    router.push("/");
  } catch (err) {
    errorMsg.value =
      err.response?.data?.message || "Invalid email or password. Please try again.";
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

.login-wrapper {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  font-family: 'DM Sans', sans-serif;
  color: white;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
}

.login-title {
  font-size: 22px;
  font-weight: 600;
  color: white;
  letter-spacing: -0.02em;
}

/* ── Fields ── */
.field {
  margin-bottom: 1rem;
}

.field label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.7);  /* visible on blue bg */
}

/* ── Input wrapper ── */
.input-wrap {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.35);
}

.input-wrap input {
  width: 100%;
  height: 42px;
  padding: 0 40px 0 38px;
  font-size: 14px;
  font-family: 'DM Sans', sans-serif;
  color: white;                          /* white text on blue */
  background: rgba(255, 255, 255, 0.12); /* semi-transparent white */
  border: none;
  outline: none;
  transition: background 0.15s;
}

.input-wrap input:focus {
  background: rgba(255, 255, 255, 0.2);
}

.input-wrap input::placeholder {
  color: rgba(255, 255, 255, 0.45);
}

/* ── Icons ── */
.input-icon {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: white;
  opacity: 0.55;
  pointer-events: none;
}

.toggle-pw {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: white;
  opacity: 0.55;
  display: flex;
  align-items: center;
  transition: opacity 0.15s;
}
.toggle-pw:hover { opacity: 1; }

/* ── Error ── */
.error-msg {
  font-size: 12px;
  color: #fca5a5;
  margin-top: 10px;
  padding: 8px 12px;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.45);
  border-radius: 8px;
}

/* ── Button ── */
.btn-login {
  width: 100%;
  height: 42px;
  margin-top: 1.25rem;
  background: white;
  color: #1a1a1a;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
  letter-spacing: 0.01em;
}
.btn-login:hover  { opacity: 0.88; }
.btn-login:active { transform: scale(0.99); }
.btn-login.loading,
.btn-login:disabled { opacity: 0.6; pointer-events: none; }
</style>