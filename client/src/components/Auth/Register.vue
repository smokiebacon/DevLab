<template>
  <section class="container">
    <h1 class="large text-primary">Sign Up</h1>
    <p class="lead">
      <i class="fas fa-user"></i> Create Your Account
    </p>
    <form class="form" @submit.prevent="onSubmit">
      <div class="form-group">
        <input type="text" placeholder="Name" v-model="name" name="name" required />
      </div>
      <div class="form-group">
        <input type="email" placeholder="Email Address" v-model="email" name="email" required />
        <small class="form-text">
          This site uses Gravatar so if you want a profile image, use a
          Gravatar email
        </small>
      </div>
      <div class="form-group">
        <input
          type="password"
          placeholder="Password"
          v-model="password"
          name="password"
          minlength="6"
        />
      </div>
      <div class="form-group">
        <input
          type="password"
          placeholder="Confirm Password"
          v-model="password2"
          name="password2"
          minlength="6"
        />
      </div>
      <input type="submit" class="btn btn-primary" value="Register" />
    </form>
    <p class="my-1">
      Already have an account?
      <router-link to="/login">Login</router-link>
    </p>
  </section>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      password2: ""
    };
  },
  methods: {
    onSubmit() {
      if (this.password !== this.password2) {
        console.log("Passwords do not match");
      } else {
        // const newUser = {
        //   name: this.name,
        //   email: this.email,
        //   password: this.password
        // };
        axios
          .post("http://localhost:5000/api/auth/register", {
            name: this.name,
            email: this.email,
            password: this.password
          })
          .then(function(response) {
            console.log(response, "This is reponse from Register.vue");
          })
          .catch(function(error) {
            console.log(error, "this is error from Register.vue");
          });
      }
    }
  }
};
</script>

<style>
</style>
