<template>
  <div class="container">
    <h1>Role-Based Authorization Example</h1>
    
    <!-- AUTHENTICATION SECTION -->
    <div class="auth-section">
      <div v-if="user">
        <h2>Welcome, {{ user.name }} (Role: {{ user.role }})</h2>
        <button @click="logout">Log Out</button>
      </div>
      <div v-else>
        <h2>Log In</h2>
        <p>You can log in with username: <strong>admin</strong> or <strong>user</strong></p>
        <input v-model="username" placeholder="Enter username" @keyup.enter="login" />
        <button @click="login">Log In</button>
      </div>
      <p v-if="authError" class="error">{{ authError }}</p>
    </div>

    <!-- PROTECTED SECTION -->
    <div class="protected-section">
      <h3>Private Content</h3>
      <p>This button calls an <strong>admin-only</strong> route. It will fail if you are logged in as 'user'.</p>
      <button @click="fetchSecretMessage" :disabled="!user">
        Get Secret Message (Admin Only)
      </button>
      <p v-if="secretMessage" class="success">{{ secretMessage }}</p>
      <!-- The error message will now show "FORBIDDEN" for the regular user -->
      <p v-if="secretMessageError" class="error">Error: {{ secretMessageError }}</p>
    </div>

    <hr />

    <!-- TODO LIST (Still protected for any logged-in user) -->
    <div class="todo-section">
      <h2>Todo List</h2>
      <p>This feature is available to <strong>any logged-in user</strong> (admin or user).</p>
      
      <div class="form-container">
        <input v-model="newTodoText" :disabled="!user" placeholder="What needs to be done?" class="todo-input" />
        <button @click="addTodo" :disabled="!user" class="add-button">Add Todo</button>
      </div>

      <p v-if="todoError" class="error">{{ todoError }}</p>

      <ul v-if="todos" class="todo-list">
        <li v-for="todo in todos" :key="todo.id">
          <span>{{ todo.text }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { TRPCClientError } from '@trpc/client';
import type { inferRouterOutputs } from '@trpc/server';

type RouterOutput = inferRouterOutputs<AppRouter>;
type User = RouterOutput['auth']['getSession'];

const { $client } = useNuxtApp();

// Auth State
const user = ref<User>(null);
const username = ref('');
const authError = ref('');

// Secret Message State
const secretMessage = ref('');
const secretMessageError = ref('');

// Todo State
const newTodoText = ref('');
const todoError = ref('');
const { data: todos, refresh: refreshTodos } = await useAsyncData('todos', () => $client.todo.getTodos.query());

// --- METHODS ---

const handleTrpcError = (err: unknown) => {
  if (err instanceof TRPCClientError) {
    return err.message;
  }
  return 'An unknown error occurred.';
};

const fetchSession = async () => {
  try {
    user.value = await $client.auth.getSession.query();
  } catch (e) {
    user.value = null;
  }
};

const login = async () => {
  if (!username.value) return;
  authError.value = '';
  try {
    user.value = await $client.auth.login.mutate({ username: username.value });
  }
  catch (err) {
    authError.value = handleTrpcError(err);
  }
};

const logout = async () => {
  await $client.auth.logout.mutate();
  user.value = null;
  secretMessage.value = '';
  secretMessageError.value = '';
};

const fetchSecretMessage = async () => {
  secretMessageError.value = '';
  secretMessage.value = '';
  try {
    secretMessage.value = await $client.auth.getSecretMessage.query();
  }
  catch (err) {
    secretMessageError.value = handleTrpcError(err);
  }
};

const addTodo = async () => {
  if (newTodoText.value.trim() === '') return;
  todoError.value = '';
  try {
    await $client.todo.addTodo.mutate({ text: newTodoText.value });
    newTodoText.value = '';
    await refreshTodos();
  } catch (err) {
    todoError.value = handleTrpcError(err);
  }
};

// Fetch session on component mount to check if user is already logged in
onMounted(fetchSession);
</script>

<style>
.container {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}
.auth-section, .protected-section, .todo-section {
  border: 1px solid #e2e8f0;
  background-color: #f8fafc;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 8px;
}
h1, h2, h3 {
  color: #1a202c;
}
p {
  color: #4a5568;
}
input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  box-sizing: border-box;
}
button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  background-color: #4299e1;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}
button:hover {
  background-color: #2b6cb0;
}
button:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}
.form-container {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.todo-input {
  flex-grow: 1;
  margin-bottom: 0;
}
.todo-list {
  list-style: none;
  padding: 0;
}
.todo-list li {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
}
.todo-list li:last-child {
  border-bottom: none;
}
hr {
  margin: 2.5rem 0;
  border: 0;
  border-top: 1px solid #e2e8f0;
}
.error {
  color: #e53e3e;
  font-weight: bold;
  margin-top: 0.5rem;
}
.success {
  color: #38a169;
  font-weight: bold;
  margin-top: 0.5rem;
}
</style>