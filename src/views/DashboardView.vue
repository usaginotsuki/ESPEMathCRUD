<template>
  <div>
    <VContainer :fluid="true">
      <VRow>
        <VCol>
          <div v-for="item in unidades" :key="item.id">
            <VCard
              width="100%"
              outlined="true"
              @click="verUnidad(item)"
              style="text-align: center;"
              class="mx-auto my-12"
            >
              <VContainer>
                <VRow>
                  <VCol md="4">
                    <VImg :src="item.urlMainImage" width="100%" />
                  </VCol>
                  <VCol align-self="center">
                    <h2>{{ item.titleUnitBook }}</h2>
                    <p>{{ item.descriptionUnitBook }}</p>
                  </VCol>
                </VRow>
              </VContainer>
            </VCard>
          </div>
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>

<script lang="ts">
import { getAuth } from 'firebase/auth'
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite'

const auth = getAuth()

export default {
  data() {
    let unidades: any = []
    let panel: number = 0
    return {
      panel,
      unidades,
    }
  },
  methods: {
    signOut() {
      auth
        .signOut()
        .then(() => {
          console.log('Sign Out completed')
          this.$router.push('/')
        })
        .catch((error) => console.log(error))
    },
    verUnidad(id: any) {
      console.log(id.id)
      console.log('click')
      this.$router.push({
        path: `/unidad/${id.id}`,
      })
    },
  },
  async created() {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        this.$router.push('/')
      }
    })
    const db = getFirestore()
    const querySnapshot = await getDocs(collection(db, 'contenido'))
    let index = 0

    querySnapshot.forEach(async (doc) => {
      this.unidades.push(doc.data())
      console.log(index, doc.id)
      this.unidades[index].id = doc.id
      index++

      let unitContent = await getDocs(
        collection(db, 'contenido', doc.id, 'temas'),
      )
      let temas: any = []

      console.log(doc.id, ' => ', doc.data())
    })
    console.log(this.unidades)
    //this.unidades into object

    //console.log(auth.currentUser)
  },
}
</script>
