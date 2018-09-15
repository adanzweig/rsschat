import React, { Component, PropTypes } from 'react';
import MessageComposer from './MessageComposer';
import MessageListItem from './MessageListItem';
import Channels from './Channels';
import * as actions from '../actions/actions';
import * as authActions from '../actions/authActions';
import TypingListItem from './TypingListItem';

import { Modal, DropdownButton, MenuItem, Button, Navbar, NavDropdown, Nav, NavItem } from 'react-bootstrap';

export default class Chat extends Component {

  static propTypes = {
    messages: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    channels: PropTypes.array.isRequired,
    allChannels: PropTypes.array.isRequired,
    activeChannel: PropTypes.string.isRequired,
    typers: PropTypes.array.isRequired,
    socket: PropTypes.object.isRequired
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      privateChannelModal: false,
      targetedUser: '',
      showMembersModal:false,
    }

  }
  componentDidMount() {
    const { socket, user, dispatch } = this.props;
    socket.emit('chat mounted', user);
    socket.on('new bc message', msg =>
      dispatch(actions.receiveRawMessage(msg))
    );
    socket.on('typing bc', user =>
      dispatch(actions.typing(user))
    );
    socket.on('stop typing bc', user =>
      dispatch(actions.stopTyping(user))
    );
    socket.on('new channel', channel =>
      dispatch(actions.receiveRawChannel(channel))
    );
    socket.on('receive socket', socketID =>
      dispatch(authActions.receiveSocket(socketID))
    );
    socket.on('receive private channel', channel =>
      dispatch(actions.receiveRawChannel(channel))
    );
    
  }
  componentDidUpdate() {
    const messageList = this.refs.messageList;
    messageList.scrollTop = messageList.scrollHeight;
  }
  handleSave(newMessage) {
    const { dispatch } = this.props;
    if (newMessage.type != 'text' || newMessage.text.length > 0) {
      dispatch(actions.createMessage(newMessage));
    }
  }
  handleSignOut() {
    const { dispatch } = this.props;
    dispatch(authActions.signOut());
  }
  changeActiveChannel(channel) {
    const { socket, activeChannel, dispatch } = this.props;
    socket.emit('leave channel', activeChannel);
    socket.emit('join channel', channel);
    dispatch(actions.changeChannel(channel));
    dispatch(actions.fetchMessages(channel.name));
    console.log(activeChannel);
  }
  handleClickOnUser(user) {
    this.setState({ privateChannelModal: true, targetedUser: user });
  }
  closePrivateChannelModal(event) {
    event.preventDefault();
    this.setState({privateChannelModal: false});
  }
  closeMembersModal(event){
   event.preventDefault();
    this.setState({showMembersModal: false}); 
  }
  openMembersModal(event){
   event.preventDefault();
    this.setState({showMembersModal: true}); 
  }
  handleSendDirectMessage() {
    const { dispatch, socket, channels, user,allChannels } = this.props;
    const doesPrivateChannelExist = channels.filter(item => {
      return item.name === (`${this.state.targetedUser.username}+${user.username}` || `${user.username}+${this.state.targetedUser.username}`)
    })
    if (user.username !== this.state.targetedUser.username && doesPrivateChannelExist.length === 0) {
      const newChannel = {
        name: `${this.state.targetedUser.username}+${user.username}`,
        key: Date.now(),
        private: true,
        between: [this.state.targetedUser.username, user.username]
      };
      dispatch(actions.createChannel(newChannel));
      this.changeActiveChannel(newChannel);
      socket.emit('new private channel', this.state.targetedUser.socketID, newChannel);
    }
    if(doesPrivateChannelExist.length > 0) {
      this.changeActiveChannel(doesPrivateChannelExist[0]);
    }
    this.setState({ privateChannelModal: false, targetedUser: '' });
  }
  render() {
    const { messages, socket, channels, allChannels ,activeChannel, typers, dispatch, user, screenWidth} = this.props;
    const filteredMessages = messages.filter(message => message.channelID === activeChannel);
    const username = this.props.user.username;
    const dropDownMenu = (
      <div style={{'width': '21rem', 'top': '0', alignSelf: 'baseline', padding: '0', margin: '0', order: '1'}}>
        <DropdownButton key={1} style={{'width': '21rem'}} id="user-menu"  bsSize="large" bsStyle="primary" title={username}>
          <MenuItem style={{'width': '21rem'}} eventKey="4" onSelect={::this.handleSignOut}>Sign out</MenuItem>
        </DropdownButton>
      </div>
    );
    const PrivateMessageModal = (
      <div>
        <Modal bsSize="small" key={1} show={this.state.privateChannelModal} onHide={::this.closePrivateChannelModal}>
        <Modal.Header>
          {this.state.targetedUser.username}
        </Modal.Header>
        <Modal.Body>
          <Button onClick={this.handleSendDirectMessage.bind(this)}>
            Direct Message
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.closePrivateChannelModal.bind(this)}>
            Close
          </Button>
        </Modal.Footer>
        </Modal>
      </div>
    );
    const mobileNav = (
      <Navbar fixedTop style={{background: '#337ab7', color: 'white'}}>
          <span style={{fontSize: '2em'}}>{username}</span>
          <Navbar.Toggle />
        <Navbar.Collapse style={{maxHeight: '100%'}}>
          <Button bsStyle="primary" onSelect={::this.handleSignOut}> Sign out
          </Button>
          <section style={{order: '2', marginTop: '1.5em'}}>
            <Channels user={user} socket={socket} onClick={::this.changeActiveChannel} allChannels={allChannels} channels={channels} messages={messages} dispatch={dispatch} />
          </section>
        </Navbar.Collapse>
      </Navbar>
    );
    const usersModal = (
      <span>
      {channels.find(c => c.name === activeChannel)?(<div>
        <Modal key={1} show={this.state.showMembersModal} onHide={::this.closeMembersModal}>
          <Modal.Header closeButton>
            <Modal.Title>Channel members</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ul style={{display: 'flex', flexDirection: 'column', listStyle: 'none', margin: '0', overflowY: 'auto', padding: '0'}}>
              {channels.find(c=>c.name === activeChannel).between.map((user,i)=>{
                return (<li>{user}</li>)
              })}
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={::this.closeMembersModal}>Cancel</Button>
          </Modal.Footer>
          </Modal>
      </div>):(<span></span>)}
      </span>
      );
    const bigNav = (
      <div className="nav">
        {dropDownMenu}
        <section style={{order: '2', marginTop: '1.5em'}}>
          <Channels user={user} socket={socket} onClick={::this.changeActiveChannel} allChannels={allChannels} channels={channels} messages={messages} dispatch={dispatch} />
        </section>
      </div>
    );
    return (
      <div style={{margin: '0', padding: '0', height: '100%', width: '100%', display: '-webkit-box'}}>
        {screenWidth < 500 ? mobileNav : bigNav }
        <div className="main">
          <header style={{background: '#FFFFFF', color: 'black', flexGrow: '0', order: '0', fontSize: '2.3em', paddingLeft: '0.2em'}}>
            <div className="col-md-10">
            {activeChannel}
            </div>
            <div className="col-md-2">

            <button className="btn btn-default" onClick={::this.openMembersModal}><i className="fa fa-users">{usersModal}</i></button>
            </div>
          </header>
          {PrivateMessageModal}
          <ul style={{wordWrap: 'break-word', margin: '0', overflowY: 'auto', paddingBottom: '1em', flexGrow: '0.8', order: '1'}} ref="messageList">
            {filteredMessages.map(message =>
              <MessageListItem handleClickOnUser={::this.handleClickOnUser} message={message} key={message.id} />
            )}
          </ul>
          <MessageComposer socket={socket} activeChannel={activeChannel} user={user} onSave={::this.handleSave} />
        </div>
        <footer style={{fontSize: '1em', position: 'fixed', bottom: '0.2em', left: '21.5rem', color: '#000000', width: '100%', opacity: '0.5'}}>
          {typers.length === 1 &&
            <div>
              <span>
                <TypingListItem username={typers[0]} key={1}/>
                <span> is typing</span>
              </span>
            </div>}
          {typers.length === 2 &&
          <div>
            <span>
              <TypingListItem username={typers[0]} key={1}/>
              <span> and </span>
              <TypingListItem username={typers[1]} key={2}/>
              <span> are typing</span>
            </span>
          </div>}
          {typers.length > 2 &&
          <div>
            <span>Several people are typing</span>
          </div>}
        </footer>
      </div>
    );
  }
}
