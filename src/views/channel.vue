<template>
  <v-layout column>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="display-1 font-weight-bold">
          <v-icon :color="$vuetify.theme.dark ? '#fff' : '#000'">mdi-lock</v-icon>
          {{ getChannel && getChannel.channelName }}
        </v-list-item-title>
        <v-list-item-subtitle
          class="subtitle-1 my-3"
          :class="$vuetify.theme.dark ? 'white--text' : '#000'"
        >
          <a href="#" class="user-link">
            @{{ getChannel && getChannel.createdBy }}
            </a> created this private channel
          on March 3rd.
          This is the very beginning of the bugs channel.
          Description: {{ getChannel && getChannel.channelDescription }}
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          <v-layout justify-start class=" pa-0 my-2">
            <span class="mr-3 blue--text">
              <v-icon color="blue">mdi-flash-outline</v-icon>
              Add an app
            </span>
            <span class="mr-3 blue--text">
              <v-icon color="blue">mdi-account-plus-outline</v-icon>
              Add people
            </span>
            <span class="mr-3 blue--text">
              <v-icon color="blue">mdi-link-variant</v-icon>
              Share channel
            </span>
          </v-layout>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <hr class="my-3">
    <v-layout class="text-area">
      <emoji-picker
        v-show="showEmojiPicker"
        :emojis="emojis"
        @hideCard="hideCard"
        @selectEmoji="selectedEmoji"
      />
      <v-textarea
        :label="'Message ' + getChannel && getChannel.channelName"
        auto-grow
        rows="4"
        row-height="15"
        outlined
        prepend-inner-icon="mdi-emoticon-happy-outline"
        @click:prepend-inner="showEmoji"
        v-model="message"
      >
        <p v-html="message"></p>
      </v-textarea>
    </v-layout>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import EmojiPicker from '@/components/emoji.vue';
import emoji from '../emoji';

export default {
  components: { EmojiPicker },
  mounted() {
    this.emojis = emoji;
    this.$store.dispatch('getChannelMessages', this.$route.params.channel);
  },
  computed: {
    ...mapGetters([
      'getChannels',
    ]),
    getChannel() {
      if (this.getChannels) {
        return this.getChannels.find((channel) => channel.channelId === this.$route.params.channel);
      } return false;
    },
  },
  data: () => ({
    showEmojiPicker: false,
    emojis: [],
    message: '',
  }),
  methods: {
    selectedEmoji(e) {
      const textarea = document.querySelector('textarea');
      const start = textarea.selectionStart;
      this.hideCard();
      const messageToArr = this.message.split('');
      messageToArr.splice(start, 0, e);
      this.message = messageToArr.join('');
    },
    hideCard() {
      this.showEmojiPicker = false;
    },
    showEmoji() {
      this.showEmojiPicker = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.layout {
  padding: 20px 30px;
}
.v-list-item::v-deep {
  padding: 0;
  .v-list-item__subtitle {
    white-space: normal;
  }
}
.user-link {
  background: #e8f5fa;
  text-decoration: none;
  &:hover {
    background: #cce6f1;
  }
}

hr {
  width: calc(100% + 60px);
  height: 2px;
  position: relative;
  left: -30px;
}

.text-area {
  position: absolute;
  bottom: 0;
  padding: 0 !important;
  width: calc(100% - 60px);
}

@media screen and (max-width: 768px){
  .layout {
    padding: 20px;
  }
  hr {
    width: calc(100% + 40px);
    left: -20px;
  }
  .text-area {
    width: calc(100% - 40px);
    margin: 0 auto;
  }
}

</style>
