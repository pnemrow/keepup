import React from 'react'
import Rebase from 're-base';
import graph from 'fb-react-sdk';
import promisify from 'es6-promisify';

import Login from './Login';
import Dashboard from './Dashboard';

const base = Rebase.createClass('https://brilliant-fire-3447.firebaseio.com/')

export default React.createClass({
  getInitialState(){
    return {
      userAuthData: {},
      objectArrays: [],
      friendMap: new Map(),
      friendArrays: [],
      friendList: []
    }
  },
  componentWillMount() {
    var userId = localStorage.getItem('userId') || 0;
    if(userId) {
      base.bindToState('users/'+userId, {
        context: this,
        state: 'userAuthData'
      })
    }
  },

  handleLogin(){
    base.authWithOAuthPopup("facebook", this.authDataCallback, {
      remember: "sessionOnly",
      scope: "email,user_posts"
    });
  },

  authDataCallback(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      localStorage.setItem('userId', authData.facebook.cachedUserProfile.id)
      localStorage.setItem('fbToken', authData.facebook.accessToken)
      base.fetch('users/'+authData.facebook.cachedUserProfile.id, {
        context: this,
        then(data){
          if (data) {
            this.setState({userAuthData: data})
          } else {
            var fbReturnedUser = authData.facebook.cachedUserProfile
            base.post('users/'+fbReturnedUser.id, {
              data: fbReturnedUser
            })
            this.setState({userAuthData:fbReturnedUser})
          }
        }
      })
    }
  },

  fbApiPromise() {
    return promisify(graph.get, function(err, response) {
        if (err) {
          console.error(err);
          return this.reject("error in Facebook Get Request");
        }
        this.resolve(response);
      }) 
  },

  handleGetFriends() {
    var friendMap = this.state.friendMap
    var friendArray = []

    graph.setAccessToken(localStorage.getItem('fbToken'))

    var fbApiCall = this.fbApiPromise()

    fbApiCall('/me/feed?limit=4999')
    .then((response) => {
      var totCount = 0
      var feedObjectIds = response.data.map((object) => {return object.id})
      var objectArrays = [], size = 50
      while (feedObjectIds.length > 0)
          objectArrays.push(feedObjectIds.splice(0, size))
      this.setState({objectArrays})
      var likes = []
      for(let i = 0; i < objectArrays.length; i++) {
        fbApiCall('likes?&ids='+objectArrays[i])
        .then((likesResponse) => {
          for (var key in likesResponse) {
            // skip loop if the property is from prototype
            //if (!likesResponse.hasOwnProperty(key)) continue;

            for (var t = 0; t < likesResponse[key].data.length; t++) {
              if(friendMap.has(likesResponse[key].data[t].id)) {
                var likeFriendObject = friendMap.get(likesResponse[key].data[t].id)
                likeFriendObject.likeCount++
                friendMap.set(likeFriendObject.id, likeFriendObject)
              } else {
                var likeFriendObject = likesResponse[key].data[t]
                likeFriendObject.likeCount = 1
                likeFriendObject.commentCount = 0
                friendMap.set(likesResponse[key].data[t].id, likeFriendObject)
              }
            }
          }

          this.setState({friendMap})
          return fbApiCall('comments?filter=stream&limit=100&ids='+this.state.objectArrays[i])
        })
        .then((commentResponse) => {
          for (var key in commentResponse) {
            // skip loop if the property is from prototype
            //if (!commentResponse.hasOwnProperty(key)) continue;
            for (var z = 0; z < commentResponse[key].data.length; z++) {
              if(friendMap.has(commentResponse[key].data[z].from.id)) {
                var commentFriendObject = friendMap.get(commentResponse[key].data[z].from.id)
                commentFriendObject.commentCount++
                friendMap.set(commentFriendObject.id, commentFriendObject)
              } else {
                var commentFriendObject = commentResponse[key].data[z].from
                commentFriendObject.commentCount = 1
                commentFriendObject.likeCount = 0
                friendMap.set(commentFriendObject.id, commentFriendObject)
              }
            }
          }

          friendMap.forEach((value, key, map) => {
            friendArray.push(value)
          })

          var friendIdArray = friendArray.map((friend) => {return friend.id})
          var friendArrays = [], size = 50
          while (friendIdArray.length > 0)
              friendArrays.push(friendIdArray.splice(0, size))

          this.setState({friendArrays})
        })
        .then(() => {
          for(let i = 0; i < this.state.friendArrays.length; i++) {
            fbApiCall('picture?redirect=false&type=normal&ids='+this.state.friendArrays[i])
            .then((pictureResponse) => {
              for (var key in pictureResponse) {
                // skip loop if the property is from prototype
                if(friendMap.has(key)) {
                  friendMap.get(key).pictureUrl = pictureResponse[key].data.url
                } 
              }
              this.setState({friendMap})

            })
          }
        })
        .then(() => {
          var friendList = []
          friendMap.forEach((value, key, map) => {
            friendList.push(value)
          })

          friendList.sort(function (a, b) {
            var aScore = 3 * a.likeCount + a.commentCount
            var bScore = 3 * b.likeCount + b.commentCount
            if (aScore > bScore) {
              return -1;
            }
            if (aScore < bScore) {
              return 1;
            }
            // a must be equal to b
            return 0;
          }); 
          this.setState({friendList: friendList})
          base.post('users/'+localStorage.getItem('userId')+'/friendList', {
              data: friendList
            })
        })
      }
    })
  },
  
  

  render() {
    var isLoggedIn = localStorage.getItem('userId') ?
      <Dashboard userData={this.state.userAuthData} handleGetFriends={this.handleGetFriends} /> :
      <Login handleLogin={this.handleLogin} />

    return (
      <div className="row">
        <div className="col-md-12">
          {isLoggedIn}
        </div>
      </div>
    )
  }
})