<template>
  <v-layout column>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="display-1 font-weight-bold">
          <v-icon :color="$vuetify.theme.dark ? '#fff' : '#000'">mdi-lock</v-icon>
          {{ getChannel.channelName }}
        </v-list-item-title>
        <v-list-item-subtitle
          class="subtitle-1 my-3"
          :class="$vuetify.theme.dark ? 'white--text' : '#000'"
        >
          <a href="#" class="user-link">@{{ getChannel.createdBy }}</a> created this private channel
          on March 3rd.
          This is the very beginning of the bugs channel.
          Description: {{ getChannel.channelDescription }}
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
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      'getChannels',
    ]),
    getChannel() {
      return this.getChannels.find((channel) => channel.channelId === this.$route.params.channel);
    },
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 768px){
  .layout {
    padding: 20px;
  }
  hr {
    width: calc(100% + 40px);
    left: -20px;
  }
}

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

</style>
