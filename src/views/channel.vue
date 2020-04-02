<template>
  <v-layout column id="chat-area">
    <v-dialog persistent v-model="showDeleteDialog" max-width="300">
      <v-card color="bars">
        <v-card-title class="headline">Delete this channel?</v-card-title>
        <v-card-text class="mt-4">
          Enter the channel name to delete
          <v-text-field
            v-model="channelName"
            rounded
            outlined
            dense
            class="mt-4"
            placeholder="General"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="showDeleteDialog = false">Cancel</v-btn>
          <v-btn
            color="red darken-1"
            text
            @click="deleteChannel"
            :disabled="channelName !== getChannel.channelName"
            :loading="deleting"
          >Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="display-1 font-weight-bold">
          <v-layout justify-space-between wrap style="padding: 20px 0">
            <span>
              <v-icon :color="$vuetify.theme.dark ? '#fff' : '#000'">
                {{ getChannel && getChannel.channelPrivate ? 'mdi-lock' : 'mdi-pound' }}
              </v-icon>
              {{ getChannel && getChannel.channelName }}
            </span>
            <v-menu nudge-left>
              <template v-slot:activator="{ on: menu }">
                <v-btn text icon v-on="{ ...menu }">
                  <v-icon>mdi-cog-outline</v-icon>
                </v-btn>
              </template>
              <v-list color="bars" rounded>
                <v-list-item
                  @click="leaveChannel"
                  class="px-2"
                  v-if="!isChannelOwner"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-exit-to-app</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Leave channel</v-list-item-title>
                </v-list-item>
                <v-list-item
                  @click="showDeleteDialog = true"
                  v-else
                  class="px-2"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-delete-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Delete channel</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-layout>
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
    <v-container>
      <div v-if="!isObjectEmpty(getChannelMessages)">
         <v-list
          v-for="day in getChannelMessages.messageByDay"
          :key="day.day"
          color="background"
        >
          <v-banner single-line elevation="0" sticky color="background">
            {{ day.day }}
          </v-banner>
          <v-list-item
            v-for="message in day.messagesThatDay"
            :key="message.messageId"
            three-line
            @mouseenter="hovered = message.messageId"
            @mouseleave="hovered = ''"
            link
          >
            <v-list-item-content>
              <v-list-item-title>
                <v-layout align-center style="padding: 0">
                  <h5>{{ message.postedBy }}</h5>
                  <p class="caption my-0 mx-2">{{ message.createdAt | toTime }}</p>
                </v-layout>
              </v-list-item-title>
              <v-list-item-subtitle>{{ message.messageContent }}</v-list-item-subtitle>
            </v-list-item-content>
            <div class="actions" v-if="message.messageId === hovered">
              <v-layout justify-space-between>
                <v-btn icon @click="addThread(message)">
                  <v-icon>mdi-chat-outline</v-icon>
                </v-btn>
                <v-btn
                  icon
                  v-show="message.postedBy === JSON.parse(getUser).fullName"
                  @click="deleteMessage(message.messageId)"
                  :loading="isDeleting"
                >
                  <v-icon>mdi-delete-outline</v-icon>
                </v-btn>
              </v-layout>
            </div>
          </v-list-item>
        </v-list>
      </div>
    <v-navigation-drawer right :value="showThread" app color="background" width="320">
      <v-layout justify-end>
        <v-btn icon text @click="showThread = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-layout>

    </v-navigation-drawer>
    </v-container>
    <v-footer
      app
      inset
      color="background"
    >
      <text-field :sendingMessage="sendingMessage" @sendMessage="sendMessage"/>
    </v-footer>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import emoji from '../emoji';
import TextField from '../components/textField.vue';

