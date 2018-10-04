import axios from '~/plugins/axios'

export const state = () => {
  return {
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    imageSrc: '',
    friends: []
  }
}

export const mutations = {
  FETCH_USER_REQUEST (state) {
    console.log('fetchUser pending...')
  },
  FETCH_USER_SUCCESS (state, data) {
    console.log("fetching user " + JSON.stringify(data))
    state.username = data.username
    state.firstName = data.firstName
    state.lastName = data.lastName
    state.email = data.email
    state.imageSrc = data.imageSrc
    state.friends = data.friends
    console.log('fetchUser success!')
  },
  FETCH_USER_FAILURE (state, error) {
    console.error(error.response.data.error)
  }
}

export const actions = {
  async fetchUser ({ state, commit }, { username }) {
    try {
      commit('FETCH_USER_REQUEST')
      let { data } = await axios.get(`/users/${username}`)
      commit('FETCH_USER_SUCCESS', data)
    } catch (error) {
      commit('FETCH_USER_FAILURE', error)
    }
  }
}
