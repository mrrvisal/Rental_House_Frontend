<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <router-link class="navbar-brand fw-bold" to="/">
          <i class="bi bi-building me-2"></i>គ្រប់គ្រងផ្ទះជួល
        </router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/" exact-active-class="active">
                <i class="bi bi-speedometer2 me-1"></i>ផ្ទាំងគ្រប់គ្រង
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/rooms" active-class="active">
                <i class="bi bi-door-open me-1"></i>បន្ទប់
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/tenants" active-class="active">
                <i class="bi bi-people me-1"></i>អ្នកជួល
              </router-link>
            </li>
            <li v-if="isAuthenticated" class="nav-item">
              <a class="nav-link" href="#" @click.prevent="logout">
                <i class="bi bi-box-arrow-right me-1"></i>ចាកចេញ
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Page Content -->
    <div class="container my-4">
      <router-view />
    </div>

    <!-- Footer -->
    <footer class="bg-light border-top mt-5 py-3">
      <div class="container text-center text-muted small">
        &copy; {{ new Date().getFullYear() }} ប្រព័ន្ធគ្រប់គ្រងផ្ទះជួល
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useAuth } from "./composables/useAuth.js";

const { logout, isAuthenticated } = useAuth();
</script>

<style>
body {
  background-color: #f8f9fa;
}
.router-link-active.nav-link {
  font-weight: 600;
  text-decoration: underline;
}
</style>

