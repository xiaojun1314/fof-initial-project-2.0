import type { Effect, Reducer } from 'umi';
import { queryUserList } from './service';
import type { UserInfoData } from './data.d';

export interface StateType {
  data: UserInfoData;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'userInfoList',
  state: {
    data: {
      list: [],
      pagination: {},
    }
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryUserList, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
    }
  },
  reducers: {
    queryList(state: any, action: any) {
      return {
        ...state,
        data: action.payload,
      };
    }
  },
};

export default Model;
