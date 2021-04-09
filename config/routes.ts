export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          },
        ],
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
    ],
  },
  {
    path: '/systemManage',
    name: 'systemManage',
    icon: 'crown',
    routes: [
      {
        path: '/systemManage',
        redirect: '/systemManage/welcome',
      },
      {
        path: '/systemManage/welcome',
        name: 'welcome',
        hideInMenu: true,
        component: './systemManage/welcome',
      },
      {
        path: '/systemManage/userInfoList',
        name: 'userInfoList',
        icon: 'smile',
        access: 'normalRouteFilter',
        component: './systemManage/userInfoList',
      },
      {
        path: '/systemManage/roleInfoList',
        name: 'roleInfoList',
        icon: 'smile',
        access: 'normalRouteFilter',
        component: './systemManage/roleInfoList',
      },
      {
        path: '/systemManage/dictionaryTypeList',
        name: 'dictionaryTypeList',
        icon: 'smile',
        access: 'normalRouteFilter',
        component: './systemManage/dictionaryTypeList',
      },
      {
        path: '/systemManage/dictionaryInfoList',
        name: 'dictionaryInfoList',
        hideInMenu: true,
        access: 'normalRouteFilter',
        component: './systemManage/dictionaryInfoList',
      },
      // 菜单管理
      {
        path: '/systemManage/menuInfoList',
        name: 'menuInfoList',
        icon: 'smile',
        access: 'normalRouteFilter',
        component: './systemManage/menuInfoList',
      },
      {
        path: '/systemManage/moduleInfoList',
        name: 'moduleInfoList',
        icon: 'smile',
        access: 'normalRouteFilter',
        component: './systemManage/moduleInfoList',
      },
      {
        path: '/systemManage/moduleElementList',
        name: 'moduleElementList',
        icon: 'smile',
        access: 'normalRouteFilter',
        component: './systemManage/moduleElementList',
      },
      {
        path: '/systemManage/authorityInfoList',
        name: 'authorityInfoList',
        icon: 'smile',
        access: 'normalRouteFilter',
        component: './systemManage/authorityInfoList',
      },
    ],
  },
  {
    path:'/orgcenter',
    name:'orgcenter',
    icon: 'dashboard',
    routes: [
      {
        path: '/orgcenter',
        redirect: '/orgcenter/welcome',
      },
      {
        path: '/orgcenter/welcome',
        name: 'welcome',
        hideInMenu: true,
        component: './orgcenter/welcome',
      },
      {
        path: '/orgcenter/orgstructInfoList',
        name: 'orgstructInfoList',
        access: 'normalRouteFilter',
        component: './orgcenter/orgstructInfoList',
      },
    ]
  },
  {
    path:'/integrate',
    name:'integrate',
    icon: 'dashboard',
    routes: [
      {
        path: '/integrate',
        redirect: '/integrate/welcome',
      },
      {
        path: '/integrate/jobAndTriggerInfoList',
        name: 'jobAndTriggerInfoList',
        access: 'normalRouteFilter',
        component: './integrate/jobAndTriggerInfoList',
      },
    ]
  },
  {
    path:'/account',
    name:'account',
    icon: 'dashboard',
    routes: [
      {
        path: '/account',
        redirect: '/account/welcome',
      },
      {
        path: '/account/settings',
        name: 'settings',
        access: 'normalRouteFilter',
        component: './account/settings',
      },
    ]
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
