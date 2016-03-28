"use strict";
import React from 'react';
import Rebase from 're-base';
import graph from 'fb-react-sdk';
import promisify from 'es6-promisify';
import mui from 'material-ui'
import injectTapEventPlugin from 'react-tap-event-plugin'
import {RaisedButton, FontIcon, Paper} from 'material-ui'


const base = Rebase.createClass('https://brilliant-fire-3447.firebaseio.com/')

class Login extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      notes: [],
      bio: {},
      repos: [],
      objectArrays: [],
      friendArrays: [],
      friendList: [],
      friendMap: new Map()
    }
    this.authDataCallback = this.authDataCallback.bind(this);
  }
  
  handleLogin(){
    base.authWithOAuthPopup("facebook", this.authDataCallback, {
      remember: "sessionOnly",
      scope: "email,user_posts"
    });
  }

  authDataCallback(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      this.props.setUserAuth(authData)
      return
      
    }
  }


  render(){
    const style = {
      height: 100,
      width: 300,
      margin: 20,
      textAlign: 'center',
      display: 'inline-block',
    };
    return (
       <div className="main-container">
        <div className="col-sm-7 col-sm-offset-2" style={{marginTop: 15}}>
          <Paper style={style} zDepth={2}>
            <RaisedButton
              label="Login"
              onMouseDown={this.props.handleLogin}
              secondary={true}
              icon={<FontIcon class="fa fa-facebook"/>}
            />
          </Paper>
        
          <button type="button" onClick={this.props.handleLogin}>Login</button>
          <ul className="list-group">
            {this.state.friendList.map((friend) => (
              <li className="list-group-item" key={friend.id}><img height="75px" width="75px" src={friend.pictureUrl}></img>{friend.name} - likes: {friend.likeCount} - comments: {friend.commentCount}</li>
            ))}
          </ul>
        </div>
    </div>
    )
  }
}

export default Login