<template>
  <div class="min-h-screen bg-slate-50 font-sans selection:bg-emerald-100">
    <Navbar />
    <router-view></router-view>
  </div>
</template>
<script setup>import Navbar from './components/Navbar.vue';</script>