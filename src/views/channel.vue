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
      <div class="text-field">
        <v-btn text icon class="prepend" @click.stop.prevent="showEmoji">
          <v-icon>mdi-emoticon-happy-outline</v-icon>
        </v-btn>
        <p
          class="message"
          contenteditable="true"
          @input="keyPressed"
          :placeholder="`Message ${getChannel && getChannel.channelName}`"
        ></p>
        <v-btn text icon class="append" @click.stop="sendMessage">
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </div>
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
    this.newMessage.channelId = this.$route.params.channel;
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
    newMessage: {
      messageContent: '',
      channelId: '',
    },
  }),
  methods: {
    keyPressed(e) {
      this.newMessage.messageContent = e.target.textContent;
    },
    selectedEmoji(e) {
      const textarea = document.querySelector('.message');
      const start = this.getCaret(textarea);
      this.hideCard();
      const messageToArr = textarea.textContent.split('');
      messageToArr.splice(start, 0, e);
      textarea.innerHTML = messageToArr.join('');
      this.newMessage.messageContent = messageToArr.join('');
      // Set position of caret
      this.setCaret(textarea.childNodes[0], start);
    },
    getCaret(textarea) {
      textarea.focus();
      const $range = document.getSelection().getRangeAt(0);
      const range = $range.cloneRange();
      range.selectNodeContents(textarea);
      range.setEnd($range.endContainer, $range.endOffset);
      const start = range.toString().length;
      return start;
    },
    setCaret(textarea, index) {
      const range = document.createRange();
      const selection = document.getSelection();
      range.setStart(textarea, index + 1);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      textarea.focus();
    },
    hideCard() {
      this.showEmojiPicker = false;
    },
    showEmoji() {
      this.showEmojiPicker = !this.showEmojiPicker;
    },
    sendMessage() {
      console.log(this.newMessage);
      this.axios.post('https://fierce-sierra-17373.herokuapp.com/message/create', this.newMessage).then(() => {
        this.$store.dispatch('getChannelMessages', this.$route.params.channel);
      });
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
  .text-field {
    width: 100%;
    margin: 20px 0;
    padding: 20px;
    border: 1px solid;
    position: relative;
    border-radius: 5px;
    max-height: 50vh;
    overflow-y: auto;
    p {
      width: calc(100% - 60px);
      margin: 0 auto;
      height: 100%;
      outline: none;
      &[contenteditable][placeholder]:empty::before {
        content: attr(placeholder);
        opacity: 0.7;
      }
    }
    .prepend,
    .append {
      position: absolute;
      top: 15px;
    }
    .prepend {
      left: 10px;
    }
    .append {
      right: 10px;
    }
  }
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
