import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      dark: {
        button: '#1d3557',
        bars: '#1d3557',
        text: '#f2f2ff',
        background: '#41608c',
        sidebar: '#1d3557',
      },
      light: {
        button: '#1d3557',
        bars: '#fff',
        background: '#fff',
        text: '#1d3557',
        sidebar: '#1d3557',
      },
    },
  },
});
