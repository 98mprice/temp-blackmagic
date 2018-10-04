<template>
  <v-layout row>
    <v-flex xs12 md8 offset-md2>
      <v-card light color="#E9E9E9">
        <v-card-actions style="background-color: #2DC4E4">
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialog"
            width="500"
            persistent
          >
            <v-btn slot="activator" @click="mode = 'new'" flat dark>
              <v-icon left>add</v-icon>Add New
            </v-btn>

            <v-card light class="pt-1">
              <v-card dark v-if="upload" class="ml-5 mr-5 mt-5">
                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0">File</h3>
                    <div><input type="file" id="file" ref="file" accept="image/*" v-on:change="handleFileUpload()"/></div>
                  </div>
                </v-card-title>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn flat
                    :loading="uploadLoading"
                    :disabled="uploadLoading || !file"
                    @click.native="submitFile()"
                  >
                    Submit
                    <span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>
                  </v-btn>
                </v-card-actions>
              </v-card>
              <!--<div v-if="upload" class="pa-5">
                <label>File
                  <input type="file" id="file" ref="file" accept="image/*" v-on:change="handleFileUpload()"/>
                </label>
                  <v-btn
                    :loading="uploadLoading"
                    :disabled="uploadLoading"
                    @click.native="submitFile()"
                  >
                    Submit
                    <span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>
                  </v-btn>
              </div>-->
              <v-container v-show="webcam == false && upload == false"
                fill-height style="position: absolute; z-index: 100; height: 80%;">
                <v-layout row wrap align-center>
                  <v-flex class="text-xs-center">
                    <div><v-btn large @click="startWebcam" color="rgba(255, 255, 255, 0.5)">Take Picture</v-btn></div>
                    <div><v-btn large @click="startUpload" color="rgba(255, 255, 255, 0.5)">Upload Picture</v-btn></div>
                  </v-flex>
                </v-layout>
              </v-container>
              <div class="pa-4">
                <div v-show="webcam == true">
                  <div style="position: relative;">
                    <video width="100%" ref="video" id="video" autoplay></video>
                    <div style="position: absolute; right: 0; bottom: 0;" class="ma-4">
                      <v-btn @click="capture" color="primary" fab dark>
                        <v-icon>camera</v-icon>
                      </v-btn>
                    </div>
                  </div>
                  <!--<div>
                    <v-btn id="snap" v-on:click="capture()">Take Photo</v-btn>
                  </div>-->
                  <canvas style="display: none;" ref="canvas" id="canvas" width="160" height="120"></canvas>
                </div>
                <v-img v-show="webcam == false && upload == false" style="border-radius: 50%; width: 80%; display: block; margin-left: auto; margin-right: auto;"
                  :src="selectedPersonSrc"
                  aspect-ratio="1"
                  class="grey lighten-2"
                >
                </v-img>
                <v-alert class="mt-3"
                  :value="true"
                  type="info"
                  color="primary"
                >
                  Make sure you have a clear &amp; direct shot of the face
                </v-alert>
                <v-text-field class="mt-3" v-show="mode == 'new'"
                  :counter="20"
                  label="Name"
                  v-model="selectedPersonName"
                  ref="name"
                  style="z-index: 2"
                ></v-text-field>
              </div>

              <v-divider></v-divider>

              <v-card-actions>
                <v-btn flat @click="closeDialog">Cancel</v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  :loading="saveLoading"
                  :disabled="saveLoading || !(requirementsMet)"
                  flat
                  @click.native="save"
                >
                  Save
                  <span slot="loader" class="custom-loader">
                    <v-icon light>cached</v-icon>
                  </span>
                </v-btn>

                <!--<v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  flat
                  @click="closeWebcam"
                >
                  I accept
                </v-btn>-->
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-actions>

        <inspire-card-title
          title="Housekeeping: People"
          subheading="<b>The AI looks for faces in all video clips submitted so it knows who's who.</b><br>The people below are all people registered to your account.">
        </inspire-card-title>

        <v-container grid-list-sm fluid>
          <v-layout row wrap>
            <v-flex
              v-for="person in people"
              xs4 sm4 md3 lg2
              d-flex
            >
            <v-menu
                :min-width="300"
                :close-on-content-click="false"
                :nudge-width="200"
                offset-x
                absolute
              >
              <v-img style="border-radius: 50%;"
                :src="person.images[0]"
                aspect-ratio="1"
                class="grey lighten-2 ma-1"
                slot="activator"
              >
                <v-layout
                  slot="placeholder"
                  fill-height
                  align-center
                  justify-center
                  ma-0
                >
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-layout>
              </v-img>

                <v-card light>
                  <v-list>
                    <v-list-tile>
                      <v-list-tile-content>
                        <v-list-tile-title>{{person.name}}</v-list-tile-title>
                        <v-list-tile-sub-title>Last edited {{getFormattedDate(person.updatedAt)}}</v-list-tile-sub-title>
                      </v-list-tile-content>
                      <!--<v-list-tile-action>
                        <v-btn icon>
                          <v-icon color="red" @click="deletePerson(person)">delete</v-icon>
                        </v-btn>
                      </v-list-tile-action>-->
                    </v-list-tile>
                  </v-list>
                  <div>
                    <v-container grid-list-sm fluid class="ma-0 pa-0">
                      <v-layout row wrap>
                        <v-flex
                          @click="editPerson(person, index)"
                          xs2
                          d-flex
                          v-for="(image, index) in person.images">
                          <v-hover>
                            <div
                              slot-scope="{ hover }">
                              <v-img style="border-radius: 50%;"
                                :src="image"
                                aspect-ratio="1"
                                class="grey lighten-2 ma-1"
                                slot="activator"
                              >
                                <v-layout
                                  slot="placeholder"
                                  fill-height
                                  align-center
                                  justify-center
                                  ma-0
                                >
                                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                </v-layout>
                                <v-expand-transition>
                                  <div
                                    v-if="hover"
                                    class="d-flex transition-fast-in-fast-out v-card--reveal display-3"
                                    style="height: 100%;"
                                  >
                                    <v-icon color="white">edit</v-icon>
                                  </div>
                                </v-expand-transition>
                              </v-img>
                            </div>
                          </v-hover>
                        </v-flex>
                        <v-btn fab flat dark color="#FF35E9" small class="pa-0 ml-0">
                          <v-icon dark>add</v-icon>
                        </v-btn>
                      </v-layout>
                    </v-container>
                  </div>
                </v-card>
              </v-menu>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import _ from 'lodash'
