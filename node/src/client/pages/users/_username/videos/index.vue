<template>
    <v-layout row>
      <v-flex xs12 md10 offset-md2>
        <v-layout row ma-0 >
          <v-select class="pl-4"
            dense
            solo
            :items="items"
            label="Order by"
          ></v-select>
             <v-spacer></v-spacer>
             <v-flex class="text-xs-right" shrink>
        <v-dialog
          v-model="dialog"
          max-width="775px"
          persistent
        >
        <v-btn
          slot="activator"
          flat
        >
          <v-icon left>add</v-icon>Add New
        </v-btn>

          <v-card color="#E9E9E9"
            light>
            <v-stepper v-model="e1">
              <v-stepper-header>
                <v-stepper-step :complete="e1 > 1" step="1">Name of step 1</v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="e1 > 2" step="2">Name of step 2</v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step step="3">Name of step 3</v-stepper-step>
              </v-stepper-header>

              <v-stepper-items>
                <v-stepper-content step="1">
                  <v-card
                    class="mb-5"
                  >

                  <inspire-card-title
                    title="New Video: Upload"
                    subheading="<b>First step: upload all your video clips.</b><br>They'll be ordered by date unless you set them otherwise."
                    plain_style=true>
                  </inspire-card-title>

                  <v-card-text>
                    <dropzone id="foo" ref="el" :options="options" :destroyDropzone="true" v-on:vdropzone-success="fileAdded"></dropzone>
                  </v-card-text>

                </v-card>

                  <!--<v-btn
                    color="primary"
                    @click="e1 = 2"
                  >
                    Continue
                  </v-btn>

                  <v-btn flat>Cancel</v-btn>-->
                  <v-card-actions>
                    <v-btn
                      flat
                      @click="dialog = false"
                    >
                      Cancel
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                      flat
                      :loading="uploadLoading"
                      :disabled="uploadLoading"
                      @click="upload"
                    >
                      Upload
                      <v-icon right dark>cloud_upload</v-icon>
                      <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                      </span>
                    </v-btn>
                  </v-card-actions>
                </v-stepper-content>

                <v-stepper-content step="2">
                  <v-card
                    class="mb-5"
                    color="grey lighten-1"
                    height="200px"
                  ></v-card>

                  <v-btn
                    color="primary"
                    @click="e1 = 3"
                  >
                    Continue
                  </v-btn>

                  <v-btn flat>Cancel</v-btn>
                </v-stepper-content>

                <v-stepper-content step="3">
                  <v-card
                    class="mb-5"
                    color="grey lighten-1"
                    height="200px"
                  ></v-card>

                  <v-btn
                    color="primary"
                    @click="e1 = 1"
                  >
                    Continue
                  </v-btn>

                  <v-btn flat>Cancel</v-btn>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </v-card>
        </v-dialog>
      </v-flex>
    </v-layout>
        <v-expansion-panel popout light>
          <v-expansion-panel-content
            v-for="(item,i) in 5"
            :key="i"
          >
            <div slot="header" class="colfax">
              <span style="height: 42px; line-height: 42px; text-align: center;">Item</span>
              <v-menu style="float: right;"
                :close-on-content-click="false"
                offset-y
                open-on-hover
                top
                >
                 <v-chip
                  slot="activator"
                  color="indigo"
                  dark>
                   <v-avatar>
                     <img src="https://randomuser.me/api/portraits/men/35.jpg" alt="trevor">
                   </v-avatar>
                   Trevor Hansen
                 </v-chip>
                <v-card light v-ripple>
                  <v-list>
                    <v-list-tile>
                      <v-list-tile-content>
                        <v-list-tile-title>Trevor Hansen</v-list-tile-title>
                        <v-list-tile-sub-title>Last seen </v-list-tile-sub-title>
                      </v-list-tile-content>
                      <v-list-tile-action>
                        <v-btn icon>
                          <v-icon color="yellow">star</v-icon>
                        </v-btn>
                      </v-list-tile-action>
                    </v-list-tile>
                  </v-list>
                </v-card>
                </v-menu>
            </div>
            <v-card style="border-radius: 8px">
              <v-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

      </v-flex>
    </v-layout>
</template>

<script>
import Dropzone from 'nuxt-dropzone'
import 'nuxt-dropzone/dropzone.css'
import _ from 'lodash'
import axios from '~/plugins/axios'
import inspireCardTitle from '~/components/inspire-card-title.vue'
//import uploader from '~/plugins/uploader'
import Cookies from 'js-cookie'
//import tippy from 'tippy.js'
export default {
  components: {
    inspireCardTitle,
    Dropzone
  },
  middleware: 'authenticated',
  data () {
    return {
      e1: 0,
      fetchedUser: this.$store.state.fetchedUser,
      dialog: false,
      uploadLoading: false,
      items: ['Foo', 'Bar', 'Fizz', 'Buzz'],
      options: {
        url: "http://localhost:3000",
        acceptedFiles: "video/mp4,video/x-m4v,video/*",
        resizeWidth: 120
      },
      files: []
    }
  },
  mounted() {
    // Everything is mounted and you can access the dropzone instance
    const instance = this.$refs.el.dropzone
  },
  /*mounted: function() {
    tippy('.tippy-tooltip', {
      theme: 'honeybee',
      followCursor: true,
      size: 'large',
      html: '#test'
    })
  },*/
  fetch ({ store, params, req }) {
    const username = params.username
    const token = process.SERVER_BUILD ? req.cookies.token : Cookies.get('token')
    return store.dispatch('fetchedUser/fetchUser', { username, token })
  },
  methods: {
    deleteUser () {
      this.dialog = false
      this.$store.dispatch('user/deleteUser')
        .then(() => {
          this.$router.replace({ path: '/' })
        })
    },
    submitFile(){
      var formData = new FormData();
      formData.append('file', this.file);
      this.uploadLoading = true
      console.log('hm');
      var vm = this
      axios.post(`/videos/upload`, formData)
      .then(function (response) {
        console.log("doneeee")
        vm.$store.commit('notification/SUCCESS', response.data)
        vm.uploadLoading = false
        console.log(JSON.stringify(response.data))
      }).catch(function(error) {
        console.log(error)
        vm.$store.commit('notification/FAILURE', error.response.data)
        vm.uploadLoading = false
      })
    },
    handleFileUpload(){
      this.file = this.$refs.file.files[0];
    },
    fileAdded: function(file, response) {
      console.log('file added!')
      this.files.push(file)
    },
    upload: function() {
      console.log(this.files.length)
      let formData = new FormData();
      for( var i = 0; i < this.files.length; i++ ){
        let file = this.files[i];
        formData.append('files[' + i + ']', file);
      }
      this.uploadLoading = true
      var vm = this
      axios.post(`/videos/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
      })
      .then(function (response) {
        console.log("doneeee")
        vm.$store.commit('notification/SUCCESS', response.data)
        vm.uploadLoading = false
        console.log(JSON.stringify(response.data))
      }).catch(function(error) {
        console.log(error)
        vm.$store.commit('notification/FAILURE', error.response.data)
        vm.uploadLoading = false
      })
    }
  }
}
</script>
