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
              <VRow>
                <VCol md="2">
                  <RouterLink to="/dashboard">
                    <VBtn color="primary">
                      <VIcon>mdi-arrow-left</VIcon>
                      Regresar
                    </VBtn>
                  </RouterLink>
                </VCol>
                <VCol style="margin-right: 25%;">
                  <h1>{{ unitInfo.titleUnitBook }}</h1>
                </VCol>
              </VRow>
            </VCardTitle>
            <VCardText v-if="!editarTitulo">
              <VRow>
                <VCol md="10">
                  <h3>{{ unitInfo.descriptionUnitBook }}</h3>
                </VCol>
                <VCol md="2">
                  <VBtn
                    color="primary"
                    @click="editarTitulo = true"
                    style="margin-top: 2%;"
                  >
                    Editar
                  </VBtn>
                </VCol>
              </VRow>
            </VCardText>
            <VCardText v-if="editarTitulo">
              <VRow>
                <VCol md="10">
                  <VTextarea v-model="editTituloText" required></VTextarea>
                </VCol>
                <VCol>
                  <VRow>
                    <VCol>
                      <VBtn
                        color="primary"
                        @click="cambiarTitulo()"
                        style="margin-top: 2%;"
                      >
                        Guardar
                      </VBtn>
                    </VCol>
                  </VRow>
                  <VRow>
                    <VCol>
                      <VBtn
                        color="red"
                        @click="cancelarCambiarTitulo()"
                        style="margin-top: 2%;"
                      >
                        Cancelar
                      </VBtn>
                    </VCol>
                  </VRow>
                </VCol>
              </VRow>
            </VCardText>
            <center v-if="unidades.length > 0">
              <VCard color="primary">
                <VCardTitle
                  style="
                    color: white;
                    height: 3.125rem;
                    align-items: center;
                    display: flex;
                  "
                  color="primary"
                  class="text-left justify center"
                >
                  Contenido
                </VCardTitle>
              </VCard>
            </center>
            <VExpansionPanels v-if="unidades.length > 0">
              <VExpansionPanel v-for="(tema, index) in unidades" :key="tema.id">
                <VExpansionPanelTitle>
                  <VRow>
                    <VCol>{{ index + 1 }} - {{ tema.titleSubject }}</VCol>
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
                    <center>
                      <VImg width="60%" :src="topic.urlImageTopic"></VImg>
                    </center>
                  </div>
                </VExpansionPanelText>
              </VExpansionPanel>
            </VExpansionPanels>
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
            <br />
            <br />
            <center v-if="unidades.length > 0">
              <VCard color="primary">
                <VCardTitle
                  style="
                    color: white;
                    height: 3.125rem;
                    align-items: center;
                    display: flex;
                  "
                  color="primary"
                  class="text-left justify center"
                >
                  Preguntas
                </VCardTitle>
              </VCard>
            </center>
            <VExpansionPanels multiple v-if="unidades.length > 0">
              <VExpansionPanel
                v-for="(pregunta, index) in questions"
                :key="pregunta.id"
              >
                <VExpansionPanelTitle>
                  <VRow>
                    <VCol>{{ index + 1 }} - {{ pregunta.nameQuestion }}</VCol>
                    <VCol md="2" class="text-right">
                      <VBtn @click="editQuestion(pregunta)">
                        Editar
                      </VBtn>
                    </VCol>
                  </VRow>
                </VExpansionPanelTitle>
                <VExpansionPanelText>
                  <p>
                    {{ pregunta.titleQuestion }}
                  </p>
                  <br />
                  <VRow v-if="pregunta.urlImage">
                    <VCol>
                      <VImg :src="pregunta.urlImage"></VImg>
                    </VCol>
                  </VRow>
                  <VRow v-if="pregunta.urlVideo">
                    <VCol>
                      <VPlayer :src="pregunta.urlVideo"></VPlayer>
                    </VCol>
                  </VRow>
                  <VRow>
                    <VCol>
                      <VCardTitle>Respuestas correctas</VCardTitle>
                    </VCol>
                  </VRow>
                  <VRow
                    v-if="
                      pregunta.idQuestion == '(1)interval' ||
                      pregunta.idQuestion == '(2)interval'
                    "
                  >
                    <VCol>
                      <VSelect
                        readonly
                        :items="closedOpenLeft"
                        item-title="name"
                        item-value="value"
                        v-model="pregunta.option[0].answerOption"
                      ></VSelect>
                    </VCol>
                    <VCol>
                      <VTextField
                        readonly
                        type="number"
                        v-model="pregunta.option[2].answerOption"
                      ></VTextField>
                    </VCol>
                    <VCol>
                      <VTextField
                        readonly
                        type="number"
                        v-model="pregunta.option[3].answerOption"
                      ></VTextField>
                    </VCol>
                    <VCol>
                      <VSelect
                        readonly
                        :items="closedOpenRight"
                        item-title="name"
                        item-value="value"
                        v-model="pregunta.option[1].answerOption"
                      ></VSelect>
                    </VCol>
                  </VRow>
                  <VRow v-else>
                    <VCol
                      v-for="respuesta in pregunta.option"
                      :key="respuesta.id"
                    >
                      <VTextField
                        readonly
                        v-model="respuesta.answerOption"
                      ></VTextField>
                    </VCol>
                  </VRow>
                  <VRow>
                    <VCol>
                      <VCardTitle>Retroalimentación</VCardTitle>
                    </VCol>
                  </VRow>
                  <VRow>
                    <VCol>
                      <p>{{ pregunta.feedBackQuestion }}</p>
                    </VCol>
                  </VRow>
                </VExpansionPanelText>
              </VExpansionPanel>
              <br />
              <span style="padding-top: 5%; padding-bottom: 5%;">
                <VBtn
                  elevation="outlined"
                  color="green"
                  @click="newQuestion = true"
                >
                  Agregar nueva pregunta
                </VBtn>
              </span>
              <br />
              <br />
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
    <VDialog v-model="newContent" persistent width="1000">
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
            <VCol>
              <VTextField
                v-model="newTema.titleSubject"
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
                v-model="newTema.descriptionSubject"
                required
              ></VTextarea>
            </VCol>
          </VRow>
        </VCardText>
        <VCardText class="d-flex justify-center">
          <VBtn variant="elevated" class="me-3" @click="createNewContent()">
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
    <VDialog v-model="editContent" persistent width="1000">
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
          <VDivider></VDivider>
          <br />
          <center>
            <VRow v-for="topic in currentEditing.topic" :key="topic.id">
              <VCol md="10" style="text-align: right;">
                <center>
                  <VImg :src="topic.urlImageTopic" style="width: 70%;"></VImg>
                </center>
              </VCol>
              <VCol style="margin-top: 20%; text-align: left;">
                <VBtn color="red" @click="deleteTopic(topic.idTopic)">
                  <VIcon>mdi-delete</VIcon>
                </VBtn>
              </VCol>
              <br />
              <VDivider></VDivider>
            </VRow>
          </center>
          <br />
          <VBtn color="primary" width="100%" @click="addImageTopic()">
            Agregar imagen
          </VBtn>
          <br />
        </VCardText>
        <br />

        <VCardActions>
          <VRow>
            <VCol cols="2">
              <VBtn variant="elevated" color="red" @click="deleteContent()">
                Eliminar
                <VIcon>mdi-delete</VIcon>
              </VBtn>
            </VCol>

            <VCol offset="6" style="margin-right: 0px; padding-right: 0px;">
              <VBtn
                variant="elevated"
                color="success"
                class="me-3"
                @click="saveEdit()"
              >
                Guardar
                <VIcon>mdi-content-save</VIcon>
              </VBtn>

              <VBtn
                variant="elevated"
                color="red"
                class="me-3"
                @click="closeContent()"
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
      ref="file"
      v-show="false"
      accept=".jpg, .jpeg, .png"
      state="Boolean(file)"
      label="Añadir anexos..."
      @change="uploadImageContent"
    ></VFileInput>
  </div>
  <div class="text-xs-center">
    <VDialog v-model="editQuestionModal" persistent width="1000">
      <VCard>
        <center>
          <VCard color="primary">
            <VCardTitle style="color: white;" color="primary" class="headline">
              Editar pregunta
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
                v-model="currentEditing.titleQuestion"
                label="Titulo"
                required
              ></VTextField>
            </VCol>
          </VRow>
          <VRow v-if="currentEditing.urlImage">
            <VCol md="10" style="text-align: right;">
              <center>
                <VImg :src="currentEditing.urlImage" style="width: 70%;"></VImg>
              </center>
            </VCol>
            <VCol style="margin-top: 10%; text-align: left;">
              <VBtn color="red" @click="deleteImageQuestion(currentEditing.id)">
                <VIcon>mdi-delete</VIcon>
              </VBtn>
            </VCol>
          </VRow>
          <VBtn
            v-if="!currentEditing.urlImage"
            color="primary"
            width="100%"
            @click="addImageQuestion()"
          >
            Agregar imagen
          </VBtn>
          <VCardTitle style="padding-top: 5%;"><b>Respuestas:</b></VCardTitle>
          <VRow
            v-if="
              currentEditing.idQuestion == '(1)interval' ||
              currentEditing.idQuestion == '(2)interval'
            "
          >
            <VCol>
              <VSelect
                :items="closedOpenLeft"
                item-title="name"
                item-value="value"
                v-model="currentEditing.option[0].answerOption"
              ></VSelect>
            </VCol>
            <VCol>
              <VTextField
                type="number"
                v-model="currentEditing.option[2].answerOption"
              ></VTextField>
            </VCol>
            <VCol>
              <VTextField
                type="number"
                v-model="currentEditing.option[3].answerOption"
              ></VTextField>
            </VCol>
            <VCol>
              <VSelect
                :items="closedOpenRight"
                item-title="name"
                item-value="value"
                v-model="currentEditing.option[1].answerOption"
              ></VSelect>
            </VCol>
          </VRow>
          <VRow v-else>
            <VCol
              v-for="respuesta in currentEditing.option"
              :key="respuesta.id"
            >
              <VTextField v-model="respuesta.answerOption"></VTextField>
            </VCol>
          </VRow>
          <VRow>
            <VCol md="3">
              <VCardTitle><b>Retroalimentación:</b></VCardTitle>
            </VCol>
            <VCol>
              <VTextarea
                v-model="currentEditing.feedBackQuestion"
                label="Titulo"
                required
              ></VTextarea>
            </VCol>
          </VRow>

          <br />
        </VCardText>
        <VCardActions>
          <VRow>
            <VCol cols="2">
              <VBtn variant="elevated" color="red" @click="closeContent">
                Eliminar
                <VIcon>mdi-delete</VIcon>
              </VBtn>
            </VCol>

            <VCol offset="6" style="margin-right: 0px; padding-right: 0px;">
              <VBtn
                variant="elevated"
                color="success"
                class="me-3"
                @click="saveEditQuestion"
              >
                Guardar
                <VIcon>mdi-content-save</VIcon>
              </VBtn>

              <VBtn
                variant="elevated"
                color="red"
                class="me-3"
                @click="closeContent()"
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
      ref="fileQuestion"
      v-show="false"
      accept=".jpg, .jpeg, .png"
      state="Boolean(file)"
      label="Añadir anexos..."
      @change="uploadImageQuestion"
    ></VFileInput>
  </div>
  <div class="text-xs-center">
    <VDialog v-model="newQuestion" persistent width="1000">
      <VCard>
        <center>
          <VCard color="primary">
            <VCardTitle style="color: white;" color="primary" class="headline">
              Editar pregunta
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
                v-model="currentEditing.titleQuestion"
                label="Titulo"
                required
              ></VTextField>
            </VCol>
          </VRow>
          <VRow v-if="currentEditing.urlImage">
            <VCol md="10" style="text-align: right;">
              <center>
                <VImg :src="currentEditing.urlImage" style="width: 70%;"></VImg>
              </center>
            </VCol>
            <VCol style="margin-top: 10%; text-align: left;">
              <VBtn color="red" @click="deleteImageQuestion(currentEditing.id)">
                <VIcon>mdi-delete</VIcon>
              </VBtn>
            </VCol>
          </VRow>
          <VBtn
            v-if="!currentEditing.urlImage"
            color="primary"
            width="100%"
            @click="addImageQuestion()"
          >
            Agregar imagen
          </VBtn>
          <VCardTitle style="padding-top: 5%;"><b>Respuestas:</b></VCardTitle>
          <VRow
            v-if="
              currentEditing.idQuestion == '(1)interval' ||
              currentEditing.idQuestion == '(2)interval'
            "
          >
            <VCol>
              <VSelect
                :items="closedOpenLeft"
                item-title="name"
                item-value="value"
                v-model="currentEditing.option[0].answerOption"
              ></VSelect>
            </VCol>
            <VCol>
              <VTextField
                type="number"
                v-model="currentEditing.option[2].answerOption"
              ></VTextField>
            </VCol>
            <VCol>
              <VTextField
                type="number"
                v-model="currentEditing.option[3].answerOption"
              ></VTextField>
            </VCol>
            <VCol>
              <VSelect
                :items="closedOpenRight"
                item-title="name"
                item-value="value"
                v-model="currentEditing.option[1].answerOption"
              ></VSelect>
            </VCol>
          </VRow>
          <VRow v-else>
            <VCol
              v-for="respuesta in currentEditing.option"
              :key="respuesta.id"
            >
              <VTextField v-model="respuesta.answerOption"></VTextField>
            </VCol>
          </VRow>
          <VRow>
            <VCol md="3">
              <VCardTitle><b>Retroalimentación:</b></VCardTitle>
            </VCol>
            <VCol>
              <VTextarea
                v-model="currentEditing.feedBackQuestion"
                label="Titulo"
                required
              ></VTextarea>
            </VCol>
          </VRow>

          <br />
        </VCardText>
        <VCardActions>
          <VRow>
            <VCol cols="2">
              <VBtn variant="elevated" color="red" @click="closeContent">
                Eliminar
                <VIcon>mdi-delete</VIcon>
              </VBtn>
            </VCol>

            <VCol offset="6" style="margin-right: 0px; padding-right: 0px;">
              <VBtn
                variant="elevated"
                color="success"
                class="me-3"
                @click="saveEditQuestion"
              >
                Guardar
                <VIcon>mdi-content-save</VIcon>
              </VBtn>

              <VBtn
                variant="elevated"
                color="red"
                class="me-3"
                @click="closeContent()"
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
      ref="fileQuestion"
      v-show="false"
      accept=".jpg, .jpeg, .png"
      state="Boolean(file)"
      label="Añadir anexos..."
      @change="uploadImageQuestion"
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
  updateDoc,
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
    let editQuestionModal = false
    let currentEditing: any
    let questions: any = []
    let tiposPreguntas: any = [
      {
        name: 'Intervalo 1',
        value: '(1)interval',
      },
      {
        name: 'Intervalo 2',
        value: '(2)interval',
      },
      {
        name: 'Dominio y rango',
        value: 'domran',
      },
      {
        name: 'Diagrama de Venn',
        value: 'venn',
      },
      {
        name: 'Trivia',
        value: 'trivia',
      },
    ]
    let newQuestion = false
    let editarTitulo = false
    let editTituloText: any = ''
    let closedOpenLeft = [
      { name: '[', value: 'closedAngle' },
      { name: '(', value: 'openAngle' },
    ]
    let closedOpenRight = [
      { name: ']', value: 'closedAngle' },
      { name: ')', value: 'openAngle' },
    ]
    return {
      unitInfo,
      panel,
      unidades,
      loading,
      newContent,
      newTema,
      currentEditing,
      editContent,
      questions,
      tiposPreguntas,
      editQuestionModal,
      newQuestion,
      editarTitulo,
      editTituloText,
      closedOpenLeft,
      closedOpenRight,
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
      const questionQuery = query(
        collection(db, 'contenido', id.toString(), 'preguntas'),
        orderBy('idQuestion', 'asc'),
        //orderBy('unidad'),
      )
      let index = 0

      //order by id
      let unitContent = await getDocs(unitQuery)
      let temas: any = []
      let questionContent = await getDocs(questionQuery)
      let questions: any = []

      for (let i = 0; i < unitContent.docs.length; i++) {
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
        temas.push(docTemas.data())
        temas[index].topic = []
        temas[index].id = docTemas.id

        for (let j = 0; j < topicContent.docs.length; j++) {
          let docTopic = topicContent.docs[j]
          temas[index].topic.push(docTopic.data())
          temas[index].topic[temas[index].topic.length - 1].idTopic =
            docTopic.id
        }
        index++
      }

      index = 0
      for (let i = 0; i < questionContent.docs.length; i++) {
        let docQuestions = questionContent.docs[i]
        let QuestionQuery = query(
          collection(
            db,
            'contenido',
            id.toString(),
            'preguntas',
            docQuestions.id,
            'option',
          ),
          orderBy('idOption', 'asc'),
        )
        let optionContent = await getDocs(QuestionQuery)
        questions.push(docQuestions.data())
        questions[index].option = []
        questions[index].id = docQuestions.id
        //urlImageOrVideoQuestion="[image]https://res.cloudinary.com/dsuh0d4g5/image/upload/v1687971456/DocIDImage/a74c5f28-346b-4b78-bd6d-0be80bcdad07_dov2at.jpg"
        //get if image or video
        if (questions[index].urlImageOrVideoQuestion) {
          if (questions[index].urlImageOrVideoQuestion.includes('[image]')) {
            let url = questions[index].urlImageOrVideoQuestion.split(']')[1]
            questions[index].urlImage = url
          }
          if (questions[index].urlImageOrVideoQuestion.includes('[video]')) {
            let url = questions[index].urlImageOrVideoQuestion.split(']')[1]
            questions[index].urlVideo = url
          }
        }

        for (let j = 0; j < optionContent.docs.length; j++) {
          let docOption = optionContent.docs[j]
          questions[index].option.push(docOption.data())
          //search titleQuestion in tiposPreguntas and add value as name
          this.tiposPreguntas.forEach((tipo: any) => {
            if (tipo.value == questions[index].idQuestion) {
              questions[index].nameQuestion = tipo.name
            }
          })

          questions[index].option[questions[index].option.length - 1].id =
            docOption.id
        }

        index++
      }
      this.editTituloText = this.unitInfo.descriptionUnitBook
      console.log('Questions: ', questions)

      //order temas by idSubject
      await temas.sort((a: any, b: any) => {
        return a.idSubject - b.idSubject
      })
      this.questions = questions
      this.unidades = temas
      this.loading = false
      console.log(this.unidades)
    },
    closeContent() {
      this.editContent = false
      this.newContent = false
      this.editQuestionModal = false
    },
    async createNewContent() {
      let toast2 = toast.loading('Agregando el nuevo contenido', {
        //autoClose: false,
      })

      console.log(this.newTema)
      let id = this.$route.params.id
      //search last idSubject in unidades and add 1, idSubject are not incremental
      let idSubject = 1
      try {
        let idSubject = this.unidades[this.unidades.length - 1].idSubject + 1
      } catch (error) {
        let idSubject = 1
      }
      const db = getFirestore()

      try {
        let docId = await addDoc(
          collection(db, 'contenido', id.toString(), 'temas'),
          {
            descriptionSubject: this.newTema.descriptionSubject,
            idSubject: idSubject,
            titleSubject: this.newTema.titleSubject,
          },
        )
        console.log(docId.id)
        this.unidades.push({
          descriptionSubject: this.newTema.descriptionSubject,
          idSubject: idSubject,
          titleSubject: this.newTema.titleSubject,
          topic: [],
          id: docId.id,
        })
        toast.update(toast2, {
          render: 'Contenido agregado con éxito',
          type: 'success',
          autoClose: 2000,
          isLoading: false,
          closeOnClick: true,
        })
        this.newContent = false
        this.newTema = {
          descriptionSubject: '',
          titleSubject: '',
          idSubject: 0,
          topic: [],
        }
        //reload page
      } catch (error) {
        console.log('ERROR AL SUBIR')
        toast.error('Hubo un error, intentalo mas tarde')
        console.log(error)
      }
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
      try {
        await updateDoc(
          doc(db, 'contenido', id.toString(), 'temas', this.currentEditing.id),
          {
            descriptionSubject: this.currentEditing.descriptionSubject,
            idSubject: this.currentEditing.idSubject,
            titleSubject: this.currentEditing.titleSubject,
          },
        )
        toast.update(toast2, {
          render: 'Contenido agregado con éxito',
          type: 'success',
          autoClose: 2000,
          isLoading: false,
          closeOnClick: true,
        })
        let index = this.unidades.findIndex(
          (tema: any) => tema.id == this.currentEditing.id,
        )
        this.unidades[index] = this.currentEditing
        //reload page
        this.getData()
        this.closeContent()
      } catch (error) {
        console.log('ERROR AL SUBIR')
        toast.error('Error al subir la imagen')
      }
    },
    async saveEditQuestion() {
      let toast2 = toast.loading(
        'Actualizando la información, espere un segundo',
        {
          //autoClose: false,
        },
      )
      console.log(this.currentEditing)
      let id = this.$route.params.id
      const db = getFirestore()
      try {
        await updateDoc(
          doc(
            db,
            'contenido',
            id.toString(),
            'preguntas',
            this.currentEditing.id,
          ),
          {
            titleQuestion: this.currentEditing.titleQuestion,
            feedBackQuestion: this.currentEditing.feedBackQuestion,
          },
        )
        for (let i = 0; i < this.currentEditing.option.length; i++) {
          await updateDoc(
            doc(
              db,
              'contenido',
              id.toString(),
              'preguntas',
              this.currentEditing.id,
              'option',
              this.currentEditing.option[i].id,
            ),
            {
              answerOption: this.currentEditing.option[i].answerOption,
            },
          )
        }
        toast.update(toast2, {
          render: 'Contenido agregado con éxito',
          type: 'success',
          autoClose: 2000,
          isLoading: false,
          closeOnClick: true,
        })
        let index = this.questions.findIndex(
          (pregunta: any) => pregunta.id == this.currentEditing.id,
        )
        this.questions[index] = this.currentEditing
        //reload page
        this.getData()
        this.closeContent()
      } catch (error) {
        console.log('ERROR AL SUBIR')
        toast.error('Error al subir la imagen')
      }
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
        console.log('BORRAR IMAGEN')
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
        this.currentEditing.topic = this.currentEditing.topic.filter(
          (topic: any) => topic.idTopic != id,
        )
        //search id in unidades and delete topic
        let index = this.unidades.findIndex(
          (tema: any) => tema.id == this.currentEditing.id,
        )
        this.unidades[index].topic = this.unidades[index].topic.filter(
          (topic: any) => topic.idTopic != id,
        )
        console.log(this.unidades)

        toast.update(toast2, {
          render: 'Imagen eliminada con exito',
          type: 'success',
          autoClose: 2000,
          isLoading: false,
          closeOnClick: true,
        })
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
      this.currentEditing = Object.assign({}, tema)
    },
    editQuestion(pregunta: any) {
      console.log(pregunta)
      this.currentEditing = Object.assign({}, pregunta)
      this.editQuestionModal = true
    },
    async addImageTopic() {
      let fileInputElement: any = this.$refs.file
      fileInputElement.click()
    },
    async uploadImageContent(e: any) {
      const image = e.target.files ? e.target.files[0] : null
      if (image) {
        console.log('AÑADIR IMAGEN')
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
              try {
                let docId = await addDoc(
                  collection(
                    db,
                    'contenido',
                    id.toString(),
                    'temas',
                    this.currentEditing.id,
                    'topic',
                  ),
                  {
                    urlImageTopic: res.data.secure_url,
                    idTopic: this.currentEditing.topic.length + 1,
                  },
                )
                console.log(docId.id)
                toast.update(toast2, {
                  render: 'Imagen agregada con exito',
                  type: 'success',
                  autoClose: 2000,
                  isLoading: false,
                  closeOnClick: true,
                })
                //search id in unidades and add topic
                let index = this.unidades.findIndex(
                  (tema: any) => tema.id == this.currentEditing.id,
                )
                this.unidades[index].topic.push({
                  urlImageTopic: res.data.secure_url,
                  idTopic: docId.id,
                })
                console.log(this.unidades)
              } catch (error) {
                console.log('ERROR AL SUBIR')
                console.log(error)
                toast.error('Error al subir la imagen')
              }
            })
        } catch (error) {
          console.log('ERROR AL SUBIR')
          toast.error('Error al subir la imagen')
        }
      }
    },
    async deleteImageQuestion(id: any) {
      //delete only urlImageorVideoQuestion from preguntas/id
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
        console.log('BORRAR IMAGEN')
        await updateDoc(
          doc(
            db,
            'contenido',
            idBook.toString(),
            'preguntas',
            this.currentEditing.id,
          ),
          {
            urlImageOrVideoQuestion: '',
          },
        )
        this.currentEditing.urlImage = ''
        toast.update(toast2, {
          render: 'Imagen eliminada con exito',
          type: 'success',
          autoClose: 2000,
          isLoading: false,
          closeOnClick: true,
        })
        let index = this.questions.findIndex(
          (pregunta: any) => pregunta.id == this.currentEditing.id,
        )
        this.questions[index].urlImage = ''
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
    async addImageQuestion() {
      let fileInputElement: any = this.$refs.fileQuestion
      fileInputElement.click()
    },
    async uploadImageQuestion(e: any) {
      const image = e.target.files ? e.target.files[0] : null
      if (image) {
        console.log('AÑADIR IMAGEN')
        const formData = new FormData()
        formData.append('file', image)
        formData.append('upload_preset', 'hsvfa23f')

        await axios
          .post('https://api.cloudinary.com/v1_1/dmx1v3oeu/upload', formData)
          .then(async (res: any) => {
            console.log(res.data)
            let toast2 = toast.loading(
              'Actualizando la información, espere un segundo',
            )
            let id = this.$route.params.id
            const db = getFirestore()
            console.log('ADD')
            try {
              await updateDoc(
                doc(
                  db,
                  'contenido',
                  id.toString(),
                  'preguntas',
                  this.currentEditing.id,
                ),
                {
                  urlImageOrVideoQuestion: '[image]' + res.data.secure_url,
                },
              )
              toast.update(toast2, {
                render: 'Imagen agregada con exito',
                type: 'success',
                autoClose: 2000,
                isLoading: false,
                closeOnClick: true,
              })
              let index = this.questions.findIndex(
                (pregunta: any) => pregunta.id == this.currentEditing.id,
              )
              this.questions[index].urlImage = res.data.secure_url
              this.currentEditing.urlImage = res.data.secure_url
            } catch (error) {
              console.log('ERROR AL SUBIR')
              console.log(error)
              toast.error('Error al subir la imagen')
            }
          })
      }
    },
    async cambiarTitulo() {
      let toast2 = toast.loading(
        'Actualizando la información, espere un segundo',
      )
      let id = this.$route.params.id
      const db = getFirestore()
      try {
        await updateDoc(doc(db, 'contenido', id.toString()), {
          descriptionUnitBook: this.editTituloText,
        })
        toast.update(toast2, {
          render: 'Titulo actualizado con exito',
          type: 'success',
          autoClose: 2000,
          isLoading: false,
          closeOnClick: true,
        })
        this.editarTitulo = false
        this.unitInfo.descriptionUnitBook = this.editTituloText
      } catch (error) {
        console.log('ERROR AL SUBIR')
        toast.error('Error al actualizar el titulo')
      }
    },
    cancelarCambiarTitulo() {
      this.editarTitulo = false
      this.editTituloText = this.unitInfo.descriptionUnitBook
    },
    async deleteContent() {
      let toast2 = toast.loading(
        'Actualizando la información, espere un segundo',
      )
      let id = this.$route.params.id
      const db = getFirestore()
      let contentID = this.currentEditing.id
      try {
        await deleteDoc(doc(db, 'contenido', id.toString(), 'temas', contentID))
        toast.update(toast2, {
          render: 'Contenido eliminado con exito',
          type: 'success',
          autoClose: 2000,
          isLoading: false,
          closeOnClick: true,
        })
        let index = this.unidades.findIndex(
          (tema: any) => tema.id == this.currentEditing.id,
        )
        this.unidades.splice(index, 1)
        this.closeContent()
      } catch (error) {
        console.log('ERROR AL SUBIR')
        toast.error('Error al eliminar el contenido')
      }
    },
  },
  async mounted() {
    await this.getData()
    return
  },
}
</script>
