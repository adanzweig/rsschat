import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Input } from 'react-bootstrap';
import uuid from 'node-uuid';
import GifBox from "./GifBox";
import Picker from 'react-emojipicker'
import ReactDOM from 'react-dom'
export default class MessageComposer extends Component {

  static propTypes = {
    activeChannel: PropTypes.string.isRequired,
    onSave: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    socket: PropTypes.object.isRequired
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      text: '',
      typing: false,
      emoji:false,
      gif: false,
      user: this.props.user,
      activeChannel: this.props.activeChannel,
      socket:this.props.socket
    };

    
  }
  handleSubmit(event) {
    console.log(event)
    if (event.which === 13) {
      event.preventDefault();
      var text = this.state.text.trim();
      this.sendMessage({
            type : 'text',
            text : text
        })
    }
  }
  sendMessage(message){
    const { socket, user, activeChannel } = this.props;
    if(message.type == 'gif'){
      this.toggleGif();
    }
    var newMessage = {
        id: `${Date.now()}${uuid.v4()}`,
        channelID: activeChannel,
        text: message.text,
        type: message.type,
        user: user,
        time: moment.utc().format('lll')
      };
    socket.emit('new message', newMessage);
    socket.emit('stop typing', { user: user.username, channel: activeChannel });
    this.props.onSave(newMessage);
    this.setState({ text: '', typing: false });
  }
  handleChange(event) {
    const { socket, user, activeChannel } = this.props;
    this.setState({ text: event.target.value });
    if (event.target.value.length > 0 && !this.state.typing) {
      socket.emit('typing', { user: user.username, channel: activeChannel });
      this.setState({ typing: true});
    }
    if (event.target.value.length === 0 && this.state.typing) {
      socket.emit('stop typing', { user: user.username, channel: activeChannel });
      this.setState({ typing: false});
    }
  }

  assignHeight(){
      let chat_height = this.state.gif ? 200 : 35;
      let _docHeight = (document.height !== undefined) ? document.height : document.body.offsetHeight;
      this.setState({
          height : _docHeight - 65 - chat_height
      });
    }
  toggleGif(e){
      this.setState({
          gif : !this.state.gif
      }, () => {
          this.assignHeight();
      });
  }
  toggleEmoji(e){
      this.setState({
          emoji : !this.state.emoji
      }, () => {
          this.assignHeight();
      });
  }
  closeEmoji(e){
      this.setState({
          emoji : false
      }, () => {
          this.assignHeight();
      });
  }
  logEmoji (emoji) {
    console.log(emoji);
    this.setState({text:this.state.text+emoji.unicode})
    toggleEmoji();
  }
  render() {
    return (

      <div style={{
        zIndex: '52',
        left: '21.1rem',
        right: '1rem',
        flexShrink: '0',
        order: '2',
        marginTop: '0.5em'
      }}>
    
        
        {
          this.state.gif ? (<span></span>):
        (<div className="container">
          <div className="col-md-10">
            <Input
              style={{
                height: '100%',
                fontSize: '2em',
              }}
              type="textarea"
              name="message"
              ref="messageComposer"
              autoFocus="true"
              placeholder="Type here to chat!"
              value={this.state.text}
              onFocus={this.closeEmoji.bind(this)}
              onChange={::this.handleChange}
              onKeyDown={::this.handleSubmit}/>
        </div>
        <div className="col-md-2">

            <div>
              <button onClick={this.toggleEmoji.bind(this)} className="btn btn-default gifButton form-control"><i className="fa fa-smile"></i></button>
            </div>
        
          <div>
            <button onClick={this.toggleGif.bind(this)} className="btn btn-default gifButton form-control">GIF</button>
          </div>
        
        </div>
          {
          this.state.emoji ? (<Picker onEmojiSelected={this.logEmoji.bind(this)} />):(<span></span>)
                
              }

        </div>)
  }
        {
          this.state.gif ? (
            <div className="col-md-12">
               <GifBox
              sendMessage={this.sendMessage.bind(this)}
              toggleGif={this.toggleGif.bind(this)}/>
        </div>
        ):(<span></span>)}
        
        
    
      </div>
    );
  }
}