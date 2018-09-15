import { ADD_CHANNEL, RECEIVE_CHANNEL,RECEIVE_MEMBER_CHANNEL, LOAD_CHANNELS, JOIN_CHANNEL,LOAD_CHANNELS_SUCCESS, LOAD_CHANNELS_FAIL, AUTH_SIGNOUT_SUCCESS} from '../constants/ActionTypes';

const initialState = {
  loaded: false,
  data: []
};

export default function channels(state = initialState, action) {
  switch (action.type) {
  case JOIN_CHANNEL:
   return {...state,
      loading: true
    };
  case RECEIVE_CHANNEL:
    if (state.data.filter(channel => channel.name === action.channel.name).length !== 0) {
      return state;
    }
    return {...state,
      data: [...state.data, action.channel]
    };
  case RECEIVE_MEMBER_CHANNEL:
    if (state.data.filter(channel => channel.name === action.channel.name).length !== 0) {
      return state;
    }
    return {...state,
      data: [...state.data, action.channel]
    };
  case LOAD_CHANNELS:
    return {...state,
      loading: true
    };
  case LOAD_CHANNELS_SUCCESS:
    return {
      loading: false,
      loaded: true,
      data: action.json
    };
  case LOAD_CHANNELS_FAIL:
    return {...state,
      loading: false,
      loaded: false,
      error: action.error,
      data: [...state.data]
    };
  case AUTH_SIGNOUT_SUCCESS:
    return {
      loaded: false,
      data: []
    };
  default:
    return state;
  }
}
