import Vue from 'vue';

export default {
  fetchChannels({ commit }) {
    Vue.axios.get('channelUsers').then(({ data }) => {
      commit('updateChannels', data.allChannels);
    });
  },
  login({ commit }, user) {
    return new Promise((resolve, reject) => {
      commit('auth_request');
      Vue.axios({ url: 'users/login', data: user, method: 'POST' })
        .then((resp) => {
          const { token } = resp.data;
          const userDetails = resp.data.user;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userDetails));
          Vue.axios.defaults.headers.common.Authorization = `Bearer ${token}`;
          commit('auth_success', [token, userDetails]);
          resolve(resp);
        })
        .catch((err) => {
          commit('auth_error');
          localStorage.removeItem('token');
          reject(err);
        });
    });
  },
  register({ commit }, user) {
    return new Promise((resolve, reject) => {
      commit('auth_request');
      Vue.axios({ url: 'users/signup', data: user, method: 'POST' })
        .then((resp) => {
          const { token } = resp.data;
          const userDetails = resp.data.user;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userDetails));
          Vue.axios.defaults.headers.common.Authorization = `Bearer ${token}`;
          commit('auth_success', token, userDetails);
          resolve(resp);
        })
        .catch((err) => {
          commit('auth_error', err);
          localStorage.removeItem('token');
          reject(err);
        });
    });
  },
  logout({ commit }) {
    return new Promise((resolve) => {
      commit('logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete Vue.axios.defaults.headers.common.Authorization;
      resolve();
    });
  },
  getChannelMessages({ commit }, payload) {
    Vue.axios.get(`message/${payload}`).then(({ data }) => {
      commit('saveChannelMessage', [data, payload]);
    });
  },
};
