import React, { PropTypes } from 'react';
import classnames from 'classnames';
import { Button } from 'react-bootstrap';


const ChannelListItem = (props) => {
 
  const { channel: selectedChannel, onClick, channel,deleteChannel,user } = props;
  return (

    <Button bsSize="xsmall" bsStyle="primary" >
    <div className="col-md-10">
      <a className={classnames({ selected: channel === selectedChannel })}
         style={{ cursor: 'hand', color: 'white'}}
         onClick={() => onClick(channel)}>
        <li style={{textAlign: 'left', cursor: 'pointer', marginLeft: '2em'}}>
          <p>{channel.name}</p>
        </li>
      </a>
      </div>
      {user.username == channel.owner ?
        (<div className="col-md-2">
          <a className="deleteKey" onClick={() => deleteChannel(channel)}>X</a>
       </div>):
        (<span></span>)}
      
    </Button>
  );
}

ChannelListItem.propTypes = {
  channel: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
}

export default ChannelListItem;
