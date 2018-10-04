<template>
  <v-flex xs12 style="position: relative; background-color: #EEEEEE">
      <div id="foo">
         <div id="a">
            <div id="x">
              <v-card color="grey lighten-3 pt-3" flat height="100%" style="border-radius: 0px !important;">
                <div v-for="(clip, index) in clips.a_roll" class="ml-3 mt-2">
                  <div class="colfax black--text">
                    <b style="text-transform: uppercase;">{{clip.name}}</b>: {{secondsToString(clip.length)}}
                  </div>
                  <div v-for="data in clip.transcript">
                    <v-chip color="#FFEF4B" class="mt-0 mb-2 ml-0 mr-0 pa-0" @click="scrollTimeline(leadingSeconds(index))">
                      <v-avatar>
                        <img src="https://randomuser.me/api/portraits/men/35.jpg" alt="trevor">
                      </v-avatar>
                      {{data.text}}
                    </v-chip>
                  </div>
                </div>
                <div style="height: 500px; width: 100%; background-color: #EEEEEE;"></div>
              </v-card>
            </div>
            <div id="y">
              <v-card color="grey darken-4" flat height="100%" style="border-radius: 0px !important;" id="create">
                <v-layout column>
                <v-toolbar flat dark color="black">
                  <v-spacer></v-spacer>
                    <v-tooltip bottom>
                      <v-btn slot="activator" icon>
                        <v-icon>save</v-icon>
                      </v-btn>
                      <span>Save</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <v-btn slot="activator" icon>
                        <v-icon>cloud_upload</v-icon>
                      </v-btn>
                      <span>Recompile</span>
                    </v-tooltip>
                  </v-toolbar>
                  <div style="background-color: #000000; height: 250px"></div>
                </v-layout>
              </v-card>
            </div>

         </div><!-- #a -->
         <div id="b" style="z-index: 1000;">
           <div style="height: 100%; background-color: #2DC4E4;">
             <v-slide-y-transition>
               <div v-show="show_timeline">
                 <v-layout row>
                   <v-flex xs2 offset-xs10>
                     <v-slider class="mt-2 mr-3" light
                     v-model="timeline_max_minutes"
                     color="black"
                     thumb-label
                     step="1"
                     min="1"
                     max="10"
                     ticks
                   ></v-slider>
                   </v-flex>
                   <v-btn flat icon color="black" class="mr-3">
                     <v-icon>keyboard_arrow_down</v-icon>
                   </v-btn>
                 </v-layout>
                 <inspire-timeline :clips="clips" :timeline_max_minutes="timeline_max_minutes"></inspire-timeline>
               </div>
             </v-slide-y-transition>
             <v-fade-transition>
               <div v-show="show_mini_timeline" style="height: 100%;">
                 <inspire-mini-timeline :clips="clips"></inspire-mini-timeline>
               </div>
             </v-fade-transition>
           </div>
         </div>
       </div>
<!--
    <v-layout row wrap style="height: 100%">
      <v-flex
        xs12
        sm12
        md6
      >
        <v-card color="grey lighten-3" flat height="100%" style="border-radius: 0px !important;">
          <v-toolbar flat color="transparent" light>
            <v-btn icon>
              <v-icon>arrow_back</v-icon>
            </v-btn>
            <v-toolbar-title>Title</v-toolbar-title>
          </v-toolbar>
        </v-card>
      </v-flex>
      <v-flex
        xs12
        sm12
        md6
      >
        <v-card color="transparent" flat height="100%" id="create">
          <v-layout column>
          <v-toolbar flat dark color="black">
            <v-spacer></v-spacer>
              <v-tooltip bottom>
                <v-btn slot="activator" icon>
                  <v-icon>save</v-icon>
                </v-btn>
                <span>Save</span>
              </v-tooltip>
              <v-tooltip bottom>
                <v-btn slot="activator" icon>
                  <v-icon>cloud_upload</v-icon>
                </v-btn>
                <span>Recompile</span>
              </v-tooltip>
            </v-toolbar>
            <div style="background-color: #000000; height: 250px"></div>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    <div style="height:50%; width:100%; background-color: #2DC4E4; position: absolute; z-index: 100; display:block; top: 50%;">
      <v-layout row>
        <v-flex xs2 offset-xs10>
          <v-slider class="mt-2 mr-3" light
          v-model="timeline_max_minutes"
          color="black"
          thumb-label
          step="1"
          min="1"
          max="10"
          ticks
        ></v-slider>
      </v-flex>
      <v-btn flat icon color="black" class="mr-3">
        <v-icon>keyboard_arrow_down</v-icon>
      </v-btn>
    </v-layout>
      <inspire-timeline :clips="clips" :timeline_max_minutes="timeline_max_minutes"></inspire-timeline>

    </div>
  -->
  </v-flex>
</template>

