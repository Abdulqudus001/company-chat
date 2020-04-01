import Vue from 'vue';

const formatDate = (date) => new Date(date);
// const getTime = date => date.toLocaleTimeString();
const getDay = (date) => date.toDateString();
export default {
  auth_request(state) {
    state.status = 'loading';
  },
  auth_success(state, [token, user]) {
    state.status = 'success';
    state.token = token;
    state.user = user;
  },
  auth_error(state) {
    state.status = 'error';
  },
  logout(state) {
    state.status = '';
    state.token = '';
  },
  updateChannels(state, payload) {
    if (payload.length < 1) {
      Vue.$router.push({ path: '/' });
    }
    state.channels = payload;
  },
  saveChannelMessage(state, [payload, channel]) {
    const messages = payload.allMessage;
    if (Array.isArray(messages) && messages.length > 0) {
      const days = [...new Set(messages.map((message) => getDay(formatDate(message.createdAt))))];
      const messageByDay = days.map((day) => {
        const messagesThatDay = messages.filter((mes) => getDay(formatDate(mes.createdAt)) === day)
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        return {
          day,
          messagesThatDay,
        };
      });
      const channelMessageIndex = state.channelMessages.findIndex((ch) => ch.channel === channel);
      if (channelMessageIndex < 0) {
        state.channelMessages.push({
          channel,
          messageByDay,
        });
      } else {
        state.channelMessages.splice(channelMessageIndex, 1, {
          channel,
          messageByDay,
        });
      }
    }
  },
};
