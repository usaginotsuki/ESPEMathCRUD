<template>
  <div>
    <VContainer :fluid="true">
      <br />
      <VRow>
        <VCol>
          <VCard
            width="80%"
            outlined="true"
            style="text-align: center;"
            class="mx-auto my-12"
          >
            <VCardTitle
              style="
                padding-top: 5%;
                padding-bottom: 5%;
                overflow-wrap: break-word;
                word-wrap: break-word;
                white-space: pre-wrap;
              "
            >
              <h1>{{ unitInfo.titleUnitBook }}</h1>
            </VCardTitle>
            <VCardText>
              {{ unitInfo.descriptionUnitBook }}
            </VCardText>
            <VExpansionPanels>
              <VExpansionPanel v-for="tema in unidades" :key="tema.id">
                <VExpansionPanelTitle>
                  <VRow>
                    <VCol>{{ tema.idSubject }} {{ tema.titleSubject }}</VCol>
                    <VCol md="2" class="text-right">
                      <VBtn @click="editTopic(tema)">
                        Editar
                      </VBtn>
                    </VCol>
                  </VRow>
                </VExpansionPanelTitle>
                <VExpansionPanelText>
                  {{ tema.descriptionSubject }}
                  <div v-for="topic in tema.topic" :key="topic.id">
                    <VImg :src="topic.urlImageTopic"></VImg>
                  </div>
                </VExpansionPanelText>
              </VExpansionPanel>
              <br />
              <span style="padding-top: 5%; padding-bottom: 5%;">
                <VBtn
                  elevation="outlined"
                  color="green"
                  @click="newContent = true"
                >
                  Agregar nuevo contenido
                </VBtn>
              </span>
            </VExpansionPanels>
            <div v-show="loading">
              <center>
                <VRow>
                  <VCol>
                    <VCardTitle>
                      <h3 class="headline mb-0">Cargando contenido</h3>
                      <VProgressCircular
                        :size="70"
                        :width="7"
                        color="primary"
                        indeterminate
                      ></VProgressCircular>
                    </VCardTitle>
                  </VCol>
                </VRow>
              </center>
            </div>
          </VCard>
        </VCol>
      </VRow>
    </VContainer>
  </div>
  <div class="text-xs-center">
    <VDialog v-model="newContent" persistent="true" width="1000">
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
            <VCol md="2">
              <VCardTitle><b>Titulo:</b></VCardTitle>
            </VCol>
            <VCol md="6">
              <VTextField
                v-model="newTema.titleSubject"
                label="Titulo"
                required
              ></VTextField>
            </VCol>
          </VRow>
          <VRow>
            <VCol>
              <VCardTitle><b>Contenido:</b></VCardTitle>
            </VCol>
            <VCol>
              <VTextarea
                v-model="newTema.descriptionSubject"
                required
              ></VTextarea>
            </VCol>
          </VRow>
        </VCardText>
        <VCardText class="d-flex justify-center">
          <VBtn variant="elevated" class="me-3" @click="saveContent()">
            Guardar
          </VBtn>
          <VBtn
            variant="elevated"
            color="alert"
            class="me-3"
            @click="closeContent()"
          >
            Cancelar
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
  <div class="text-xs-center">
    <VDialog v-model="editContent" persistent="true" width="1000">
      <VCard>
        <center>
          <VCard color="primary">
            <VCardTitle style="color: white;" color="primary" class="headline">
              Editar contenido
            </VCardTitle>
          </VCard>
        </center>
        <VCardText>
          <VRow>
            <VCol md="2">
              <VCardTitle><b>Titulo:</b></VCardTitle>
            </VCol>
            <VCol>
              <VTextField
                v-model="currentEditing.titleSubject"
                label="Titulo"
                required
              ></VTextField>
            </VCol>
          </VRow>
          <VRow>
            <VCol md="2">
              <VCardTitle><b>Contenido:</b></VCardTitle>
            </VCol>
            <VCol>
              <VTextarea
                v-model="currentEditing.descriptionSubject"
                required
                rows="10"
              ></VTextarea>
            </VCol>
          </VRow>
          <VRow v-for="topic in currentEditing.topic" :key="topic.id">
            <VCol md="9">
              <VImg
                :src="topic.urlImageTopic"
                style="width: max-contents;"
              ></VImg>
            </VCol>
            <VCol style="padding-top: 20%;">
              <VBtn color="red" @click="deleteTopic(topic.idTopic)">
                Eliminar imagen
              </VBtn>
            </VCol>
          </VRow>
          <VBtn color="primary" width="100%" @click="addImage()">
            Agregar imagen
          </VBtn>
          <br />
        </VCardText>
        <br />

        <VCardActions style="margin-left: 72%;">
          <br />

          <VBtn
            variant="elevated"
            color="success"
            class="me-3"
            @click="saveEdit()"
          >
            Guardar
          </VBtn>
          <VBtn
            variant="elevated"
            color="red"
            class="me-3"
            @click="closeContent()"
          >
            Cancelar
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
    <VFileInput
      ref="file"
      v-show="false"
      accept=".jpg, .jpeg, .png"
      state="Boolean(file)"
      label="Añadir anexos..."
      @change="uploadImage"
    ></VFileInput>
  </div>
