<template>
  <div>
    <VContainer :fluid="true" style="padding-top: 5%;">
      <VRow>
        <VCol>
          <div v-for="item in unidades" :key="item.id">
            <VCard
              width="80%"
              outlined="true"
              @click="verUnidad(item)"
              style="text-align: center;"
              class="mx-auto my-12"
            >
              <VContainer>
                <VRow>
                  <VCol md="4">
                    <VImg :src="item.urlMainImage" width="50%" />
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
      <VRow>
        <VCol>
          <center>
            <VBtn color="success" width="80%" @click="crearUnidad()">
              Crear nueva unidad
            </VBtn>
          </center>
        </VCol>
      </VRow>
    </VContainer>
  </div>
  <div class="text-xs-center">
    <VDialog v-model="newUnitDialog" persistent width="1000">
      <VCard>
        <center>
          <VCard color="primary">
            <VCardTitle style="color: white;" color="primary" class="headline">
              Crear nuevo tema
            </VCardTitle>
          </VCard>
        </center>
        <VCardText>
          <VRow>
            <VCol md="3">
              <VCardTitle><b>Titulo:</b></VCardTitle>
            </VCol>
            <VCol>
              <VTextField
                v-model="newUnit.titleUnitBook"
                label="Titulo"
                required
              ></VTextField>
            </VCol>
          </VRow>
          <VRow>
            <VCol md="3">
              <VCardTitle><b>Descripción:</b></VCardTitle>
            </VCol>
            <VCol>
              <VTextarea
                v-model="newUnit.descriptionUnitBook"
                label="Descripción"
                required
              ></VTextarea>
            </VCol>
          </VRow>
          <br />
          <div v-if="newUnit.urlMainImage">
            <VImg :src="newUnit.urlMainImage" width="100%" />
          </div>
          <br />
          <VBtn
            v-if="newUnit.urlMainImage == ''"
            width="100%"
            color="success"
            @click="addImage()"
          >
            Añadir imagen
          </VBtn>
          <VBtn v-else width="100%" color="red" @click="deleteImage()">
            Eliminar imagen
          </VBtn>
          <br />
        </VCardText>
        <VCardActions>
          <VRow>
            <VCol offset="6" style="margin-right: 0px; padding-right: 0px;">
              <VBtn
                variant="elevated"
                color="success"
                class="me-3"
                @click="saveNewUnit()"
              >
                Guardar
                <VIcon>mdi-content-save</VIcon>
              </VBtn>

              <VBtn
                variant="elevated"
                color="red"
                class="me-3"
                @click="deleteNewUnit()"
              >
                Cancelar
                <VIcon>mdi-close</VIcon>
              </VBtn>
            </VCol>
          </VRow>
          <br />
        </VCardActions>
      </VCard>
    </VDialog>
    <VFileInput
      ref="fileImage"
      v-show="false"
      accept=".jpg, .jpeg, .png"
      state="Boolean(file)"
      label="Añadir anexos..."
      @change="uploadImageUnit"
    ></VFileInput>
  </div>
</template>

<script lang="ts">
import { color } from '@cloudinary/url-gen/qualifiers/background'
import { getAuth } from 'firebase/auth'
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  orderBy,
  query,
} from 'firebase/firestore/lite'
import axios from 'axios'
import { toast } from 'vue3-toastify'

const auth = getAuth()

export default {
  components: {
  },
  data() {
    let unidades: any = []
    let panel: number = 0
    let newUnitDialog: boolean = false
    let newUnit: any = {
      titleUnitBook: '',
      descriptionUnitBook: '',
      urlMainImage: '',
      idUnitBook: '',
    }
    return {
      panel,
      unidades,
      newUnitDialog,
      newUnit,
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
    crearUnidad() {
      this.newUnitDialog = true
    },
    addImage() {
      let fileInputElement: any = this.$refs.fileImage
      fileInputElement.click()
    },
    async uploadImageUnit(e: any) {
      const image = e.target.files ? e.target.files[0] : null
      if (image) {
        let toast2 = toast.loading(
          'Actualizando la información, espere un segundo',
        )
        console.log('AÑADIR IMAGEN')
        const formData = new FormData()
        formData.append('file', image)
        formData.append('upload_preset', 'hsvfa23f')
        await axios
          .post('https://api.cloudinary.com/v1_1/dmx1v3oeu/upload', formData)
          .then(async (res: any) => {
            console.log(res.data.secure_url)
            this.newUnit.urlMainImage = res.data.secure_url
            toast.update(toast2, {
              render: 'Imagen añadida',
              type: 'success',
              isLoading: false,
              autoClose: 2000,
            })
          })
      }
    },
    deleteImage() {
      this.newUnit.urlMainImage = ''
    },
    deleteNewUnit() {
      this.newUnit = {
        titleUnitBook: '',
        descriptionUnitBook: '',
        urlMainImage: '',
        idUnitBook: '',
      }
      this.newUnitDialog = false
    },
    async saveNewUnit() {
      const db = getFirestore()
      let toast2 = toast.loading(
        'Actualizando la información, espere un segundo',
      )
      let lastID = this.unidades.length - 1
      let id = this.unidades[lastID].unidad + 1

      try {
        await addDoc(collection(db, 'contenido'), {
          titleUnitBook: this.newUnit.titleUnitBook,
          descriptionUnitBook: this.newUnit.descriptionUnitBook,
          urlMainImage: this.newUnit.urlMainImage,
          unidad: id,
        })
        toast.update(toast2, {
          render: 'Unidad creada',
          type: 'success',
          isLoading: false,
          autoClose: 2000,
        })
      } catch (e) {
        console.log(e)
      }
    },
  },
  async created() {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        this.$router.push('/')
      }
    })
    const db = getFirestore()
    const unitsQuery = query(
      collection(db, 'contenido'),
      orderBy('unidad', 'asc'),
      //orderBy('unidad'),
    )
    const querySnapshot = await getDocs(unitsQuery)
    let index = 0

    querySnapshot.forEach(async (doc) => {
      this.unidades.push(doc.data())
      console.log(index, doc.id)
      this.unidades[index].id = doc.id
      index++
    })
    console.log(this.unidades)
    //this.unidades into object

    //console.log(auth.currentUser)
  },
}
</script>
