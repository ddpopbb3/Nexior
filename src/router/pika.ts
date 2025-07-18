import { ROUTE_PIKA_INDEX } from './constants';

export default {
  path: '/pika',
  meta: {
    auth: true,
    appName: 'pika'
  },
  component: () => import('@/layouts/Main.vue'),
  children: [
    {
      path: '',
      name: ROUTE_PIKA_INDEX,
      component: () => import('@/pages/pika/Index.vue')
    }
  ]
};
