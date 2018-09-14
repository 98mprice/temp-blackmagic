<template>
  <div @mouseover="hover = true" @mouseleave="hover = false" class="pos-relative">
    <v-card class="resize-drag mt-2 pa-3 colfax" light flat :color="background_colour" :data-id="index" :style="'white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color:' + ((hover == true) ? 'rgba(0, 0, 0, 0.7)' : '#000000')" :width="width">
      <b>{{name}}</b></br>{{time}}
      <!--<video v-show="hover" class="video-background" no-controls autoplay src="http://clips.vorwaerts-gmbh.de/VfE_html5.mp4" poster="http://thumb.multicastmedia.com/thumbs/aid/w/h/t1351705158/1571585.jpg"></video>-->
    </v-card>
  </div>
</template>

<script>
export default {
  props: [ 'name', 'colour', 'time', 'width', 'index' ],
  data () {
    return {
      hover: false
    }
  },
  computed: {
    background_colour: function() {
      if (this.hover) return "transparent"
      else return this.colour
    }
  }
}
</script>
