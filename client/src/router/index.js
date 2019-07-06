import Vue from "vue";
import Router from "vue-router";
import Landing from '@/components/Layout/Landing.vue'
import Register from '@/components/Auth/Register.vue'
import Login from '@/components/Auth/Login.vue'

Vue.use(Router);


export default new Router({
    routes: [
        {
            path: "/",
            name: 'Landing',
            component: Landing
        },
        {
            path: "/register",
            name: 'Register',
            component: Register
        },
        {
            path: "/login",
            name: 'Login',
            component: Login
        }
    ]
});
