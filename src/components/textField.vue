<template>
  <div style="width: 100%">
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
        :class="isThread ? 'thread' : 'message'"
        contenteditable="true"
        @input="keyPressed"
        :placeholder="!isThread ? `Message ${getChannel && getChannel.channelName}` : 'Message'"
      ></p>
      <v-btn
        text
        icon
        class="append"
        @click.stop="$emit('sendMessage', message)"
        :loading="sendingMessage"
      >
        <v-icon>mdi-send</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import EmojiPicker from '@/components/emoji.vue';
import emoji from '../emoji';

export default {
  components: { EmojiPicker },
  props: {
    sendingMessage: {
      type: Boolean,
      default: false,
    },
    isThread: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    showEmojiPicker: false,
    emojis: [],
    message: '',
  }),
  computed: {
    ...mapGetters([
      'getChannels',
    ]),
    getChannel() {
      if (this.getChannels) {
        /* eslint-disable-next-line */
        return this.getChannels.find((channel) => channel.channelId === this.$route.params.channel);
      } return false;
    },
  },
  mounted() {
    this.emojis = emoji;
  },
  methods: {
    keyPressed(e) {
      this.message = e.target.textContent;
    },
    selectedEmoji(e) {
      const className = this.isThread ? 'thread' : 'message';
      const textarea = document.querySelector(`.${className}`);
      const start = this.getCaret(textarea);
      this.hideCard();
      const messageToArr = textarea.textContent.split('');
      messageToArr.splice(start, 0, e);
      textarea.innerHTML = messageToArr.join('');
      this.message = messageToArr.join('');
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
      if (textarea.focus) {
        textarea.focus();
      }
    },
    hideCard() {
      this.showEmojiPicker = false;
    },
    showEmoji() {
      this.showEmojiPicker = !this.showEmojiPicker;
    },
  },
};
</script>

<style lang="scss" scoped>
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
</style>
