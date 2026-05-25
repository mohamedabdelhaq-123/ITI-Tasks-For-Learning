import { createRouter, createWebHistory } from 'vue-router'
import AboutView from '@/pages/AboutView.vue'
import HomeView from '@/pages/HomeView.vue';

const routes=[
  {
    path:'/',
    component:HomeView, // eager loading
    name:'home' // to simplify nav. by name not path in routerlink
  },
  {
    path:'/about',
    component:AboutView, // eager loading
    name:'about'
  },
  {
    path:'/cart',
    component: () => import('@/pages/CartView.vue'), // lazy loading
    name:'cart'
  },
  {
    path:'/product/:id(\\d+)', // dynamic route with parameter
    component: () => import('@/pages/ProductView.vue'), // lazy loading
    name:'product'

  },
  {
    path: '/:catchAll(.*)*', // catch all route for 404 page
    component: () => import('@/pages/NotFound.vue'), // lazy loading 404 page
    name: 'not-found'
  }
];


// create instance of router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), //
  routes, // include the routes array here
})

// createWebHistory() _> url like /product/101, SEO friendly
// createWebHashHistory() -> url like /#/product/101
export default router


// why use router? -> to nav. btw pages in SPA without refreshing page (<a href...>), bec this breaks the spa
// so the repalce of <a> is <RouterLink to="/">HOme</RouterLink>>
// the component (placeholder) to reneder route is <RouterView/>
// to use object of current route $route (for all data needed about the exiting route for ex: fullpath,query,props,children,meta,params,....)


// to use router 
// 1. install vue router
// 2. create instance & routes & export instance
// 3. use in main.js (so RouterView and RouterLink work glob., use $router & $route glob, useRouter() & useRoute() work in setup() glob.)
// 2. put your routes in routes arr in index ()
// 3. 