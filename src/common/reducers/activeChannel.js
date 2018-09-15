import { CHANGE_CHANNEL } from '../constants/ActionTypes';

const initialState = {
  name: 'Lobby',
  key: 0,
  between: [],
  owner: ''
};

export default function activeChannel(state = initialState, action) {
  switch (action.type) {
  case CHANGE_CHANNEL:
    return {
      name: action.channel.name,
      key: action.channel.key,
      between: action.channel.between,
      owner: action.channel.owner
    };

  default:
    return state;
  }
}
