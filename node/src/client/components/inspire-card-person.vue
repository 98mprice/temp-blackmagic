<template>
  <v-list style="background-color: transparent">
    <v-list-tile avatar router :to="'/users/' + user.username">
      <v-list-tile-avatar>
        <img :src="user.imageSrc ? user.imageSrc : 'https://cdn.vuetifyjs.com/images/john.jpg'" :alt="user.username">
      </v-list-tile-avatar>

      <v-list-tile-content>
        <v-list-tile-title><b>@{{user.username}}</b> {{user.firstName}} {{user.lastName}}</v-list-tile-title>
        <v-list-tile-sub-title>{{user.email}}</v-list-tile-sub-title>
      </v-list-tile-content>

      <v-list-tile-action v-if="!dont_show_friend">
        <v-btn
          :class="friend ? 'pink--text' : ''"
          icon
          @click="add_friend"
        >
          <v-icon>star</v-icon>
        </v-btn>
      </v-list-tile-action>
    </v-list-tile>
  </v-list>
</template>

<script>
export default {
  props: {
     user: Object,
     dont_show_friend: Boolean,
     parent_add: Function,
     parent_remove: Function
  },
  data () {
    return {
      friend: this.$store.state.user.friends.includes(this.user.username)
    }
  },
  methods: {
    add_friend: function() {
      console.log("adding friend " + this.user.username)
      this.friend = !this.friend
      if (this.friend) {
        this.parent_add()
      } else {
        this.parent_remove()
      }
    }
  },
}
</script>
