import React, { PropTypes } from 'react';
import classnames from 'classnames';
import { Button } from 'react-bootstrap';


const AllChannelsListItem = (props) => {
 
  const { channel: selectedChannel, onClick, channel,deleteChannel,channels } = props;
  return (
    <span>
  {channels.find(c => c.id === channel.id)? (<span></span>):(
    <Button bsSize="xsmall" bsStyle="primary" >
      <a className={classnames({ selected: channel === selectedChannel })}
         style={{ cursor: 'hand', color: 'white'}}
         onClick={() => onClick(channel)}>
        <li style={{textAlign: 'left', cursor: 'pointer', marginLeft: '2em'}}>
          <h5>{channel.name}</h5>
        </li>
      </a>
      
    </Button>
    )}
  </span>
  );

}

AllChannelsListItem.propTypes = {
  channel: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
}

export default AllChannelsListItem;
