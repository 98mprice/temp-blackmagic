<template>
  <v-flex xs12 style="position: relative;">
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
      <v-layout column align-content-center class="horiz-scroll pl-3" style="height: 80%">
        <v-layout row>
          <inspire-card-timeline
            colour="transparent"
            :width=100
            text="<i>Video<br>Footage</i>"
            no_hover
            no_buttons
            >
          </inspire-card-timeline>
          <draggable v-model="clips.a_roll" style="display: inherit;">
            <v-flex
              v-for="(clip, index) in clips.a_roll"
              :key="index"
              px-1
              pb-2
            >
              <inspire-card-timeline
                :parent_remove="remove"
                :parent_add_empty="add_empty"
                :parent_duplicate="duplicate"
                :colour="calculateClipColour(clip)"
                :index="index"
                :width="secondsToWidth(clip.length)"
                :clip_type="clip.type"
                type="a_roll"
                :text="'<b>' + clip.name + '</b></br>' + secondsToString(clip.length)"
                >
              </inspire-card-timeline>
            </v-flex>
          </draggable>
        </v-layout>
        <v-layout row>
          <inspire-card-timeline
            colour="transparent"
            :width=100
            text="<i>Music</i>"
            no_hover
            no_buttons
            >
          </inspire-card-timeline>
          <draggable v-model="clips.music" style="display: inherit;">
            <v-flex
              v-for="(music, index) in clips.music"
              :key="index"
              px-1
              pb-2
            >
              <inspire-card-timeline
                colour="#35FF57"
                :parent_remove="remove"
                :parent_add_empty="add_empty"
                :parent_duplicate="duplicate"
                :index="index"
                :width="secondsToWidth(music.length)"
                :clip_type="music.type"
                type="music"
                no_hover
                :text="'<b>' + music.name + '</b></br>'  + secondsToString(music.length)"
                >
              </inspire-card-timeline>
              <!--<div class="pos-relative">
                <v-card class="resize-drag pa-3 colfax" light flat color="#35FF57" :data-id="index" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" :width="secondsToWidth(clip.length)">
                  <b>{{clip.name}}</b>
                </v-card>
              </div>-->
            </v-flex>
          </draggable>
        </v-layout>
        <v-layout column>
          <v-layout row v-for="name in unique_names">
            <inspire-card-timeline
              colour="transparent"
              :width=100
              :text="'<i>' + name + '</i>'"
              no_hover
              no_buttons
              no_padding
              >
            </inspire-card-timeline>
            <div
              v-for="(transcript, index) in transcript_row(name)"
              :key="index">
                <v-card v-ripple
                  light
                  flat
                  :style="'white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #000000; background-color: ' + ((transcript.text) ? '#FFEF4B' : 'transparent') + '; border-radius: 50px !important;'"
                  :width="secondsToWidth(transcript.length)"
                  >
                  <div style="width: 100%;" class="pt-2 pb-2 pl-3">
                    {{transcript.text}}
                  </div>
                </v-card>
              </div>


          </v-layout>
        </v-layout>
      </v-layout>
<!--<v-card color="transparent" class="one"> CONTENT OVER VIDEO
    <video class="video-background" no-controls autoplay src="http://clips.vorwaerts-gmbh.de/VfE_html5.mp4" poster="http://thumb.multicastmedia.com/thumbs/aid/w/h/t1351705158/1571585.jpg"></video>
</v-card>-->

    </div>
  </v-flex>
</template>

