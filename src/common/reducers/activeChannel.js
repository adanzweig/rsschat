import { CHANGE_CHANNEL } from '../constants/ActionTypes';

const initialState = {
  name: 'Lobby',
  id: 0,
  between: [],
  owner: ''
};

export default function activeChannel(state = initialState, action) {
  switch (action.type) {
  case CHANGE_CHANNEL:
    return {
      name: action.channel.name,
      id: action.channel.id,
      between: action.channel.between,
      owner: action.channel.owner
    };

  default:
    return state;
  }
}