</template>

<script lang="ts">
import { getAuth } from 'firebase/auth'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import axios from 'axios'
//const { Configuration, OpenAIApi } = require("openai");
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  where,
  doc,
  query,
  orderBy,
  setDoc,
  addDoc,
  deleteDoc,
} from 'firebase/firestore/lite'
import { load } from 'webfontloader'

export default {
  data() {
    let unidades: any = []
    let panel: any[] = []
    let unitInfo: any = []
    let loading: boolean = true
    let newContent = false
    let newTema = {
      descriptionSubject: '',
      titleSubject: '',
      idSubject: 0,
      topic: [],
    }
    let editContent = false
    let currentEditing: any
    return {
      unitInfo,
      panel,
      unidades,
      loading,
      newContent,
      newTema,
      currentEditing,
      editContent,
    }
  },
  methods: {
    async getData() {
      this.loading = true

      console.log('created')
      let id = this.$route.params.id
      console.log(id)
      const db = getFirestore()
      //get only info from contenido with id
      const docRef = doc(db, 'contenido', id.toString())
      const docSnap = await getDoc(docRef)
      this.unitInfo = docSnap.data()
      console.log(this.unitInfo)

      const unitQuery = query(
        collection(db, 'contenido', id.toString(), 'temas'),
        orderBy('idSubject', 'asc'),
        //orderBy('unidad'),
      )
      let index = 0

      //order by id
      let unitContent = await getDocs(unitQuery)
      let temas: any = []

      for(let i = 0; i < unitContent.docs.length; i++){
        let docTemas = unitContent.docs[i]
        let topicQuery = query(
          collection(
            db,
            'contenido',
            id.toString(),
            'temas',
            docTemas.id,
            'topic',
          ),
        )
        let topicContent = await getDocs(topicQuery)
        console.log(topicContent.docs)
        temas.push(docTemas.data())
        temas[index].topic = []
        temas[index].id = docTemas.id

        for(let j = 0; j < topicContent.docs.length; j++){
          let docTopic = topicContent.docs[j]
          temas[index].topic.push(docTopic.data())
          temas[index].topic[temas[index].topic.length - 1].idTopic =
            docTopic.id
        }
        index++
      }
      unitContent.forEach(async (docTemas) => {
        let topicQuery = query(
          collection(
            db,
            'contenido',
            id.toString(),
            'temas',
            docTemas.id,
            'topic',
          ),
          orderBy('idSubject', 'asc'),
        )
        let topicContent = await getDocs(topicQuery)

        temas.push(docTemas.data())
        temas[index].id = docTemas.id
        temas[index].topic = []

        await topicContent.forEach(async (docTopic) => {
          temas[index].topic.push(docTopic.data())
          temas[index].topic[temas[index].topic.length - 1].idTopic =
            docTopic.id
        })
        index++
      })
      console.log(index, '2')
      //order temas by idSubject
      await temas.sort((a: any, b: any) => {
        return a.idSubject - b.idSubject
      })
      this.unidades = temas
      this.loading = false
    },
    closeContent() {
      this.editContent = false
      this.newContent = false
    },
    async saveContent() {
      let toast2 = toast.loading(
        'Actualizando la información, espere un segundo',
        {
          //autoClose: false,
        },
      )

      console.log(this.newTema)
      let id = this.$route.params.id
      let idSubject = this.unidades.length + 1
      const db = getFirestore()

      toast.update(toast2, {
        render: 'Contenido agregado con éxito',
        type: 'success',
        autoClose: 2000,
        isLoading: false,
        closeOnClick: true,
      })
      //reload page
      this.getData()
    },
    async saveEdit() {
      let toast2 = toast.loading(
        'Actualizando la información, espere un segundo',
        {
          //autoClose: false,
        },
      )
      console.log(this.currentEditing)
      let id = this.$route.params.id
      const db = getFirestore()
      toast.update(toast2, {
        render: 'Contenido agregado con éxito',
        type: 'success',
        autoClose: 2000,
        isLoading: false,
        closeOnClick: true,
      })
      //reload page
      this.getData()
    },
    async deleteTopic(id: any) {
      console.log(id)
      let toast2 = toast.loading(
        'Actualizando la información, espere un segundo',
        {
          //autoClose: false,
        },
      )
      console.log(this.currentEditing)
      let idBook = this.$route.params.id
      const db = getFirestore()
      try {
        await deleteDoc(
          doc(
            db,
            'contenido',
            idBook.toString(),
            'temas',
            this.currentEditing.id,
            'topic',
            id,
          ),
        )
        toast.update(toast2, {
          render: 'Imagen eliminada con exito',
          type: 'success',
          autoClose: 2000,
          isLoading: false,
          closeOnClick: true,
        })
        this.currentEditing.topic = this.currentEditing.topic.filter(
          (topic: any) => topic.idTopic != id,
        )

        this.getData()
      } catch (error) {
        toast.update(toast2, {
          render: 'Error al eliminar la imagen',
          type: 'error',
          autoClose: 2000,
          isLoading: false,
          closeOnClick: true,
        })
      }
    },

    async editTopic(tema: any) {
      console.log(tema)
      this.editContent = true
      this.currentEditing = tema
    },
    async addImage() {
      let fileInputElement: any = this.$refs.file
      fileInputElement.click()
    },
    async uploadImage(e: any) {
      const image = e.target.files ? e.target.files[0] : null
      if (image) {
        const formData = new FormData()
        formData.append('file', image)
        formData.append('upload_preset', 'hsvfa23f')
        try {
          axios
            .post('https://api.cloudinary.com/v1_1/dmx1v3oeu/upload', formData)
            .then(async (res: { data: { secure_url: any } }) => {
              console.log(res.data)
              let toast2 = toast.loading(
                'Actualizando la información, espere un segundo',
              )
              let id = this.$route.params.id
              const db = getFirestore()
              this.unidades.forEach((tema: any) => {
                if (tema.id == this.currentEditing.id) {
                  tema.topic.push({
                    urlImageTopic: res.data.secure_url,
                    idTopic: this.currentEditing.topic.length + 1,
                  })
                }
              })
              toast.update(toast2, {
                render: 'Imagen agregada con exito',
                type: 'success',
                autoClose: 2000,
                isLoading: false,
                closeOnClick: true,
              })
              //reload page
              this.getData()
            })
        } catch (error) {
          console.log(error)
        }
      }
    },
  },
  async mounted() {
    await this.getData()
    return
  },
}
</script>
