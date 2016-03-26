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
      <div><button type="button" onClick={this.props.handleGetFriends}>Login</button></div>

    return (
      <div className="row">
        <div className="col-md-12">
          <h2>Hey {this.props.userData.first_name} it looks like you havent imported your friends yet. Lets do that!</h2>
          <button type="button" onClick={this.props.handleGetFriends}>Import</button>
        </div>
      </div>
    )
  }
})