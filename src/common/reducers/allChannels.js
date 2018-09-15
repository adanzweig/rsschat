import { ADD_CHANNEL, RECEIVE_CHANNEL,RECEIVE_MEMBER_CHANNEL,  LOAD_ALL_CHANNELS,LOAD_ALL_CHANNELS_SUCCESS,LOAD_ALL_CHANNELS_FAIL, REQ_DEL_CHANNEL,REMOVE_CHANNEL} from '../constants/ActionTypes';

const initialState = {
  loaded: false,
  data: []
};

export default function allChannels(state = initialState, action) {
  switch (action.type) {
  case ADD_CHANNEL:
    if (state.data.filter(channel => channel.name === action.channel.name).length !== 0) {
      return state;
    }
    return {...state,
      data: [...state.data, action.channel]
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
  case LOAD_ALL_CHANNELS:
    return {...state,
      loading: true
    };
  case REMOVE_CHANNEL:
    return {
      loading: false,
      loaded: true,
      data: action.json
    };
  case REQ_DEL_CHANNEL:
    return {
      loaded: true,
      data: []
    };
  case LOAD_ALL_CHANNELS_SUCCESS:
    return {...state,
      loading: false,
      loaded: true,
      data: [...state.data, ...action.json]
    };
 case LOAD_ALL_CHANNELS_FAIL:
    return {...state,
      loading: false,
      loaded: false,
      error: action.error,
      data: [...state.data]
    };
  default:
    return state;
  }
}
