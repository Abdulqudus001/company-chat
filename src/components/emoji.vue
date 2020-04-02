<template>
  <v-card class="emoji-picker" max-width="400px" max-height="400px" color="bars">
    <v-card-title>
      <v-text-field
        outlined
        flat
        rounded
        full-width
        dense
        v-model="search"
        placeholder="Search"
      />
    </v-card-title>
    <v-card-text>
      <v-layout wrap>
        <v-flex sm2 v-for="emoji in filtered" :key="emoji.html">
          <v-btn text @click="$emit('selectEmoji', emoji.emoji)">
            <p v-html="emoji.html"></p>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    emojis: {
      type: Array,
      default: () => {},
    },
  },
  data: () => ({
    vue: '',
    search: '',
  }),
  computed: {
    filtered() {
      return this.emojis.filter((emoji) => (
        emoji.name.includes(this.search.toLowerCase())
        || emoji.shortname.includes(this.search.toLowerCase())
      ));
    },
  },
  mounted() {
    this.vue = this;
    document.body.addEventListener('click', this.hideCard);
  },
  beforeDestroy() {
    document.body.removeEventListener('click', this.hideCard);
  },
  methods: {
    hideCard(e) {
      e.preventDefault();
      if (!e.target.classList.contains('show-emoji')) {
        const path = [...e.path];
        const isCard = path.some((el) => {
          if (el.classList) {
            return el.classList.contains('v-card__text') || el.classList.contains('emoji-picker');
          } return false;
        });
        if (!isCard) {
          this.vue.$emit('hideCard');
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .emoji-picker {
    position: absolute;
    right: 0;
    bottom: 30px;
    z-index: 2;
    overflow-y: auto;
  }
</style>
