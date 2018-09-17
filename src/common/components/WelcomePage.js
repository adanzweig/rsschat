import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import {welcomePage} from '../actions/actions';
import { connect } from 'react-redux';
import { Input, Button } from 'react-bootstrap';
import SignIn from './SignIn';
import GoogleLoginButton from 'react-google-login-button'


class WelcomePage extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      username: ''
    };
  }
  componentDidMount() {
    this.refs.usernameInput.getInputDOMNode().focus();

  }
  handleChange(event) {
    if (event.target.name === 'username') {
      this.setState({ username: event.target.value });
    }
  }
  responseGoogle (googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    var googleId = googleUser.getId();
    
    console.log({ googleId });
    console.log({accessToken: id_token});

     const { dispatch } = this.props;
    const username = this.state.username;
    dispatch(welcomePage(username));
    this.setState({ username: '' });

      // const userObj = {
      //   username: this.state.username,
      //   password: this.state.password,
      //   confirmPassword: this.state.confirmPassword
      // };
      // dispatch(authActions.signUp(userObj))
      // dispatch(actions.joinChannel(userObj.username,0))

  }
  handleSubmit() {
    const { dispatch } = this.props;
    const username = this.state.username;
    dispatch(welcomePage(username));
    this.setState({ username: '' });
  }
  render() {
  
    const {screenWidth} = this.props;
    if(screenWidth < 500) {
      return (
        <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
          <header style={{textAlign: 'center'}}>
            <p>Welcome to the chat</p>
          </header>
          <main>
          <form>
          <GoogleLoginButton googleClientId="344356196520-khjcg06k3rb3d7l2gpma2bobiuf79gnl.apps.googleusercontent.com"
                     onLoginSuccess={this.responseGoogle}
                     onLoginFailure={() => console.log('Login failed')}
                     width={140}
                      height={40}
                      longTitle={false}
                      theme="light"
                     />
          <Input
            style={{height: '2.7em', fontSize: '1.3em', width: '100%'}}
            ref="usernameInput"
            type="text"
            name="username"
            value={this.state.username}
            placeholder="Enter username"
            onChange={::this.handleChange}
          />
            <Link to="/signup">
              <Button
                bsStyle="success"
                style={{width: '100%'}}
                type="submit"
                onClick={::this.handleSubmit}>
                  <p style={{margin: '0', padding: '0', fontSize: '1.5em'}}>Sign Up</p>
              </Button>
            </Link>
            </form>
            <p style={{margin: '1em', textAlign: 'center'}}>Or</p>
            <Link to="/signin">
              <Button style={{width: '100%'}} bsStyle="default" >Sign in</Button>
            </Link>
          </main>
        </div>
      );
    }
    return (
      <div>
        <header style={{display: 'flex', justifyContent: 'center', flexGrow: '0', order: '0'}}>
          <div style={{justifyContent: 'center'}}><p style={{fontSize: '1.5em', marginRight: '1em'}}>Welcome to the Chat</p>
           
          </div>
        </header>
        <main style={{display: 'flex', justifyContent: 'center'}}>

          <form style={{height: '20rem', display: 'flex', justifyContent: 'center'}}>
            <div style={{margin: 'auto', paddingRight: '0.2em', height: '3.5em'}}>
              <Input
                style={{height: '2.7em', fontSize: '1.3em',display:'none'}}
                ref="usernameInput"
                type="text"
                name="username"
                value={this.state.username}
                placeholder="Enter username"
                onChange={::this.handleChange}
              />
            </div>
            <section style={{margin: 'auto', width: '12em', height: '3.5em'}}>
              <Link to="/signup">
                <Button
                  bsStyle="success"
                  style={{margin: 'auto', width: '12em', height: '3.5em'}}
                  type="submit"
                  onClick={::this.handleSubmit}>
                    <p style={{margin: '0', padding: '0', fontSize: '1.5em'}}>Sign Up</p>
                </Button>
              </Link>
            </section>
          </form>
          <div style={{height: '3.5em', width: '12em', alignSelf: 'center', display: 'flex', marginLeft: '1em'}}>
            <p style={{marginRight: '1em', marginTop: '1em'}}> Or </p>
            <Link to="/signin">
              <Button style={{margin: 'auto', height: '3.5em'}} bsStyle="default" >Sign in</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
      screenWidth: state.environment.screenWidth
  }
}

export default connect(mapStateToProps)(WelcomePage)
