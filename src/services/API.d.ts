declare namespace API {
  export interface CurrentUser {
    fullName?: string;
    avatar?: string;
    name?: string;
    title?: string;
    group?: string;
    signature?: string;
    tags?: {
      key: string;
      label: string;
    }[];
    userid?: string;
    access?: 'user' | 'guest' | 'admin';
    unreadCount?: number;
  }

  export interface LoginStateType {
    success?: true | false;
    type?: string;
    failMessage?: string;
  }

  export interface NoticeIconData {
    id: string;
    key: string;
    avatar: string;
    title: string;
    datetime: string;
    type: string;
    read?: boolean;
    description: string;
    clickClose?: boolean;
    extra: any;
    status: string;
  }

  // 新增
  export interface httpRule{
    success?: boolean,
    data?: any,
    errorCode?: number,
    errorMessage?: string,
    showType?: number,
    traceId?: string,
    host?: string
  }
}
