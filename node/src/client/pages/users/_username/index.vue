<template>
  <v-layout row>
    <v-flex xs12 md8 offset-md2>
      <v-card light color="#E9E9E9">
        <v-card-actions style="background-color: #2DC4E4">
          <v-spacer></v-spacer>
          <v-menu
            :close-on-content-click="false"
            offset-y
            >
            <v-btn flat dark slot="activator">
              <v-icon left>people</v-icon>Friends
            </v-btn>
            <v-card light>
              <inspire-card-person v-for="friend in friends" dont_show_friend :user="friend" :parent_add="addFriend" :parent_remove="removeFriend"></inspire-card-person>
            </v-card>
          </v-menu>
        </v-card-actions>
        <inspire-card-title
          :title="'Profile: ' + fetchedUser.username"
          subheading="<b>Your profile is public.</b><br>Other people can add you as a collaborator and share their clips.">
        </inspire-card-title>
        <inspire-card-person :user="fetchedUser" :dont_show_friend="currentUser" :parent_add="addFriend" :parent_remove="removeFriend"></inspire-card-person>

        <v-slide-y-transition>
          <v-card v-show="openEdit" dark class="ma-3 pa-3">

            <v-text-field
              v-model="firstName"
              label="First Name"
              required
            ></v-text-field>
            <v-text-field
              v-model="lastName"
              label="Last Name"
              required
            ></v-text-field>
            <v-text-field
              v-model="email"
              label="Email"
              required
            ></v-text-field>

            <div style="position: relative;">
              <div style="color: hsla(0, 0%, 100%, .7); font-size: 12px;">Profile Picture</div>
              <div><input type="file" id="file" ref="file" accept="image/*" v-on:change="handleFileUpload()"/></div>
              <div style="position: absolute; right: 0; top: 0;">
                <div style="display: flex;">
                  <v-btn style='flex: 0 0 65%;'
                    :loading="uploadImageLoading"
                    :disabled="uploadImageLoading || !file"
                    @click.native="submitImage()"
                  >
                    Upload
                    <span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>
                  </v-btn>
                  <v-slide-x-transition>
                    <v-list-tile-avatar v-show="imageSrc" style="flex: 1;">
                      <img :src="imageSrc ? imageSrc : '/default.jpg'">
                    </v-list-tile-avatar>
                  </v-slide-x-transition>
                </div>
              </div>
            </div>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat
                :loading="uploadLoading"
                :disabled="uploadLoading || uploadImageLoading"
                @click.native="submitEdit()"
              >
                Submit
                <span slot="loader" class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-slide-y-transition>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="openEdit = !openEdit" v-show="!openEdit && currentUser">edit</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import Dropzone from 'nuxt-dropzone'
import 'nuxt-dropzone/dropzone.css'
import _ from 'lodash'
import axios from '~/plugins/axios'
import Cookies from 'js-cookie'
import inspireCardTitle from '~/components/inspire-card-title.vue'
import inspireCardPerson from '~/components/inspire-card-person.vue'
import Vue from 'vue'
import AsyncComputed from 'vue-async-computed'
Vue.use(AsyncComputed)
export default {
  components: {
    Dropzone, inspireCardTitle, inspireCardPerson
  },
  middleware: 'authenticated',
  data () {
    return {
      openEdit: false,
      firstName: this.$store.state.fetchedUser.firstName,
      lastName: this.$store.state.fetchedUser.lastName,
      email: this.$store.state.fetchedUser.email,
      imageSrc: null,
      file: '',
      friend: true,
      fetchedUser: this.$store.state.fetchedUser,
      uploadLoading: false,
      uploadImageLoading: false,
      currentUser: false
    }
  },
  fetch ({ store, params, req }) {
    const username = params.username
    const token = process.SERVER_BUILD ? req.cookies.token : Cookies.get('token')
    return store.dispatch('fetchedUser/fetchUser', { username, token })
  },
  created: function() {
    //const username = this.$route.params.username
    if (this.$store.state.fetchedUser.username == this.$store.state.user.username) {
      this.currentUser = true
    }
  },
  methods: {
    deleteUser () {
      this.dialog = false
      this.$store.dispatch('user/deleteUser')
        .then(() => {
          this.$router.replace({ path: '/' })
        })
    },
    submitImage (){
      var formData = new FormData();
      formData.append('file', this.file);
      this.uploadImageLoading = true
      var vm = this
      axios.post(`/users/${this.fetchedUser.username}/add-image`, formData)
      .then(function (response) {
        vm.imageSrc = response.data.src
        vm.uploadImageLoading = false
        vm.$store.commit('notification/SUCCESS', response.data)
      }).catch(function(error) {
        vm.uploadImageLoading = false
        vm.$store.commit('notification/FAILURE', error.response.data)
      })
    },
    submitEdit (){
      var formData = new FormData();
      formData.append('file', this.file);
      this.uploadLoading = true
      var vm = this
      var data = {
        firstName: vm.firstName,
        lastName: vm.lastName,
        email: vm.email,
        imageSrc: vm.imageSrc
      }
      console.log('data ' + JSON.stringify(data))
      axios.post(`/users/${this.fetchedUser.username}`, data)
      .then(function (response) {
        vm.$store.commit('notification/SUCCESS', response.data)
        vm.$store.commit('fetchedUser/FETCH_USER_SUCCESS', response.data)
        vm.fetchedUser = response.data.user
        vm.uploadLoading = false
        vm.openEdit = false
      }).catch(function(error) {
        console.log(error)
        vm.$store.commit('notification/FAILURE', error.response.data)
        vm.uploadLoading = false
      })
    },
    addFriend: function() {
      var vm = this
      axios.post(`/users/${vm.fetchedUser.username}/add-friend`, {
        username: vm.$store.state.user.username
      }).then(function (response) {
        vm.$store.commit('notification/SUCCESS', response.data)
      }).catch(function(error) {
        vm.$store.commit('notification/FAILURE', error.response.data)
      })
    },
    removeFriend: function() {
      var vm = this
      axios.post(`/users/${vm.fetchedUser.username}/remove-friend`, {
        username: vm.$store.state.user.username
      }).then(function (response) {
        vm.$store.commit('notification/SUCCESS', response.data)
      }).catch(function(error) {
        vm.$store.commit('notification/FAILURE', error.response.data)
      })
    },
    handleFileUpload(){
      this.file = this.$refs.file.files[0];
    }
  },
  asyncComputed: {
    friends: async function() {
      var arr = []
      for (let str of this.fetchedUser.friends) {
        console.log("getting " + str)
        var response = await axios.get(`/users/${str}`)
        console.log('got ' + JSON.stringify(response.data))
        arr.push(response.data)
      }
      console.log("arr " + JSON.stringify(arr))
      return arr
    }
  }
}
</script>
