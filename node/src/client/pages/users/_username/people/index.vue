<template>
  <v-layout row>
    <v-flex xs12 md8 offset-md2>
      <v-card light color="#E9E9E9" style="border-radius: 8px;">
        <v-card-actions style="background-color: #2DC4E4">
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialog"
            width="500"
            persistent
          >
            <v-btn slot="activator" flat dark>
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
                <v-text-field class="mt-3"
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


          <v-card-title primary-title style="background-color: #2DC4E4" class="pl-5">
            <div>
              <h3 class="mb-0 inspire_title">Housekeeping: People</h3>
                <div class="inspire_subheading"><b>The AI looks for faces in all video clips submitted so it knows who's who.</b><br>The people below are all people registered to your account.</div>
            </div>
          </v-card-title>


        <svg style="transform: translate(0px, -10px);" width="100%" viewBox="0 0 722 58" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <!-- Generator: Sketch 43.1 (39012) - http://www.bohemiancoding.com/sketch -->
            <desc>Created with Sketch.</desc>
            <defs></defs>
            <g id="Welcome" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Desktop-HD" transform="translate(-359.000000, -360.000000)" stroke-width="10" stroke="#2DC4E4" fill="#2DC4E4">
                    <g id="Simple_wave_pattern" transform="translate(364.000000, 365.000000)">
                        <g id="y">
                            <g id="x">
                                <path d="M2.2253811,0.923589489 C0.565234192,0.923589489 0.443327094,1.48156025 1.93918052,2.19570775 C1.93918052,2.19570775 26.9810921,13 42.8651231,33 C58.7491541,53 74.8478342,53 91.1611633,33 C107.474492,13 123.573173,13 139.457204,33 C155.341235,53 171.439915,53 187.753244,33 C204.066573,13 220.165253,13 236.049284,33 C251.933315,53 268.031995,53 284.345324,33 C300.658654,13 316.757334,13 332.641365,33 C348.525396,53 364.624076,53 380.937405,33 C397.250734,13 413.349414,13 429.233445,33 C445.117476,53 461.216156,53 477.529485,33 C493.842815,13 509.941495,13 525.825526,33 C541.709557,53 557.808237,53 574.121566,33 C590.434895,13 606.533575,13 622.417606,33 C638.301637,53 654.400317,53 670.713646,33 C687.026976,13 711.606549,1.3591892 711.606549,1.3591892 C712.094615,1.11861412 712.035601,0.923589489 711.494639,0.923589489 L2.2253811,0.923589489 Z" id="w"></path>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>

        <v-container grid-list-sm fluid>
          <v-layout row wrap>
            <v-flex
              v-for="person in people"
              xs4 sm4 md3 lg2
              d-flex
            >
            <v-menu
                :close-on-content-click="false"
                :nudge-width="200"
                offset-x
                absolute
              >
              <v-img style="border-radius: 50%;"
                :src="person.image_path"
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
                      <v-list-tile-action>
                        <v-btn icon>
                          <v-icon color="red" @click="deletePerson(person)">delete</v-icon>
                        </v-btn>
                      </v-list-tile-action>
                    </v-list-tile>
                  </v-list>
                  <v-card-actions>
                    <v-btn flat @click="menu = false">Cancel</v-btn>
                    <v-btn color="primary" flat @click="editPerson(person)">Edit</v-btn>
                  </v-card-actions>
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
import axios from '~/plugins/axios'
export default {
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
      newImageSrc: null
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
        return this.selectedPerson.image_path
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
    editPerson: function(person) {
      this.menu = false
      this.selectedPerson = person
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
