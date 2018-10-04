<template>
  <v-app dark id="inspire">
    <v-navigation-drawer
      floating
      v-model="drawer"
      class="black"
      v-if="$store.state.user.isAuthenticated"
      app>
      <div style="width: 100%; height: 50px; position: absolute; bottom: 0;"> <!-- background-image: linear-gradient(150deg, rgba(0, 0, 0, 0), #FF35E9);-->
        <v-chip @click="redirectToUser" style="float: right;"
         color="rgb(255, 239, 75)"
         dark
         class="mt-2 mr-2">
          <v-avatar>
            <img :src="$store.state.user.imageSrc ? $store.state.user.imageSrc : '/default.jpg'"/>
          </v-avatar>
          {{ $store.state.user.username }}
        </v-chip>
      </div>
      <v-list class="main-list">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img src="/icon.png" />
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title class="colfax mt-2" style="font-size: 25px;">
              <b><i>blackmagic</i></b>
            </v-list-tile-title>
          </v-list-tile-content>
          <!--<v-list-tile-action icon>
            <v-btn icon dark @click.stop="mini = !mini">
              <v-icon light>chevron_left</v-icon>
            </v-btn>
          </v-list-tile-action>-->
        </v-list-tile>
      </v-list>
      <v-list>

      <!--<v-list-tile router :to="'/users/' + $store.state.user.username">
        <v-list-tile-action>
          <v-icon>assignment_ind</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>Profile</v-list-tile-title>
      </v-list-tile>-->

      <v-list-tile router :to="'/users/' +  $store.state.user.username + '/videos'">
        <v-list-tile-action>
          <v-icon>video_label</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>Videos</v-list-tile-title>
      </v-list-tile>

      <v-list-tile router :to="'/users/' +  $store.state.user.username + '/people'">
        <v-list-tile-action>
          <v-icon>people</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>People</v-list-tile-title>
      </v-list-tile>
    </v-list>
    </v-navigation-drawer>
    <v-toolbar v-if="this.$store.state.show_toolbar" app fixed flat color="transparent">
      <v-toolbar-side-icon v-if="$store.state.user.isAuthenticated" dark @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-spacer></v-spacer>
      <v-menu bottom left>
        <v-btn icon="icon" slot="activator" dark>
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile ripple router to="/users/auth/sign-in" v-if="!$store.state.user.isAuthenticated">
            <v-list-tile-title>Sign In</v-list-tile-title>
          </v-list-tile>
          <v-list-tile ripple router to="/users/auth/sign-up" v-if="!$store.state.user.isAuthenticated">
            <v-list-tile-title>Sign Up</v-list-tile-title>
          </v-list-tile>
          <v-list-tile ripple router to="/users/auth/sign-out" v-if="$store.state.user.isAuthenticated">
            <v-list-tile-title>Sign Out</v-list-tile-title>
          </v-list-tile>
          <v-list-tile ripple router to="/users">
            <v-list-tile-title>Users</v-list-tile-title>
          </v-list-tile>
          <v-list-tile ripple router to="/admin" v-if="$store.state.user.admin">
            <v-list-tile-title>Admin</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-content app clipped-left>
      <v-container fluid fill-height class="ma-0 pa-0">
        <v-layout>
          <nuxt></nuxt>
        </v-layout>
      </v-container>
    </v-content>
    <v-snackbar
      :timeout="3000"
      :bottom="true"
      :right="true"
      :multi-line="true"
      :color="snackbarColor"
      v-model="snackbar">
      {{ $store.state.notification.text }}
      <v-btn dark flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
// search icons: https://material.io/icons/ asd
export default {
  props: {
    source: String
  },
  data () {
    return {
      drawer: null,
      fetchedUser: this.$store.state.fetchedUser,
      admins: [
        ['Management', 'people_outline'],
        ['Settings', 'settings']
      ],
      cruds: [
        ['Create', 'add'],
        ['Read', 'insert_drive_file'],
        ['Update', 'update'],
        ['Delete', 'delete']
      ],
      items: [
        {
          action: 'android',
          title: 'Something',
          items: [
            { title: 'First' },
            { title: 'Second' },
            { title: 'Third' }
          ]
        },
        {
          action: 'settings',
          title: 'Settings',
          items: [
            { title: 'Payment' },
            { title: 'Account' },
            { title: 'Privacy' }
          ]
        }
      ],
      name: 'blackmagic',
      mini: true,
      right: null
    }
  },
  methods: {
    redirectToUser () {
      this.$router.push({
        path: '/users/' + this.$store.state.user.username,
      })
    }
  },
  fetch ({ store, params, req }) {
    const username = params.username
    const token = process.SERVER_BUILD ? req.cookies.token : Cookies.get('token')
    return store.dispatch('fetchedUser/fetchUser', { username, token })
  },
  computed: {
    snackbar: {
      get () {
        return this.$store.state.notification.snackbar
      },
      set (value) {
        this.$store.commit('notification/UPDATE_SNACKBAR', value)
      }
    },
    snackbarColor () {
      return this.$store.state.notification.context
    }
  }
}
</script>
