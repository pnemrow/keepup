"use strict";
import React from 'react';
import Rebase from 're-base';
import graph from 'fb-react-sdk';
import promisify from 'es6-promisify';


const base = Rebase.createClass('https://brilliant-fire-3447.firebaseapp.com')

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
      friendMap: {}
    }
    this.authDataCallback = this.authDataCallback.bind(this);
  }
  
  handleLogin(){
    base.authWithOAuthPopup("facebook", this.authDataCallback, {
      remember: "sessionOnly",
      scope: "email,user_posts"
    });
  }

  fbApiPromise() {
    return promisify(graph.get, function(err, response) {
        if (err) {
          console.error(err);
          return this.reject("error in Facebook Get Request");
        }
        this.resolve(response);
      }) 
  }

  authDataCallback(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      console.log("Authenticated successfully with payload:", authData);
      var friendMap = new Map();
      var friendArray = [];

      console.log(authData.facebook.accessToken)
      graph.setAccessToken(authData.facebook.accessToken);

      var fbApiCall = this.fbApiPromise()

      fbApiCall('/me/feed?limit=4999')
      .then((response) => {
        console.log('we are in!!!!!', response)
        var feedObjectIds = response.data.map((object) => {return object.id})
        var objectArrays = [], size = 50
        while (feedObjectIds.length > 0)
            objectArrays.push(feedObjectIds.splice(0, size))

        this.setState({objectArrays})
        var likes = []
        for(let i = 0; i < this.state.objectArrays.length; i++) {
          fbApiCall('likes?ids='+this.state.objectArrays[i])
          .then((likesResponse) => {
            var friendMap = new Map()
            for (var key in likesResponse) {
              // skip loop if the property is from prototype
              //if (!likesResponse.hasOwnProperty(key)) continue;

              for (let t = 0; t < likesResponse[key].data.length; t++) {
                if(friendMap.has(likesResponse[key].data[t].id)) {
                  var likeFriendObject = friendMap.get(likesResponse[key].data[t].id)
                  console.log(likeFriendObject,5)
                  likeFriendObject.likeCount++
                  console.log(likeFriendObject,likesResponse[key].data[t],4)
                  friendMap.set(likeFriendObject.id, likeFriendObject)
                  console.log(likeFriendObject,likesResponse[key].data[t],3)
                } else {
                  var likeFriendObject = likesResponse[key].data[t]
                  likeFriendObject.likeCount = 1
                  likeFriendObject.commentCount = 0
                  friendMap.set(likesResponse[key].data[t].id, likeFriendObject)
                }
              }
            }

            this.setState({friendMap})
            return fbApiCall('comments?ids='+this.state.objectArrays[i])
          })
          .then((commentResponse) => {
            var friendMap = this.state.friendMap
            console.log('friendMap', friendMap)
            for (var key in commentResponse) {

              // skip loop if the property is from prototype
              //if (!commentResponse.hasOwnProperty(key)) continue;
              for (let z = 0; z < commentResponse[key].data.length; z++) {
                if(friendMap.has(commentResponse[key].data[z].from)) {
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
            console.log("friendArrays", this.state.friendArrays)
          })
          .then(() => {
            console.log("start1", this.state.friendMap)
            for(let i = 0; i < this.state.friendArrays.length; i++) {
              fbApiCall('picture?redirect=false&ids='+this.state.friendArrays[i])
              .then((pictureResponse) => {
                var friendMap = this.state.friendMap
                for (var key in pictureResponse) {
                  // skip loop if the property is from prototype
                  if(friendMap.has(key)) {
                    friendMap.get(key).pictureUrl = pictureResponse[key].data.url
                  } 
                }
                this.setState({friendMap})
                console.log("start2", this.state.friendMap)

              })
            }
          })
          .then(() => {
            console.log('end1', this.state.friendMap)
            var friendMap = this.state.friendMap
            var friendList = []
            friendMap.forEach((value, key, map) => {
              console.log(value, map[key])
              friendList.push(value)
            })

            friendList.sort(function (a, b) {
              if (a.likeCount > b.likeCount) {
                return -1;
              }
              if (a.likeCount < b.likeCount) {
                return 1;
              }
              // a must be equal to b
              return 0;
            });  
            console.log('end2', friendList)
            this.setState({friendList: friendList, friendMap: friendMap})
          })
        }
      })
    }
  }


  render(){
    return (
       <div className="main-container">
        <div className="col-sm-7 col-sm-offset-2" style={{marginTop: 15}}>
          <button type="button" onClick={() => this.handleLogin()}>Login</button>
          <ul className="list-group">
            {this.state.friendList.map((friend) => (
              <li className="list-group-item" key={friend.id}><img src={friend.pictureUrl}></img>{friend.name} - likes: {friend.likeCount} - comments: {friend.commentCount}</li>
            ))}
          </ul>
        </div>
    </div>
    )
  }
}

export default Login