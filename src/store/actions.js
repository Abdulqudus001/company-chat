import axios from 'axios';

export default {
  login({ commit }, user) {
    return new Promise((resolve, reject) => {
      commit('auth_request');
      axios({ url: 'https://fierce-sierra-17373.herokuapp.com/users/login', data: user, method: 'POST' })
        .then((resp) => {
          const { token } = resp.data;
          const userDetails = resp.data.user;
          localStorage.setItem('token', token);
          axios.defaults.headers.common.Authorization = token;
          commit('auth_success', token, userDetails);
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
      axios({ url: 'https://fierce-sierra-17373.herokuapp.com/users/signup', data: user, method: 'POST' })
        .then((resp) => {
          console.log(resp);
          const { token } = resp.data;
          const userDetails = resp.data.user;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userDetails));
          axios.defaults.headers.common.Authorization = token;
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
      delete axios.defaults.headers.common.Authorization;
      resolve();
    });
  },
  fetchChannels() {

  },
};
