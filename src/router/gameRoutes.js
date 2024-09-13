export const PuzzleRoute = {
  path: '/game/puzzle',
  component: () => import('@/views/puzzle/PuzzleBoard.vue')
}

export default [PuzzleRoute]
