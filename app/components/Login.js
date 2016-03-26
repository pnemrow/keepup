"use strict";
import React from 'react';
import Rebase from 're-base';
import graph from 'fb-react-sdk';
import promisify from 'es6-promisify';


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
    return (
       <div className="main-container">
        <div className="col-sm-7 col-sm-offset-2" style={{marginTop: 15}}>
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