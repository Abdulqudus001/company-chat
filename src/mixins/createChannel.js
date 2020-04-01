import Vue from 'vue';

export default {
  methods: {
    createChannel() {
      this.loading = true;
      Vue.axios.post('https://fierce-sierra-17373.herokuapp.com/channels/create', this.channelDetails).then((res) => {
        this.loading = false;
        this.$store.dispatch('fetchChannels');
        this.channelDetails.channelName = '';
        this.channelDetails.channelDescription = '';
        this.channelDetails.channelPrivate = '';
        /* eslint-disable-next-line */
        this.$emit('closeDialog');
        console.log(res.data);
        this.$router.push({ path: `/channels/${res.data.channelid}` });
      }).catch(() => {
        this.loading = false;
      });
    },
  },
};
