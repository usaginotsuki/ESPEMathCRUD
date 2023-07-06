<template>
  <div>
    <VContainer :fluid="true">
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
            <VExpansionPanels v-model="panel" if v-if="loading == false">
              <VExpansionPanel v-for="tema in unidades" :key="tema.id">
                <VExpansionPanelTitle>
                  {{ tema.titleSubject }}
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
            <div v-else>
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
              Editar usuario
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
</template>

<script lang="ts">
import { getAuth } from 'firebase/auth'/*
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'*/
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
} from 'firebase/firestore/lite'

const auth = getAuth()
export default {
  data() {
    let unidades: any = []
    let panel: any
    let unitInfo: any = []
    let loading: boolean = true
    let newContent = false
    let newTema = {
      descriptionSubject: '',
      titleSubject: '',
      idSubject: 0,
      topic: [],
    }
    return {
      unitInfo,
      panel,
      unidades,
      loading,
      newContent,
      newTema,
    }
  },
  methods: {
    closeContent() {
      this.newContent = false
    },
    async saveContent() {
      console.log(this.newTema)
      let id = this.$route.params.id
      let idSubject = this.unidades.length + 1
      const db = getFirestore()
      const res = await addDoc(
        collection(db, 'contenido', id.toString(), 'temas'),
        {
          descriptionSubject: this.newTema.descriptionSubject,
          titleSubject: this.newTema.titleSubject,
          idSubject: idSubject,
        },
      )
      //reload page
      window.location.reload()
    },
  },
  async created() {
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
      orderBy('idSubject'),
      //orderBy('unidad'),
    )
    let index = 0

    //order by id
    let unitContent = await getDocs(unitQuery)
    let temas: any = []

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
        orderBy('idTopic'),
      )
      let topicContent = await getDocs(topicQuery)

      temas.push(docTemas.data())
      temas[index].id = docTemas.id
      temas[index].topic = []

      topicContent.forEach((docTopic) => {
        console.log(docTopic.data())
        temas[index].topic.push(docTopic.data())
      })
      index++
    })
    this.unidades = await temas
    this.loading = false
    console.log('Unidades', this.unidades)
  },
}
</script>
