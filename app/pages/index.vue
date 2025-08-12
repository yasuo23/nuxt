<template>
  <div class="p-6 text-sm text-gray-500">Redirecting to login...</div>
  
</template>

<script setup lang="ts">
definePageMeta({
  middleware: [() => navigateTo('/login', { replace: true })],
})
</script>


