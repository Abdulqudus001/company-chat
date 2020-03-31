const formatDate = (date) => new Date(date);
// const getTime = date => date.toLocaleTimeString();
const getDay = (date) => date.toDateString();
export default {
  auth_request(state) {
    state.status = 'loading';
  },
  auth_success(state, token, user) {
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
    state.channels = payload;
  },
  saveChannelMessage(state, payload) {
    const messages = payload.allMessage;
    console.log(messages);
    if (Array.isArray(messages) && messages.length > 0) {
      const messageByDay = messages.map((message) => {
        const day = getDay(formatDate(message.createdAt));
        const messagesThatDay = messages.find((mes) => getDay(formatDate(mes.createdAt)) === day);
        return messagesThatDay;
      });
      console.log(messageByDay);
    }
  },
};
