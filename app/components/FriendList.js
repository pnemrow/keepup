import React from 'react'
import mui from 'material-ui'
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import MyRawTheme from '../config/customTheme.js';

import {List, ListItem, Avatar, LeftNav} from 'material-ui'

let zIndex = {
    zIndex: {
      leftNavOverlay: 1000,
      leftNav: 1000
    }
};

export default React.createClass({
  propTypes: {
    userData: React.PropTypes.object.isRequired,
    friendSelected: React.PropTypes.func.isRequired,
  },
  
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext() {
    return {
      muiTheme: getMuiTheme(MyRawTheme, zIndex)
    } 
  },

  render() {
    return (
      <LeftNav className={'sideNav'} width={350} open={true}>
        <List>
          {this.props.userData.friendList.map((friend) => (
            <ListItem
              key={friend.id}
              primaryText={friend.name}
              insetChildren={true}
              onTouchStart={() => {this.props.friendSelected(friend)}}
              onTouchTap={() => {this.props.friendSelected(friend)}}
              onClick={() => {console.log('clicked',Date.now());this.props.friendSelected(friend)}}
              rightAvatar={<Avatar src={friend.pictureUrl} />}
            />
          ))}
        </List>
      </LeftNav>
    )
  }
})