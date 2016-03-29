import React from 'react'
import Rebase from 're-base';
import graph from 'fb-react-sdk';
import AddFriends from './AddFriends'
import FriendList from './FriendList'
import SelectedFriend from './SelectedFriend'
import mui from 'material-ui'
import {AppCanvas, AppBar, Avatar, CardTitle, CircularProgress, Card, CardMedia, CardHeader, TextField, List, ListItem, RaisedButton, CardText, FloatingActionButton} from 'material-ui'
import IconButton from 'material-ui/lib/icon-button';
import Avamar from 'material-ui/lib/avatar';
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/lib/menus/menu-item';

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
      <div>
          <AppBar
            title="Keepup"
            iconElementLeft={<div></div>}
          />
          <AppCanvas>
            {hasFriends}
          </AppCanvas>
      </div>
    )
  }
})