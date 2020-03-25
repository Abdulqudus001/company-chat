import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      dark: {
        button: '#1d3557',
        text: '#f2f2ff',
        background: '#41608c',
      },
      light: {
        button: '#1d3557',
        background: '#fff',
        text: '#1d3557',
      },
    },
  },
});
