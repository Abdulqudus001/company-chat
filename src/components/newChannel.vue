<template>
  <v-dialog @click:outside="$emit('closeDialog')" :value="showDialog" max-width="500">
    <v-card color="bars" elevation="1">
      <v-card-title>
        <v-layout>
          <h2>Create a channel</h2>
          <v-spacer />
          <v-icon @click="$emit('closeDialog')">mdi-close</v-icon>
        </v-layout>
      </v-card-title>
      <v-card-subtitle class="my-2">
        Channels are where your team communicates.
        They’re best when organized around a topic — #marketing, for example.
      </v-card-subtitle>

      <v-card-text>
        <v-text-field
          placeholder="Name"
          class="my-3"
          label="Football"
          v-model="channelDetails.channelName"
        ></v-text-field>
        <v-text-field
          placeholder="Discuss football matters"
          class="my-3"
          label="Description(optional)"
          messages="What’s this channel about?"
          v-model="channelDetails.channelDescription"
        ></v-text-field>

        <v-layout align-center>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="title">Make private</v-list-item-title>
              <v-list-item-subtitle>
                When a channel is set to private, it can only be viewed or joined by invitation.
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-spacer />
          <v-switch
            v-model="channelDetails.channelPrivate"
            inset
            true-value="1"
            false-value="0"
            :color="$vuetify.theme.dark ? '#fff' : '#1d3557'"
          ></v-switch>
        </v-layout>

        <v-layout class="my-3">
          <v-spacer />
          <v-btn
            :color="$vuetify.theme.dark ? 'background' : 'button'"
            class="white--text"
            :loading="loading"
            :disabled="channelDetails.channelName.length < 1"
            @click="createChannel"
          >Create</v-btn>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    loading: false,
    channelDetails: {
      channelName: '',
      channelDescription: '',
      channelPrivate: 0,
    },
    isPrivate: false,
    name: '',
    desc: '',
  }),
};
</script>

<style lang="scss" scoped>
  .v-list-item::v-deep {
    max-width: 70%;
    padding: 0;
    .v-list-item__subtitle {
      white-space: normal;
    }
  }

  .white--text {
    color: #fff;
  }
</style>
