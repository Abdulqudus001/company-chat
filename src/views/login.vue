<template>
      <v-content>
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
            <v-card class="elevation-12 mt-12 mx-auto">
              <v-toolbar
                color="button"
                dark
                flat
              >
                <v-toolbar-title>COMPANY CHAT LOGIN FORM</v-toolbar-title>
                <v-spacer />
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    v-model="loginDetails.email"
                    label="Email"
                    name="email"
                    prepend-icon="mdi-email"
                    type="text"
                    required
                  />

                  <v-text-field
                    v-model="loginDetails.password"
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
                <v-btn color="button" class="white--text" @click="logIn()">Login</v-btn>
              </v-card-actions>
            </v-card>
            <br>
             <p class="text-center">Don't have an account ? Please
               <router-link :to="{ name: 'signup'}">Sign Up</router-link>
             </p>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
</template>

<script>


export default {
  data() {
    return {
      loginDetails: {
        email: '',
        password: '',
      },
      showLoader: false,
    };
  },
  methods: {
    logIn() {
      this.$router.push('/home');
    },
  },
};
</script>

<style>

</style>
