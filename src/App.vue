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
              @click="showDialog = true"
            >mdi-plus-circle-outline</v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-list-item v-for="item in navItems" :key="item.name" :to="item.link">
          <v-list-item-icon>
            <v-icon
              size="18"
              color="rgba(255, 255, 255, 0.712)"
              v-if="item.type == 'private'"
            >mdi-lock</v-icon>
            <v-icon
              size="18"
              color="rgba(255, 255, 255, 0.712)"
              v-else
            >mdi-pound</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-subtitle>{{ item.name }}</v-list-item-subtitle>
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
          >#{{ $route.params.channel }}</v-list-item-title>
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
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span
                    @mouseenter="userHovered = true"
                    @mouseleave="userHovered = false"
                    class="mr-3"
                    v-on="on"
                  >
                    <v-icon
                      :color="userHovered ? 'rgb(18, 100, 163)' : ''"
                      size="18"
                    >mdi-account-outline</v-icon>
                    13
                  </span>
                </template>
                <span>View users</span>
              </v-tooltip>
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
      <new-channel @closeDialog="showDialog = false" :showDialog="showDialog" />
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import NewChannel from '@/components/newChannel.vue';

export default {
  name: 'App',
  components: { NewChannel },
  data: () => ({
    starHovered: false,
    starClicked: false,
    userHovered: false,
    pinHovered: false,
    navItems: [
      {
        name: 'announcement',
        type: 'private',
        link: '/channels/announcement',
      },
      {
        name: 'random',
        type: 'public',
        link: '/channels/random',
      },
      {
        name: 'software-development',
        type: 'private',
        link: '/channels/software-development',
      },
      {
        name: 'polls',
        type: 'public',
        link: '/channels/polls',
      },
    ],
    showDialog: false,
  }),
  computed: {
    theme() {
      return (this.$vuetify.theme.dark) ? 'dark' : 'light';
    },
  },
  created() {
    this.$vuetify.theme.dark = true;
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
