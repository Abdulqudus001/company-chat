<template>
  <v-app :style="{background: $vuetify.theme.themes[theme].background}">
    <v-navigation-drawer
      v-if="$route.name !== 'login' && $route.name !== 'signup'"
      color="sidebar"
      app
    >
      <v-list-item link>
        <v-list-item-content :class="$vuetify.theme.dark ? '' : 'text--white'">
          <v-list-item-title class="headline font-weight-bold">
            {{ 'Outsource Global'.length > 20 ? 'Outsource Glob...' : 'Outsource Global'}}
          </v-list-item-title>
          <v-list-item-subtitle>
            <v-avatar color="green" size="8" />
            Abdulqudus
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list :class="$vuetify.theme.dark ? '' : 'text--white'" class="my-4">
        <v-list-item class="mb-3">
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold">Channels</v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon
              color="rgba(255, 255, 255, 0.712)"
              @click="showChannelDialog = true"
            >mdi-plus-circle-outline</v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-list-item
          v-for="item in getChannels"
          :key="item.channelName"
          :to="'/channels/' + item.channelId"
        >
          <v-list-item-icon>
            <v-icon
              size="18"
              color="rgba(255, 255, 255, 0.712)"
              v-if="item.channelPrivate"
            >mdi-lock</v-icon>
            <v-icon
              size="18"
              color="rgba(255, 255, 255, 0.712)"
              v-else
            >mdi-pound</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-subtitle>{{ item.channelName }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      v-if="$route.name !== 'login' && $route.name !== 'signup'"
      app
      elevation="1"
      color="bars"
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title
            class="font-weight-bold"
            v-if="$route.name == 'Home'"
          >Home</v-list-item-title>
          <v-list-item-title
            class="font-weight-bold"
            v-else
          >#{{ getChannel && getChannel.channelName.toLowerCase() }}</v-list-item-title>
          <v-list-item-subtitle>
            <v-layout>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    @mouseenter="starHovered = true"
                    @mouseleave="starHovered = false"
                    class="mr-3"
                    :color="starHovered || starClicked ? 'yellow' : ''"
                    @click="starClicked = !starClicked"
                    size="18"
                    v-on="on"
                  >
                    {{ !starClicked ? 'mdi-star-outline' : 'mdi-star' }}
                  </v-icon>
                </template>
                <span>
                  {{ starClicked ? 'Unstar this channel' : 'Star this channel' }}
                </span>
              </v-tooltip>
              <v-divider vertical class="mr-3" />
              <v-menu :close-on-content-click="false">
                <template v-slot:activator="{ on: menu }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on:tooltip }">
                      <span
                        @mouseenter="userHovered = true"
                        @mouseleave="userHovered = false"
                        class="mr-3"
                      >
                      <v-btn x-small text icon v-on="{...tooltip, ...menu}">
                        <v-icon
                          :color="userHovered ? 'rgb(18, 100, 163)' : ''"
                          size="18"
                        >mdi-account-outline</v-icon>
                      </v-btn>
                        {{ usersInChannel }}
                      </span>
                    </template>
                    <span>View users</span>
                  </v-tooltip>
                </template>
                <v-card class="pa-1" color="bars">
                  <v-card-title>
                    <v-text-field
                      dense
                      rounded
                      v-model="userSearch"
                      outlined
                      v-debounce:2000="findUsers"
                      placeholder="Search Users"
                    />
                  </v-card-title>
                  <v-card-text>
                    <v-progress-circular
                      class="mx-auto"
                      color="loader"
                      indeterminate
                      v-show="showLoading"
                    />
                    <v-list color="bars">
                      <v-list-item
                        v-show="channelUsers.length > 0"
                        v-for="user in channelUsers"
                        :key="user.userId"
                      >
                        <v-list-item-content>
                          <v-list-item-title>
                            <v-layout align-center justify-space-between>
                              {{ user.fullName }}
                              <!-- <v-btn
                                class="ml-2"
                                text
                                icon
                                v-if="getUser.fullName !== user.fullName"
                                @click="leaveChannel(user.userId)"
                              >
                                <v-icon>mdi-delete-outline</v-icon>
                              </v-btn> -->
                            </v-layout>
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item v-for="user in users" :key="user._id">
                        <v-list-item-content>
                          <v-list-item-title>
                            <v-layout justify-space-between align-center>
                              {{ user.fullName }}
                              <v-btn
                                class="ml-2"
                                text
                                icon
                                @click="addUserToChannel(user._id)"
                              >
                                <v-icon>mdi-plus</v-icon>
                              </v-btn>
                            </v-layout>
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-menu>
              <v-divider vertical class="mr-3" />
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span
                    @mouseenter="pinHovered = true"
                    @mouseleave="pinHovered = false"
                    class="mr-3"
                    v-on="on"
                  >
                    <v-icon
                      :color="pinHovered ? 'rgb(18, 100, 163)' : ''"
                      size="18"
                    >mdi-pin-outline</v-icon>
                    0
                  </span>
                </template>
                <span>Pin Channel</span>
              </v-tooltip>
            </v-layout>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-spacer></v-spacer>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon @click="$vuetify.theme.dark = !$vuetify.theme.dark" v-on="on">
            <v-icon>
              {{ $vuetify.theme.dark ? 'mdi-lightbulb-outline' : 'mdi-lightbulb-off-outline' }}
            </v-icon>
          </v-btn>
        </template>
        <span>{{ $vuetify.theme.dark ? 'Turn on the lights' : 'Turn off the lights' }}</span>
      </v-tooltip>
    </v-app-bar>
    <v-content>
      <new-channel @closeDialog="showChannelDialog = false" :showDialog="showChannelDialog" />
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import NewChannel from '@/components/newChannel.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'App',
  components: { NewChannel },
  data: () => ({
    starHovered: false,
    starClicked: false,
    userHovered: false,
    pinHovered: false,
    showChannelDialog: false,
    usersInChannel: 0,
    userSearch: '',
    showLoading: false,
    users: '',
    channelUsers: [],
  }),
  mounted() {
    this.$store.dispatch('fetchChannels');
    if (this.$route.params.channel) {
      this.getChannelUsers(this.$route.params.channel);
    }
  },
  watch: {
    $route() {
      this.getChannelUsers(this.$route.params.channel);
    },
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
    getUser() {
      const user = JSON.parse(this.$store.getters.getUser);
      return user;
    },
    theme() {
      return (this.$vuetify.theme.dark) ? 'dark' : 'light';
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },
  created() {
    this.$vuetify.theme.dark = true;
  },
  methods: {
    isUserInChannel(user) {
      const index = this.channelUsers.findIndex((usr) => user === usr.fullName);
      return index > -1;
    },
    findUsers() {
      this.showLoading = true;
      this.axios.get(`/users/search/${this.userSearch}`).then(({ data }) => {
        this.showLoading = false;
        this.users = data.user.filter((user) => {
          const index = this.channelUsers.findIndex((el) => el.fullName === user.fullName);
          return index < 0;
        });
      });
    },
    leaveChannel(id) {
      const body = {
        /* eslint-disable-next-line */
        userId: id,
      };
      this.axios.delete(`/channelUsers/${this.$route.params.channel}`, body).then(() => {
        this.getChannelUsers(this.$route.params.channel);
      });
    },
    addUserToChannel(userId) {
      const body = {
        userid: [userId],
      };
      this.axios.post(`channelUsers/${this.$route.params.channel}`, body).then((res) => {
        this.getChannelUsers(res.data.channelid);
        this.findUsers();
      });
    },
    getChannelUsers(channelId) {
      this.axios.get(`channelUsers/${channelId}`).then(({ data }) => {
        this.channelUsers = data.allChannelUsers;
        this.usersInChannel = data.allChannelUsers.length;
      });
    },
    logout() {
      this.$store.dispatch('logout').then(() => {
        this.$router.push('/login');
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.text--white::v-deep {
  .v-list-item__subtitle {
    color: rgba(255, 255, 255, 0.712) !important;
  }
  color: white !important;
}

.text--white::v-deep {
  .theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
    color: rgba(255, 255, 255, 0.6) !important;
  }
}
</style>
