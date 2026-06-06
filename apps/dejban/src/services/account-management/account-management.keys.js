export const accountManagementKeys = {
  all: ['accountManagement'],
  users: () => [...accountManagementKeys.all, 'users'],
  userList: (params) => [...accountManagementKeys.users(), 'list', params],
  selectUsers: () => [...accountManagementKeys.all, 'selectUsers'],
  selectUserList: (params) => [...accountManagementKeys.selectUsers(), 'list', params],
  userRoles: () => [...accountManagementKeys.all, 'userRoles'],
  userRolesList: (params) => [...accountManagementKeys.userRoles(), 'list', params],
  userClaims: () => [...accountManagementKeys.all, 'userClaims'],
  userClaimsList: (params) => [...accountManagementKeys.userClaims(), 'list', params],
  activityHistory: () => [...accountManagementKeys.all, 'activityHistory'],
  activityHistoryList: (params) => [...accountManagementKeys.activityHistory(), 'list', params],

  // جدید
  usersWithSpecialClaim: () => [...accountManagementKeys.all, 'usersWithSpecialClaim'],
  usersWithSpecialClaimList: (params) => [
    ...accountManagementKeys.usersWithSpecialClaim(),
    'list',
    params,
  ],

  usersWithExcludedClaim: () => [...accountManagementKeys.all, 'usersWithExcludedClaim'],
  usersWithExcludedClaimList: (params) => [
    ...accountManagementKeys.usersWithExcludedClaim(),
    'list',
    params,
  ],

  userExcludedClaims: () => [...accountManagementKeys.all, 'userExcludedClaims'],
  userExcludedClaimsList: (params) => [
    ...accountManagementKeys.userExcludedClaims(),
    'list',
    params,
  ],

  detail: (id) => [...accountManagementKeys.all, 'detail', id],
};
