import messages from './messages';
import channels from './channels';
import allChannels from './allChannels';
import activeChannel from './activeChannel';
import auth from './auth';
import typers from './typers';
import welcomePage from './welcomePage';
import userValidation from './userValidation';
import environment from './environment';
import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form'

const rootReducer = combineReducers({
  messages,
  channels,
  allChannels,
  activeChannel,
  auth,
  typers,
  welcomePage,
  userValidation,
  environment,
  formReducer
});

export default rootReducer;
