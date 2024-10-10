const MessyCodeRecoverRoute = {
  path: '/tools/messyCodeRecover',
  component: () => import('@/views/tools/messyCodeRecover/index.vue')
}

const GridPainterRoute = {
  path: '/tools/gridPainter',
  component: () => import('@/views/tools/gridPainter/index.vue')
}

const ImageServiceRoute = {
  path: '/tools/imageService',
  component: () => import('@/views/tools/imageService/index.vue')
}

const SimpleClockRoute = {
  path: '/tools/simpleClock',
  component: () => import('@/views/tools/simpleClock/index.vue')
}

export default [MessyCodeRecoverRoute, GridPainterRoute, ImageServiceRoute, SimpleClockRoute]
