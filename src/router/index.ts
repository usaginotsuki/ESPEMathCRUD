import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import { getAuth } from "firebase/auth";

const routes = [
  {
    path: "/",
    name: "login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "register",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/RegisterView.vue"),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/DashboardView.vue"),
    meta: {
      //authRequired: true,
    },
  },
  {
    path: "/unidad/:id",
    props: { default: true, sidebar: false },
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/TopicView/[id].vue"),
    meta: {
      //authRequired: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = getAuth();
  console.log(auth.currentUser)
  if (to.matched.some((record) => record.meta.authRequired)) {
    if (auth.currentUser) {
      next();
    } else {
      alert("You've must been logged to access this area");
      router.push("/");
    }
  } else {
    next();
  }
});

export default router;
