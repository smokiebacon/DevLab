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
          <a href="register.html" class="btn btn-primary">Sign Up</a>
          <a href="login.html" class="btn btn-light">Login</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {};
</script>


<style scoped>
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
