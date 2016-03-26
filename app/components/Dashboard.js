import React from 'react'
import Rebase from 're-base';
import graph from 'fb-react-sdk';
import AddFriends from './AddFriends'

export default React.createClass({
  propTypes: {
    userData: React.PropTypes.object.isRequired,
    handleGetFriends: React.PropTypes.func.isRequired
  },

  render() {
    var hasFriends = this.props.userData.friendList ?
      <div>Got friends</div> :
      <AddFriends userData={this.props.userData} handleGetFriends={this.props.handleGetFriends} />

    return (
      <div className="row">
        <div className="col-md-12">
          {hasFriends}
        </div>
      </div>
    )
  }
})