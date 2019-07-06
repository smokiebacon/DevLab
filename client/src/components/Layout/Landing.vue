<template>
  <section class="landing">
    <div class="dark-overlay">
      <div class="landing-inner">
        <h1 class="x-large">Developer Connector</h1>
        <p class="lead">
          Create a developer profile/portfolio, share posts and get help from
          other developers
        </p>
        <div class="buttons">
          <router-link class="btn btn-primary" to="/register">Register</router-link>
          <router-link class="btn btn-light" to="/login">Login</router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {};
</script>


<style>
.landing {
  position: relative;
  background: url("../../img/showcase.jpg") no-repeat center center/cover;
  height: 100vh;
}

.landing-inner {
  color: #fff;
  height: 100%;
  width: 80%;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.dark-overlay {
  background-color: rgba(0, 0, 0, 0.7);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