import axios from '~/plugins/axios'
import inspireCardTitle from '~/components/inspire-card-title.vue'
export default {
  components: { inspireCardTitle },
  data () {
    return {
      fav: true,
      message: false,
      hints: true,
      user: this.$store.state.user,
      dialog: false,
      people: null,
      video: {},
      canvas: {},
      newImage: null,
      newName: null,
      localstream: null,
      webcam: false,
      selectedPerson: null,
      saveLoading: false,
      file: '',
      upload: false,
      formData: null,
      uploadLoading: false,
      newImageSrc: null,
      selectedImageIndex: 0,
      mode: 'new'
    }
  },
  async mounted() {
    this.refreshPeople()
  },
  computed: {
    selectedPersonSrc: function() {
      if (this.newImageSrc) {
        return this.newImageSrc
      } else if (this.newImage) {
        return 'data:image/png;base64,' + this.newImage
      } else if (this.selectedPerson) {
        return this.selectedPerson.images[this.selectedImageIndex]
      } else {
        return "/placeholder.png"
      }
    },
    selectedPersonName: {
      get: function () {
        //var currentText = this.$refs.name.value
        if (this.selectedPerson && this.selectedPerson.name != null) {
          var name = this.selectedPerson.name
          this.selectedPerson.name = null
          return name
        } else if (this.newName) {
          return this.newName
        } else {
          return null
        }
      },
      // setter
      set: function (newValue) {
        this.newName = newValue
      }
    },
    requirementsMet: function() {
      if ((this.selectedPerson && this.newName)
        || (this.selectedPerson && this.newImage)
        || (this.selectedPerson && this.newImageSrc))  return true
      else if (this.newImage && this.newName)       return true
      else if (this.newImageSrc && this.newName)    return true
      else                                          return false
    }
  },
  methods: {
    mouseOver: function(){
        this.active = !this.active;
    },
    startUpload: function() {
      this.webcam = false
      this.upload = true
    },
    submitFile(){
      this.formData = new FormData();
      this.formData.append('file', this.file);
      this.uploadLoading = true
      console.log('hm');
      var vm = this
      axios.post(`/people/upload/${this.user.username}`, this.formData)
      .then(function (response) {
        console.log("doneeee")
        vm.newImageSrc = response.data.src
        vm.$store.commit('notification/SUCCESS', response.data)
        vm.uploadLoading = false
        vm.upload = false
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
    refreshPeople: async function() {
      //console.log("searching for people with username " + JSON.stringify(this.$store.state.user) + " ...")
      let peopleRes = await axios.get(`/people/${this.user.username}`)
      if (!peopleRes) error({ statusCode: 404, message: 'people not found' })
      //console.log("FOUND THESE PEOPLE " + JSON.stringify(peopleRes))
      this.people = peopleRes.data
    },
    save: function() {
      this.saveLoading = true
      var vm = this;
      if (this.selectedPerson) {
        axios.post(`/people/${this.user.username}/${this.selectedPerson._id}`, {
          image_path: this.newImageSrc,
          image_blob: this.newImage,
          name: this.newName
        }).then(function (response) {
          console.log("done")
          vm.saveLoading = false
          vm.refreshPeople()
          vm.closeDialog()
        }).catch(function(error) {
          vm.$store.commit('notification/FAILURE', error.response.data)
          vm.saveLoading = false
        })
      } else {
        //this.capture()
        axios.post(`/people/${this.user.username}`, {
          image_path: this.newImageSrc,
          image_blob: this.newImage,
          name: this.newName
        }).then(function (response) {
          console.log("done")
          vm.saveLoading = false
          //vm.closeWebcam()
          vm.refreshPeople()
          vm.closeDialog()
        }).catch(function(error) {
          vm.$store.commit('notification/FAILURE', error.response.data)
          vm.saveLoading = false
        })
      }
    },
    deletePerson: function(person) {
      var vm = this
      axios.delete(`/people/${this.user.username}/${person._id}`)
      .then(function (response) {
        vm.$store.commit('notification/SUCCESS', response.data)
        vm.refreshPeople()
      }).catch(function(error) {
        vm.$store.commit('notification/FAILURE', error.response.data)
      })
    },
    editPerson: function(person, index) {
      this.menu = false
      this.selectedPerson = _.clone(person)
      this.selectedImageIndex = index
      this.mode = 'edit'
      this.dialog = true
    },
    getFormattedDate(str) {
      var date = new Date(str);
      return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    },
    startWebcam: function() {
      this.video = this.$refs.video;
      var vm = this
      navigator.getMedia = ( navigator.getUserMedia || // use the proper vendor prefix
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);
      navigator.getMedia({video: true}, function() {
        // webcam is available
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
                vm.localstream = stream
                vm.video.src = window.URL.createObjectURL(stream);
                vm.video.play();
                vm.webcam = true
            });
        }
      }, function() {
        // webcam is not available
        vm.$store.commit('notification/FAILURE', {
          message: 'Can\'t find your webcam'
        })
      });
    },
    closeWebcam: function(callback) {
      //this.dialog = false;
      var vm = this
      console.log('callback ' + callback)
      setTimeout(function() {
        if (vm.video.src) {
          vm.video.pause()
          vm.video.src = "";
        }
        if (vm.localstream) {
          vm.localstream.getTracks()[0].stop();
        }
        vm.webcam = false
        //vm.newName = null
        //vm.newImage = null
        console.log("closed 1")
        callback()
      }, 500);
    },
    closeDialog: function() {
      this.dialog = false;
      if (this.webcam == true) {
        var vm = this
        this.closeWebcam(function() {
          vm.newName = null
          vm.newImage = null
          vm.selectedPerson = null
          vm.upload = false
          vm.newImageSrc = null
        })
      } else {
        this.newName = null
        this.newImage = null
        this.selectedPerson = null
        this.upload = false
        this.newImageSrc = null
      }
    },
    addPerson: async function() {
      var vm = this;
      var blob = await this.loadXHR("/test.jpg")
      this.blobToBase64(blob, async function(base64){ // encode
        //var blob = {'blob': base64};
        console.log(base64)
        /*let peopleRes = await axios.post(`/people/${vm.user.username}`, {
          image_blob: base64,
          name: 'susan'
        })*/
        console.log("done")
      });
    },
    blobToBase64: function(blob, cb) {
      var reader = new FileReader();
      reader.onload = function() {
        var dataUrl = reader.result;
        var base64 = dataUrl.split(',')[1];
        cb(base64);
      };
      reader.readAsDataURL(blob);
    },
    loadXHR: function(url) {
        return new Promise(function(resolve, reject) {
            try {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url);
                xhr.responseType = "blob";
                xhr.onerror = function() {reject("Network error.")};
                xhr.onload = function() {
                    if (xhr.status === 200) {resolve(xhr.response)}
                    else {reject("Loading error:" + xhr.statusText)}
                };
                xhr.send();
            }
            catch(err) {reject(err.message)}
        });
    },
    capture: function() {
        var vm = this
        this.canvas = this.$refs.canvas;
        var context = this.canvas.getContext("2d").drawImage(this.video, 0, 0, 160, 120);
        var dataUrl = canvas.toDataURL("image/png");
        this.closeWebcam(function() {
          console.log("closed 2")
          vm.newImage = dataUrl.replace(/^data:image\/(png|jpg);base64,/, "");
          //console.log(vm.newImage)
        })

        //this.dialog = false
    }
  }
}
</script>
