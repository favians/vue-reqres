<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="6">
        <v-card class="mx-auto" max-width="400">
          <v-img
            class="white--text align-end"
            height="200px"
            :src="data.avatar"
          >
            <v-card-title class="ml-1">
              {{ data.first_name }} {{ data.last_name }}
            </v-card-title>
          </v-img>

          <v-card-subtitle class="pb-0">
            {{ data.email }}
          </v-card-subtitle>

          <v-card-text class="text--primary">
            <br />
            <div>
              Hello my name <b>{{ data.first_name }} {{ data.last_name }}</b>
            </div>
            <div>ID : {{ data.id }}</div>
          </v-card-text>

          <v-card-actions>
            <v-select
              v-model="userIDFilter"
              style="width: 30px"
              :items="listUser"
              color="pink"
              label="Pilih Usernya"
              required
              @input="getAllData"
            ></v-select>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="6" class="mt-12">
        <h3>Json Data</h3>
        <json-viewer :value="data"></json-viewer>
      </v-col>
      <v-col cols="6" class="mt-5" >
        <v-card class="mx-auto pa-5" max-width="100%">
          <h3>HTML Element Code</h3>
          </br>
          <p>< img :src="data.avatar" ></p>
          <p>< h3 > {  data.first_name + " " + data.last_name } </ h3 ></p>
          <p>< h5 > {  data.email } </ h5 ></p>
          <p>< p > Hello my name < b > { data.first_name + " " + data.last_name } </ b >  < p ></p>
          <p>< p > ID: { data.id  } < p ></p>
</v-card>
        </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import User from '@@/business/user/user'
import Meta from '@@/business/type/meta'
// @ts-ignore
import JsonViewer from 'vue-json-viewer'
// @ts-ignore
import HtmlPreview from 'vue-html-viewer';

import { userStore } from '@/store'

@Component({
  components: {
    JsonViewer,
    HtmlPreview,
  },
})
export default class Partner extends Vue {
  // store here

  // util

  // static Data

  // page data
  valid: boolean = false
  dialog: boolean = false
  isInsert: boolean = false

  userSpec: User = {
    id: '',
    email: '',
    first_name: '',
    last_name: '',
    avatar: '',
  }

  data: Array<User> = []
  meta: Meta = {
    page: 1,
    row_per_page: 10,
    next_page: false,
    previous_page: false,
  }

  userIDFilter: string = '1'

  listUser: Array<string> = ['1', '2', '3', '4', '5']

  // Lifecycle
  created() {
    this.getAllData(this.meta.page, this.meta.row_per_page)
  }

  // Custom Methods
  async getAllData(page: number, rowPerPage: number) {
    this.$Loading({ show: true })

    const userID = this.userIDFilter

    await userStore
      .GetAlluser({
        page,
        rowPerPage,
        userID,
      })
      .then((user) => {
        console.log(user)
        this.data = user
      })
      .catch(() => {
        this.$Snackbar({ message: 'error', color: 'red' })
      })

    this.$Loading({ show: false })
  }

  async doRequest() {
    const validationOK = (
      this.$refs.form as Vue & {
        validate: () => boolean
      }
    ).validate()

    if (validationOK) {
      let result: Promise<any>
      if (this.isInsert) {
        result = userStore.InsertUser({ user: this.userSpec })
      } else {
        result = userStore.UpdateUser({ user: this.userSpec })
      }

      await result
        .then(() => {
          this.resetForm()
          this.getAllData(this.meta.page, this.meta.row_per_page)
          this.$Snackbar({ message: 'Success', color: 'green' })
          this.dialog = false
        })
        .catch(() => {
          this.$Snackbar({ message: 'error', color: 'red' })
        })

      this.$Loading({ show: false })
    }
  }

  applyFilter() {
    this.getAllData(this.meta.page, this.meta.row_per_page)
  }

  setInsert() {
    this.resetForm()
    this.isInsert = true
  }

  setUpdate(item: User) {
    this.userSpec = { ...item }
    this.isInsert = false
  }

  resetForm() {
    ;(
      this.$refs.form as Vue & {
        reset(): () => boolean
      }
    ).reset()
  }
}
</script>
