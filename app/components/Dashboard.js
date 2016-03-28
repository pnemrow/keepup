import React from 'react'
import Rebase from 're-base';
import graph from 'fb-react-sdk';
import AddFriends from './AddFriends'
import FriendList from './FriendList'
import SelectedFriend from './SelectedFriend'
import mui from 'material-ui'
import {CardTitle, CircularProgress, Card, CardMedia, Avatar, CardHeader, TextField, List, ListItem, RaisedButton, CardText, FloatingActionButton} from 'material-ui'

export default React.createClass({
  propTypes: {
    userData: React.PropTypes.object.isRequired,
    handleGetFriends: React.PropTypes.func.isRequired
  },

  getInitialState(){
    return {
      selectedFriend : {}
    }
  },

  friendSelected(selectedFriend) {
    console.log('gonna set state.', Date.now())
    this.setState({selectedFriend})
  },

  render() {
    var hasFriends = this.props.userData.friendList ?
      <div>
        <FriendList userData={this.props.userData} friendSelected={this.friendSelected}/>
        <SelectedFriend selectedFriend={this.state.selectedFriend}/>
      </div> :
      <AddFriends userData={this.props.userData} handleGetFriends={this.props.handleGetFriends} />

    return (
      <div className="row">
        <div>
          {hasFriends}
        </div>
      </div>
    )
  }
})