<script>
import _ from 'lodash'
import axios from '~/plugins/axios'
import inspireTimeline from '~/components/video_editor/inspire-timeline.vue'
import inspireMiniTimeline from '~/components/video_editor/inspire-mini-timeline.vue'
export default {
  components: { inspireTimeline, inspireMiniTimeline },
  middleware: 'authenticated',
  data () {
    return {
      timeline_max_minutes: 5,
      clips: {
        a_roll: [
          {
            name: "video 1",
            start: 10,
            length: 100,
            type: "a",
            transcript: [
              {
                name: "matt",
                text: "No capitalization. The text renders as it is. This is default",
                start: 0,
                length: 50
              },
              {
                name: "john",
                text: "Transforms the first character of each word to uppercase",
                start: 10,
                length: 30
              }
            ]
          },
          {
            name: "video 2",
            start: 10,
            length: 150,
            type: "a",
            transcript: [
              {
                name: "matt",
                text: "full 2",
                start: 0,
                length: 140
              }
            ]
          },
          {
            name: "video 3",
            start: 0,
            length: 43,
            type: "b",
            transcript: [
              {
                name: "matt",
                text: "unfull 3",
                start: 0,
                length: 20
              },
              {
                name: "john",
                text: "Transforms all characters to uppercase",
                start: 0,
                length: 30
              }
            ]
          },
          {
            name: "video 4",
            start: 10,
            length: 110,
            type: "b",
            transcript: [
              {
                name: "matt",
                text: "hi guys",
                start: 0,
                length: 50
              }
            ]
          },
          {
            name: "video 5",
            start: 10,
            length: 143,
            type: "a",
            transcript: [
              {
                name: "matt",
                text: "I want to get the height of a div in order to make the height of another div matching it. I used the method clientHeight, but It doesn't return me the good value (smaller value). Actually, It seems to return a height before all elements are charged. After some research online, I tried to put a window.load() to delay until everything is charged but it doesn't work as well. Some ideas ?",
                start: 0,
                length: 50
              }
            ]
          }
        ],
        music: [
          {
            name: "",
            type:"blank",
            start: 10,
            length: 100
          },
          {
            name: "song 1",
            start: 10,
            length: 110
          },
          {
            name: "",
            type:"blank",
            start: 10,
            length: 10
          },
          {
            name: "song 2",
            start: 10,
            length: 210
          },
          {
            name: "",
            type:"blank",
            start: 10,
            length: 100
          },
          {
            name: "song 3",
            start: 10,
            length: 40
          }
        ]
      },
      show_timeline: true,
      show_mini_timeline: false
    }
  },
  head: {
    script: [
        {
          src: 'jquery.min.js'
        },
        {
          src: 'https://cdn.jsdelivr.net/npm/jquery.splitter@0.27.1/js/jquery.splitter.min.js'
        }
      ],
    link: [
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/jquery.splitter@0.27.1/css/jquery.splitter.css'
      }
    ]
  },
  mounted: function() {
    this.init()
  },
  methods: {
    init() {
      this.$store.commit('SET_TITLE', "Play")
      this.$store.commit('SET_SHOW_TOOLBAR', false)
      console.log('sadsa' + this.window_width)
      var window_width = this.window_width
      var vm = this
       var splitter = $('#foo').split({
           orientation: 'horizontal',
           percent: true,
           limit: 50,
           onDrag: function(event) {
             var perc = splitter.position()/$(document).height()
             if (perc > 0.8) {
               vm.show_timeline = false
               setTimeout(function(){
                 vm.show_mini_timeline = true
               }, 500);
             } else {
               vm.show_mini_timeline = false
               vm.show_timeline = true
             }
           }
       });
       $('#a').split({
           orientation: 'vertical',
           percent: true
       });
       $(document).ready(function(){
          $("#foo").css("height", $(document).height() + "px");
          $("#a").css("height", $(document).height() + "px");
       });
    },
    secondsToString: function(d) {
      d = Number(d);
      var h = Math.floor(d / 3600);
      var m = Math.floor(d % 3600 / 60);
      var s = Math.floor(d % 3600 % 60);

      var hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hrs, ") : "";
      var mDisplay = m > 0 ? m + (m == 1 ? " min, " : " mins, ") : "";
      var sDisplay = s > 0 ? s + (s == 1 ? " sec" : " secs") : "";
      return hDisplay + mDisplay + sDisplay;
    },
    secondsToWidth: function(seconds) {
      try {
        return (this.window_width/(this.timeline_max_seconds))*seconds;
      } catch(er) {
        return 400
      }
    },
    leadingSeconds: function(index) {
      var seconds = 0
      for (var i = 0; i < index; i++) {
        var clip = this.clips.a_roll[i]
        seconds += clip.length
      }
      return seconds
    },
    scrollTimeline: function(seconds) {
      this.animatethis($('.horiz-scroll'), 1000, this.secondsToWidth(seconds));
    },
    animatethis: function(targetElement, speed, seconds) {
        $(targetElement).animate({ scrollLeft: seconds }, {
            duration: speed
        });
    }
  },
  computed: {
    timeline_max_seconds: function() {
      return this.timeline_max_minutes*60
    },
    window_width: function() {
      try {
        return $(window).width()
      } catch (err) {
        return 1280
      }
    }
  }
}
</script>
