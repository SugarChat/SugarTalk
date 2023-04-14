import { RouteRecordRaw } from "vue-router";
import Home from "../screens/home/index.vue";
import Login from "../screens/login/index.vue";
import JoinRoom from "../screens/join-room/index.vue";
import Room from "../screens/room/index.vue";

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
    path: "/join-room",
    name: "joinRoom",
    component: JoinRoom,
  },
  {
    path: "/room",
    name: "room",
    component: Room,
  },
];
