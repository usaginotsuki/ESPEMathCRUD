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
            <VCardTitle style="padding-top: 5%; padding-bottom: 5%;">
              <h1>{{ unitInfo.titleUnitBook }}</h1>
            </VCardTitle>
            <VCardText>
              {{ unitInfo.descriptionUnitBook }}
            </VCardText>
            <VExpansionPanels v-model="panel">
              <VExpansionPanel v-for="tema in unidades" :key="tema.id">
                <VExpansionPanelTitle>
                  {{ tema.titleSubject }}
                </VExpansionPanelTitle>
                <VExpansionPanelText>
                  {{ tema.descriptionSubject }}
                </VExpansionPanelText>
              </VExpansionPanel>
            </VExpansionPanels>
          </VCard>
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>

<script lang="ts">
import { getAuth } from 'firebase/auth'
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  where,
  doc,
  query,
  orderBy,
} from 'firebase/firestore/lite'

const auth = getAuth()
export default {
  data() {
    let unidades: any = []
    let panel: any
    let unitInfo: any = []
    return {
      unitInfo,
      panel,
      unidades,
    }
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

    //order by id
    let unitContent = await getDocs(unitQuery)
    let temas: any = []
    unitContent.forEach((docTemas) => {
      temas.push(docTemas.data())
      //push content into new array into unidades named temas
      //this.unidades[index].push(docTemas.data())
    })
    this.unidades = temas
    console.log(temas)
  },
}
</script>
