import { createRouter, createWebHashHistory } from "vue-router";

import CarFormStepOne from '../views/CarFormStepOne.vue';
import CarFormStepTwo from '../views/CarFormStepTwo.vue';
import Home from '../views/Home.vue';
// import Confirmation from '../views/Confirmation.vue';
// import MotorcycleForm from '../views/MotorcycleForm.vue';
// import PreviewForm from '../views/PreviewForm.vue';

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),

    routes: [
        {
            path: "/",
            name: "Home",
            component: Home,
            meta: { title: "首頁" },
        },
        {
            path: "/CarFormStepOne",
            name: "CarFormStepOne",
            component: CarFormStepOne,
            meta: { title: "汽車工單" },
        },
        {
            path: "/CarFormStepTwo",
            name: "CarFormStepTwo",
            component: CarFormStepTwo,
            meta: { title: "汽車工單" },
        },

    ],
});

export default router;