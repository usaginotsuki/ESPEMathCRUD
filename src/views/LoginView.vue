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
            <VBtn
              id="login_button"
              type="submit"
              color="primary"
              @click="loginWithGoogle"
            >
              Login with Google
            </VBtn>
          </VForm>
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>

<script lang="ts">
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'

export default {
  components: {},
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
    async loginWithGoogle() {
      const provider = new GoogleAuthProvider()
      const auth = getAuth()
      console.log(auth)
      //check if user is already logged in
      const currentUser = auth.currentUser
      if (currentUser) {
        console.log('User is already logged in')

        this.$router.push('/dashboard')
        return
      } else {
        await signInWithPopup(auth, provider)
          .then(async (result) => {
            const credential = await GoogleAuthProvider.credentialFromResult(
              result,
            )
            if (credential == null) {
              return
            }
            const token = credential.accessToken
            const user = result.user
            console.log(user)
            this.$router.push('/dashboard')
          })
          .catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
            const email = error.email
            const credential = GoogleAuthProvider.credentialFromError(error)
            console.log(errorCode)
            console.log(errorMessage)
            console.log(email)
            console.log(credential)
          })
      }
    },
  },
}
</script>
