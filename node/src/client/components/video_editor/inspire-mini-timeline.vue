<template>
  <v-layout column align-content-center class="horiz-scroll pl-3 " style="height: 100%; position: relative;">
    <div :style="'height: 100%; width: 2px; background-color: #000000; position: absolute; border-radius: 50px; z-index: 2000; margin-left: ' + secondsToWidth(current_second) + 'px;'"></div>
    <v-layout row>
        <v-flex
          v-for="(clip, index) in clips.a_roll"
          :key="index"
          px-1
          pb-2
        >
          <inspire-mini-card-timeline
            :colour="calculateClipColour(clip)"
            :index="index"
            :width="secondsToWidth(clip.length)"
            :clip_type="clip.type"
            type="a_roll"
            >
          </inspire-mini-card-timeline>
        </v-flex>
    </v-layout>
    <v-layout row>
        <v-flex
          v-for="(music, index) in clips.music"
          :key="index"
          px-1
          pb-2
        >
          <inspire-mini-card-timeline
            colour="#35FF57"
            :index="index"
            :width="secondsToWidth(music.length)"
            :clip_type="music.type"
            type="music"
            >
          </inspire-mini-card-timeline>
        </v-flex>
    </v-layout>
  </v-layout>
</template>

<script>
import inspireMiniCardTimeline from '~/components/inspire-mini-card-timeline.vue'
export default {
  props: ['clips'],
  components: { inspireMiniCardTimeline },
  middleware: 'authenticated',
  data () {
    return {
      timeline_max_minutes: 10,
      current_second: 500
    }
  },
  methods: {
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