export default {
  components: { TextField },
  data: () => ({
    showEmojiPicker: false,
    channelName: '',
    emojis: [],
    newMessage: {
      messageContent: '',
      channelId: '',
    },
    showDeleteDialog: false,
    deleting: false,
    usersInChannel: 0,
    sendingMessage: false,
    hovered: '',
    showThread: false,
    isDeleting: false,
  }),
  filters: {
    toTime: (value) => {
      if (!value) return '';
      return new Date(value).toLocaleTimeString();
    },
  },
  mounted() {
    this.emojis = emoji;
    this.getChannelDetails(this.$route.params.channel);
    this.$store.dispatch('getChannelMessages', this.$route.params.channel);
    this.scrollToView();
  },
  updated() {
    this.newMessage.channelId = this.$route.params.channel;
  },
  computed: {
    ...mapGetters([
      'getChannels',
      'getUser',
      'getChannelMessage',
    ]),
    getChannel() {
      if (this.getChannels) {
        /* eslint-disable-next-line */
        return this.getChannels.find((channel) => channel.channelId === this.$route.params.channel);
      } return false;
    },
    isChannelOwner() {
      if (this.getChannels) {
        const channel = this.getChannels.find((ch) => ch.channelId === this.$route.params.channel);
        const user = JSON.parse(localStorage.getItem('user'));
        return channel.createdBy === user.fullName;
      } return null;
    },
    getChannelMessages() {
      if (this.getChannelMessage.length > 0) {
        this.scrollToView();
        return this.getChannelMessage.find((ch) => ch.channel === this.$route.params.channel);
      } return [];
    },
  },
  watch: {
    $route() {
      this.$store.dispatch('getChannelMessages', this.$route.params.channel);
      const textarea = document.querySelector('.message');
      textarea.textContent = '';
      this.getChannelDetails(this.$route.params.channel);
    },
  },
  methods: {
    isObjectEmpty(object) {
      let isEmpty = true;
      /* eslint-disable-next-line */
      for (const keys in object) {
        if (keys) {
          isEmpty = false;
          break; // exiting since we found that the object is not empty
        }
      }
      return isEmpty;
    },
    addThread({ isThread, messageId }) {
      if (!isThread) {
        this.axios.patch(`message/${messageId}`).then(() => {
          this.$store.dispatch('getChannelMessages', this.$route.params.channel);
          this.showThread = true;
        });
      } else {
        this.fetchThreadMessages(messageId);
        this.showThread = true;
      }
    },
    fetchThreadMessages(id) {
      this.axios.get(`messageConversation/${id}`).then(({ data }) => {
        console.log(data);
      });
    },
    leaveChannel() {
      const body = {
        /* eslint-disable-next-line */
        userId: JSON.parse(this.$store.getters.getUser)._id,
      };
      this.axios.delete(`/channelUsers/${this.$route.params.channel}`, body).then(() => {
        this.$store.dispatch('fetchChannels');
        const index = this.getChannels.findIndex((ch) => {
          const result = ch.channelId === this.$route.params.channel;
          return result;
        });
        this.channelName = '';
        this.$router.push({ path: `/channels/${this.getChannels[index + 1].channelId}` });
      });
    },
    deleteChannel() {
      this.deleting = true;
      this.axios.delete(`channels/${this.$route.params.channel}`).then(() => {
        this.deleting = false;
        this.showDeleteDialog = false;
        this.$store.dispatch('fetchChannels');
        const index = this.getChannels.findIndex((ch) => {
          const res = ch.channelId === this.$route.params.channel;
          return res;
        });
        this.channelName = '';
        this.$router.push({ path: `/channels/${this.getChannels[index + 1].channelId}` });
      }).catch(() => {
        this.deleting = false;
        this.showDeleteDialog = false;
      });
    },
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
    sendMessage(e) {
      this.sendingMessage = true;
      const body = {
        messageContent: e,
        channelId: this.$route.params.channel,
      };
      this.axios.post('https://fierce-sierra-17373.herokuapp.com/message/create', body).then(() => {
        this.sendingMessage = false;
        this.$store.dispatch('getChannelMessages', this.$route.params.channel);
        const textarea = document.querySelector('.message');
        textarea.textContent = '';
        this.scrollToView();
      }).catch(() => {
        this.sendingMessage = false;
      });
    },
    deleteMessage(id) {
      this.isDeleting = true;
      this.axios.delete(`message/${id}`).then(() => {
        this.isDeleting = false;
        this.$store.dispatch('getChannelMessages', this.$route.params.channel);
      }).catch(() => {
        this.isDeleting = false;
      });
    },
    getChannelDetails(channelId) {
      this.axios.get(`users/${channelId}`).then(({ data }) => {
        this.usersInChannel = data.user.length;
      });
    },
    scrollToView() {
      const chatDiv = document.querySelector('#chat-area');
      if (chatDiv) {
        this.$vuetify.goTo(chatDiv.scrollHeight + 50);
      }
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
