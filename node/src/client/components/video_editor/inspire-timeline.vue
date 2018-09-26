<template>
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
        </v-flex>
      </draggable>
    </v-layout>
    <v-layout column>
      <v-layout row v-for="name in unique_names" class="mb-2">
        <inspire-card-timeline
          colour="transparent"
          :width=100
          :text="'<i class=\'name\'>' + name + '</i>'"
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
</template>

<script>
import $ from 'jquery'
import draggable from 'vuedraggable'
import inspireCardTimeline from '~/components/inspire-card-timeline.vue'
export default {
  props: ['timeline_max_minutes', 'clips'],
  components: { inspireCardTimeline, draggable },
  middleware: 'authenticated',
  data () {
    return {

    }
  },
  head: {
    script: [
      {
        src: 'https://cdn.jsdelivr.net/npm/interactjs@1.3.4/dist/interact.min.js'
      }
    ]
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
}
</script>
