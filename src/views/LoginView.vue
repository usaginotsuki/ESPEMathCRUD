<template>
  <div class="container">
    <VContainer>
      <VRow>
        <VCol>
          <VForm @submit.prevent="login">
            <h2 class="mb-3">Inicia sesión</h2>
            <VTextField v-model="email" label="Email" required></VTextField>
            <VTextField
              v-model="password"
              label="Password"
              required
              type="password"
            ></VTextField>
            <VBtn id="login_button" type="submit" color="primary">
              Login
            </VBtn>
            <div class="alternative-option mt-4">
              You don't have an account?
              <span @click="moveToRegister">Register</span>
            </div>
            <div
              class="alert alert-warning alert-dismissible fade show mt-5 d-none"
              role="alert"
              id="alert_1"
            >
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
              ></button>
            </div>
          </VForm>
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>

<script lang="ts">
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

export default {
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    login(submitEvent: any) {
      console.log(this.email, this.password)

      const auth = getAuth()


      signInWithEmailAndPassword(auth, this.email, this.password)
        .then(() => {
          
          this.$router.push('/dashboard')
          
        })
        .catch((error) => {
          const errorCode = error.code
          const errorMessage = error.message
          console.log(errorCode)
          console.log(errorMessage)
          let alert_1 = document.querySelector('#alert_1')
          if (alert_1 == null) {
            return
          }
          alert_1.classList.remove('d-none')
          alert_1.innerHTML = errorMessage
          console.log(alert_1)
        })
    },
    moveToRegister() {
      this.$router.push('/register')
    },
  },
}
</script>
