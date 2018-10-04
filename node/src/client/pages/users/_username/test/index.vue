<template>
  <v-layout row>
    <v-flex xs12 md8 offset-md2>
      <v-card light color="#E9E9E9">

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
                src="/default.jpg"
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
                        <v-list-tile-sub-title>Last edited 2017-09-08</v-list-tile-sub-title>
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
                          xs2
                          d-flex
                          v-for="(image, index) in person.images">
                          <v-hover>
                            <div
                              slot-scope="{ hover }">
                              <v-img style="border-radius: 50%;"
                                src="/default.jpg"
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
                        <v-btn fab flat dark color="#FF35E9" small>
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
      people: [
        {
          name: 'bob',
          surname: '1',
          images: [
            {
              src: '/default.png',
              active: false
            },
            {
              src: '/default.png',
              active: false
            },
            {
              src: '/default.png',
              active: false
            },
            {
              src: '/default.png',
              active: false
            },
            {
              src: '/default.png',
              active: false
            },
            {
              src: '/default.png',
              active: false
            },
            {
              src: '/default.png',
              active: false
            },
            {
              src: '/default.png',
              active: false
            }
          ]
        },
        {
          name: 'susan',
          surname: '2',
          images: [
            {
              src: '/default.png',
              active: false
            },
            {
              src: '/default.png',
              active: false
            },
            {
              src: '/default.png',
              active: false
            },
            {
              src: '/default.png',
              active: false
            },
            {
              src: '/default.png',
              active: false
            },
            {
              src: '/default.png',
              active: false
            },
            {
              src: '/default.png',
              active: false
            },
            {
              src: '/default.png',
              active: false
            }
          ]
        }
      ]
    }
  },
  methods: {
      mouseOver: function(image) {
        image.active = true
      },
      mouseOff: function(image) {
        image.active = false
      }
  }
}
</script>
