import { RouteRecordRaw } from "vue-router";
import Home from "../screens/home/index.vue";
import Login from "../screens/login/index.vue";
import JoinMeeting from "../screens/join-meeting/index.vue";
import Meeting from "../screens/meeting/index.vue";
import Settings from "../screens/settings/index.vue";

export const routes: RouteRecordRaw[] = [
  {
    path: "/home",
    name: "home",
    component: Home,
  },
  {
    path: "/",
    name: "login",
    component: Login,
  },
  {
    path: "/join-meeting",
    name: "joinMeeting",
    component: JoinMeeting,
  },
  {
    path: "/meeting",
    name: "meeting",
    component: Meeting,
  },
  {
    path: "/settings",
    name: "settings",
    component: Settings,
  },
];
