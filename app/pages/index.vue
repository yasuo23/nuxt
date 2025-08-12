<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { useAuth } from '~/composables/useAuth'

const { login, loading, error, user } = useAuth()
const email = ref('')
const password = ref('')
const router = useRouter()

const handleLogin = async () => {
  await login(email.value, password.value)
  if (user.value) router.push('/')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
    <Card class="w-full max-w-sm shadow-xl rounded-2xl border border-green-200">
      <CardHeader>
        <h1 class="text-2xl font-bold text-green-700 text-center">Welcome Back</h1>
        <p class="text-sm text-green-600 text-center">Login to your account</p>
      </CardHeader>
      <CardContent class="space-y-4">
        <Input v-model="email" type="email" placeholder="Email" class="border-green-300 focus:ring-green-500" />
        <Input v-model="password" type="password" placeholder="Password" class="border-green-300 focus:ring-green-500" />
        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
      </CardContent>
      <CardFooter class="flex flex-col space-y-2">
        <Button :disabled="loading" @click="handleLogin" class="bg-green-600 hover:bg-green-700 w-full">
          <span v-if="!loading">Login</span>
          <span v-else>Loading...</span>
        </Button>
        <p class="text-xs text-green-500 text-center">© 2025 Your Company</p>
      </CardFooter>
    </Card>
  </div>
</template>
