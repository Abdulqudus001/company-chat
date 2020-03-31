export default {
  isLoggedIn: (state) => !!state.token,
  authStatus: (state) => state.status,
  getChannels: (state) => state.channels,
  getUser: (state) => state.user,
};
