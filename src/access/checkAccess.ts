import ACCESS_ENUM from "@/access/accessEnum";

/**
 * 校验当前用户是否具有某个权限
 * @param loginUser
 * @param needAccess
 * @return boolean
 */
export const checkAccess = (
  loginUser: { userRole: string },
  needAccess = ACCESS_ENUM.NOT_LOGIN
) => {
  // 当前登录用户所需要的权限
  const loginUserAccess = loginUser.userRole ?? ACCESS_ENUM.NOT_LOGIN;
  switch (needAccess) {
    case ACCESS_ENUM.NOT_LOGIN:
      return true;
    case ACCESS_ENUM.USER:
      return loginUserAccess !== ACCESS_ENUM.NOT_LOGIN;
    case ACCESS_ENUM.ADMIN:
      return loginUserAccess === ACCESS_ENUM.ADMIN;
    default:
      return false;
  }
};

export default checkAccess;
