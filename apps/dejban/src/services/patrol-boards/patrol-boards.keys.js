// patrolBoards.keys.js
export const patrolBoardsKeys = {
  all: ['patrolBoards'],
  lists: () => [...patrolBoardsKeys.all, 'list'],
  list: (params) => [...patrolBoardsKeys.lists(), params],
  listWithoutPagination: (params) => [...patrolBoardsKeys.all, 'listWithoutPagination', params],
  personnels: (params) => [...patrolBoardsKeys.all, 'personnels', params],
  detail: (id) => [...patrolBoardsKeys.all, 'detail', id],
};
