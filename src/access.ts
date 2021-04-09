/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser | undefined,leafMenuData?: any,elementCodeData?: any }) {
  const { currentUser,leafMenuData,elementCodeData} = initialState || {};

  return {
    canAdmin: currentUser && currentUser.access === 'admin',
    elementAccess: (data: any) => elementCodeData.includes(data),
    normalRouteFilter:(route: { name: any; }) => {
      const newArr =   leafMenuData.filter((item: any)=>{
        return item.name === route.name;
      });
      return newArr.length;
    }
  };

}
