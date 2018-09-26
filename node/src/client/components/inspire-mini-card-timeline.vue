<template>
  <v-card v-ripple
    light
    flat
    :color="background_colour"
    :data-id="index"
    :data-clip_type="clip_type"
    :data-type="type"
    style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #000000"
    :width="width"
    class="pl-2 pt-1 pb-1"
    >
    <span v-html="text"></span>
  </v-card>
</template>

<script>
export default {
  props: {
    colour: String,
    width: Number,
    index: Number,
    text: String,
    clip_type: String,
    type: String
  },
  data () {
    return {

    }
  },
  computed: {
    background_colour: function() {
      if (this.clip_type == "blank") return "transparent"
      else return this.colour
    }
  },
  methods: {
    remove: function() {
      this.parent_remove(this.index, this.type)
    },
    add_empty: function(direction) {
      this.show_side_buttons = false
      this.parent_add_empty(this.index, this.type, direction)
    },
    duplicate: function() {
      this.parent_duplicate(this.index, this.type)
    }
  }
}
</script>
