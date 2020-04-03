export default {
  isLoggedIn: (state) => !!state.token,
  authStatus: (state) => state.status,
  getChannels: (state) => state.channels,
  getUser: (state) => state.user,
  getChannelMessage: (state) => {
    state.channelMessages.forEach((msg) => {
      msg.messageByDay.sort((a, b) => new Date(a.day) - new Date(b.day));
    });
    return state.channelMessages;
  },
};
