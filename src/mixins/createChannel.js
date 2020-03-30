import Vue from 'vue';

export default {
  methods: {
    createChannel() {
      this.loading = true;
      Vue.axios.post('https://fierce-sierra-17373.herokuapp.com/channels/create', this.channelDetails).then((res) => {
        console.log(res);
        this.loading = false;
        this.$store.dispatch('fetchChannels');
        /* eslint-disable-next-line */
        this.$router.push({ path: `/channels/${res.data.user._id}` });
      });
    },
  },
};