<script>
import _ from 'lodash'
import axios from '~/plugins/axios'
import $ from 'jquery'
import draggable from 'vuedraggable'
import inspireCardTimeline from '~/components/inspire-card-timeline.vue'
export default {
  components: { inspireCardTimeline, draggable },
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
                text: "hi guys",
                start: 0,
                length: 50
              },
              {
                name: "john",
                text: "hi guys",
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
                text: "hi guys",
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
                text: "hi guys",
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
      }
    }
  },
  head: {
    script: [
        /*{
          src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js'
        },*/
        {
          src: 'https://cdn.jsdelivr.net/npm/interactjs@1.3.4/dist/interact.min.js'
        }/*,
        {
          src: 'https://rawgit.com/moment/moment/2.2.1/min/moment.min.js'
        }*/
      ]/*,
    link: [
      { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/jquery.splitter@0.27.1/css/jquery.splitter.css' }
    ]*/
   },
  mounted: function() {
    this.init()
  },
  methods: {
    init() {
      var vm = this

      vm.scaleToFill();

    $('.video-background').on('loadeddata', vm.scaleToFill);

    $(window).resize(function() {
        vm.scaleToFill();
    });

      interact('.resize-drag')
        .resizable({
          // resize from all edges and corners
          edges: { left: true, right: true, bottom: false, top: false },
          // keep the edges inside the parent
          restrictEdges: {
            outer: 'parent',
            endOnly: true,
          },
          // minimum size
          restrictSize: {
            min: { width: 100 },
          },
          inertia: true
        })
        .on('resizemove', function (event) {
          var target = event.target,
              x = (parseFloat(target.getAttribute('data-x')) || 0),
              y = (parseFloat(target.getAttribute('data-y')) || 0);
          // update the element's style
          //target.style.width  = event.rect.width + 'px';
          // translate when resizing from top or left edges
          if (event.deltaRect.left > 0) {
            //resizing from left
          } else {

          }
          /*let result = vm.clips.a_roll.filter(obj => {
            return obj.id === target.getAttribute('data-id')
          })*/
          try {
            var result = vm.clips[target.getAttribute('data-type')][target.getAttribute('data-id')]
            if (event.deltaRect.left > 0) {
              //resizing from left
              result.length = vm.widthToSeconds(event.rect.width)
            } else {
              result.length = vm.widthToSeconds(event.rect.width)
            }
          } catch (err) {

          }
          /*x += event.deltaRect.left;
          target.style.webkitTransform = target.style.transform =
              'translate(' + x + 'px,' + y + 'px)';*/
          //target.setAttribute('data-x', x);
          //target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);
        });
      this.$store.commit('SET_TITLE', "Play")
      this.$store.commit('SET_SHOW_TOOLBAR', false)
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
    widthToSeconds: function(width) {
      return width/(this.window_width/(this.timeline_max_seconds))
    },
    calculateClipColour: function(clip) {
      if (clip.type == "b") return "#FF35E9"
      else return "#35DCFF"
    },
    scaleToFill: function() {
      $('video.video-background').each(function(index, videoTag) {
         var $video = $(videoTag),
             videoRatio = videoTag.videoWidth / videoTag.videoHeight,
             tagRatio = $video.width() / $video.height(),
             val;

         if (videoRatio < tagRatio) {
             val = tagRatio / videoRatio * 1.02;
         } else if (tagRatio < videoRatio) {
             val = videoRatio / tagRatio * 1.02;
         }

         $video.css('transform','scale(' + val  + ',' + val + ')');

      });
    },
    duplicate: function(index, type) {
      this.clips[type].splice(index + 1, 0, _.clone(this.clips[type][index]));
    },
    remove: function(index, type) {
      this.clips[type].splice(index, 1);
    },
    add_empty: function(index, type, direction) {
      this.clips[type].splice(index + direction, 0, {
        name: "",
        type:"blank",
        start: 0,
        length: 100,
        transcript: [

        ]
      });
    },
    transcript_row: function(name) {
      console.log("here")
      var arr = []
      var buf = []
      for (let clip of this.clips.a_roll) {
        if (clip.type == "blank") {
          var temp_length = 0;
          var temp_text = '';
          for (let buf_data of buf) {
            temp_length += buf_data.length
            temp_text += buf_data.text + " "
          }
          arr.push({
            length: temp_length,
            text: temp_text
          })
          buf = []
          var empty_transcript = {
            length: clip.length
          }
          arr.push(empty_transcript)
        }
        var name_found = false
        for (let data of clip.transcript) {
          if (data.name == name) {
            name_found = true
            if (data.start != 0) {
              var empty_transcript = {
                length: data.start
              }
              arr.push(empty_transcript)
            }
            var length = data.length
            var text = ""
            if ((length + data.start) >= clip.length) {
              length = clip.length
              text = data.text
              var new_data = {
                length: length,
                text: text
              }
              buf.push(new_data)
            } else {
              for (let buf_data of buf) {
                length += buf_data.length
                text += buf_data.text + " "
              }
              text += data.text
              var new_data = {
                length: length,
                text: text
              }
              arr.push(new_data)
              var dist = clip.length - data.length - data.start
              if (dist > 0) {
                var empty_transcript = {
                  length: dist
                }
                arr.push(empty_transcript)
              }
              buf = []
            }
          }
        }
        if (name_found == false) {
          var temp_length = 0;
          var temp_text = '';
          for (let buf_data of buf) {
            temp_length += buf_data.length
            temp_text += buf_data.text + " "
          }
          arr.push({
            length: temp_length,
            text: temp_text
          })
          buf = []
          var empty_transcript = {
            length: clip.length
          }
          arr.push(empty_transcript)
        }
      }
      console.log('arr ' + JSON.stringify(arr))
      return arr
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
    },
    unique_names: function() {
      var arr = []
      for (let clip of this.clips.a_roll) {
        for (let data of clip.transcript) {
          if (!arr.includes(data.name)) arr.push(data.name)
        }
      }
      return arr
    }
  }
  /*abcdefghijklmnopqreyuvqyz
  abcdefghijjklmnopqrstuvqxyz
  abcdefghijklmnopqrstyvwxyz
  abcdefghijklmnopqrstyvwxyz*/
}
</script>
