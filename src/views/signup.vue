<template>
  <v-container
    class="fill-height"
    fluid
  >
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          sm="8"
          md="4"
        >
          <v-card class="elevation-12 mx-auto">
            <v-toolbar
              color="button"
              dark
              flat
            >
              <v-toolbar-title>COMPANY CHAT SIGNUP FORM</v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-card-text>
              <v-form>
                  <v-text-field
                  v-model="user.fullname"
                  label="Full Name"
                  name="name"
                  prepend-icon="mdi-account"
                  type="text"
                  required
                />
                  <v-text-field
                  v-model="user.phone"
                  label="Phone"
                  name="phone"
                  prepend-icon="mdi-phone"
                  type="number"
                  required
                />
                <v-text-field
                  v-model="user.email"
                  label="Email"
                  name="email"
                  prepend-icon="mdi-email"
                  type="text"
                  required
                />

                <v-text-field
                  v-model="user.password"
                  id="password"
                  label="Password"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                  required
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="button" class="white--text" @click="register()">Sign Up</v-btn>
            </v-card-actions>
          </v-card>
          <br>
          <p class="text-center">Already have an account?
              <router-link :to="{ name: 'login'}">Log In</router-link>
          </p>
        </v-col>
      </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      user: {
        email: '',
        fullname: '',
        password: '',
        phone: '',
      },
    };
  },
  methods: {
    register() {
      const data = {
        fullName: this.user.fullname,
        phone: this.user.phone,
        email: this.user.email,
        password: this.user.password,
      };
      this.$store
        .dispatch('register', data)
        .then(() => this.$router.push('/'));
    },
  },
};
</script>

<style>

</style>
