import React from 'react'
import mui from 'material-ui'
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import SelectableContainerEnhance from 'material-ui/lib/hoc/selectable-enhance'
import MyRawTheme from '../config/customTheme.js';

import {List, ListItem, Avatar, LeftNav, TextField} from 'material-ui'
let SelectableList = SelectableContainerEnhance(List);
let zIndex = {
    zIndex: {
      leftNavOverlay: 1000,
      leftNav: 1000
    }
};

export default React.createClass({

  getInitialState(){
    return {
      friendList: this.buildElements(0, 50),
      isLoading: false,
      isFiltered: false
    }
  },

  propTypes: {
    userData: React.PropTypes.object.isRequired,
    friendSelected: React.PropTypes.func.isRequired,
  },
  
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  loadMore() {
    console.log('hello?')
    var that = this;
    this.setState({
        isLoading: true
    });
    setTimeout(function() {
        var friendListLength = that.state.friendList.length,
            newElements = that.buildElements(friendListLength, friendListLength + 50);
        that.setState({
            isLoading: false,
            friendList: that.state.friendList.concat(newElements)
        });
    }, 2500);
  },

  buildElements: function(start, end) {
    var elements = [];
    for (var i = start; i < end; i++) {
        elements.push(this.props.userData.friendList[i])
    }
    return elements;
  },

  filterFriends() {
    var search = this.refs.searchTerm.input.value
    if(search.length < 3) {
      return this.setState({friendList: this.buildElements(0, 50), isFiltered: false})
    }
    var filteredFriends = this.props.userData.friendList.filter((friend) => {
      return friend.name.toLowerCase().indexOf(search.toLowerCase()) > -1
    })

    this.setState({friendList: filteredFriends, isFiltered: true})
  },

  getChildContext() {
    return {
      muiTheme: getMuiTheme(MyRawTheme, zIndex)
    } 
  },

  render() {
    var loadElement = this.state.isLoading ? 
      <ListItem primaryText={"Loading"}/> :
      <ListItem
        primaryText={"View More"}
        onTouchStart={() => {this.loadMore}}
        onTouchTap={() => {this.loadMore}}
        onClick={this.loadMore}
      />

    loadElement = this.state.isFiltered ? <div></div> : loadElement
    return (
      <LeftNav className={'sideNav'} width={350} open={true}>
        <TextField
          hintText="Hint Text"
          floatingLabelText="Floating Label Text"
          style={{margin: '75px auto 0'}}
          fullWidth={true}
          ref='searchTerm'
          onChange={() => {this.filterFriends()}}
        />
        <List>
          {this.state.friendList.map((friend) => (
            <ListItem
              key={friend.id}
              primaryText={friend.name}
              insetChildren={true}
              onTouchStart={() => {this.props.friendSelected(friend)}}
              onTouchTap={() => {this.props.friendSelected(friend)}}
              onClick={() => {console.log('clicked',Date.now());this.props.friendSelected(friend)}}
              leftAvatar={<Avatar src={friend.pictureUrl} />}
            />
          ))}
          {loadElement}
        </List>
      </LeftNav>
    )
  }
})