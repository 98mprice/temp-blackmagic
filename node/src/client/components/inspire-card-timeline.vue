<template>
  <div @mouseover="((no_hover == true) ? hover = false : hover = true)" @mouseleave="hover = false" class="pos-relative">
    <v-layout row>
      <v-tooltip v-if="!no_buttons && show_side_buttons" bottom color="black">
        <v-btn @click="add_empty(0)" slot="activator" flat icon color="white" class="ma-3">
          <v-icon>crop_free</v-icon>
        </v-btn>
        <span>Add empty space to right</span>
      </v-tooltip>

      <v-card
        class="resize-drag"
        light
        flat
        :color="background_colour"
        :data-id="index"
        :data-clip_type="clip_type"
        :data-type="type"
        :style="'white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color:' + ((hover == true) ? 'rgba(0, 0, 0, 0.7)' : '#000000')"
        :width="width"
        >
        <div v-if="clip_type == 'blank'" style="width: 100%; text-align: center;" class="pt-2">
          <v-tooltip bottom color="black">
            <v-btn @click="remove" slot="activator" flat icon class="ma-0" color="black">
              <v-icon>close</v-icon>
            </v-btn>
            <span>Remove empty space</span>
          </v-tooltip>
          <span v-html="text"></span>
        </div>
        <div v-else>
          <div v-if="!no_buttons" style="float: right;">
            <v-tooltip top color="black">
              <v-btn @click="show_side_buttons = !show_side_buttons"
                slot="activator" flat icon :color="((show_side_buttons == true) ? 'white' : 'black')" class="ma-0">
                <v-icon>filter_center_focus</v-icon>
              </v-btn>
              <span>Add empty space</span>
            </v-tooltip>
            <v-tooltip top color="black">
              <v-btn @click="remove" slot="activator" flat icon color="black" class="ma-0">
                <v-icon>close</v-icon>
              </v-btn>
              <span>Remove clip</span>
            </v-tooltip>
          </div>
          <div v-html="((clip_type == 'blank') ? '' : text)" class="pa-3 colfax"></div>
        </div>
        <!--<video v-show="hover" class="video-background" no-controls autoplay src="http://clips.vorwaerts-gmbh.de/VfE_html5.mp4" poster="http://thumb.multicastmedia.com/thumbs/aid/w/h/t1351705158/1571585.jpg"></video>-->
      </v-card>

      <v-tooltip v-if="!no_buttons && show_side_buttons" bottom color="black">
        <v-btn @click="add_empty(1)" slot="activator" flat icon color="white" class="ma-3">
          <v-icon>crop_free</v-icon>
        </v-btn>
        <span>Add empty space to left</span>
      </v-tooltip>
    </v-layout>
  </div>
</template>

<script>
export default {
  props: {
    colour: String,
    width: String,
    index: Number,
    text: String,
    clip_type: String,
    type: String,
    no_hover: Boolean,
    no_buttons: Boolean
  },
  data () {
    return {
      hover: false,
      show_side_buttons: false
    }
  },
  computed: {
    background_colour: function() {
      if (this.hover || this.clip_type == "blank") return "transparent"
      else return this.colour
    }
  },
  methods: {
    remove: function() {
      this.$parent.remove(this.index, this.type)
    },
    add_empty: function(direction) {
      this.show_side_buttons = false
      this.$parent.add_empty(this.index, this.type, direction)
    }
  }
}
</script>
