import Vue from 'vue';

export default {
  fetchChannels({ commit }) {
    Vue.axios.get('https://fierce-sierra-17373.herokuapp.com/channels').then(({ data }) => {
      commit('updateChannels', data.allChannels);
    });
  },
};
