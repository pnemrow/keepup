import React from 'react'
import {CardTitle, Card, Avatar, CardHeader, CardText, CardActions, FlatButton} from 'material-ui'

export default React.createClass({
  propTypes: {
    selectedFriend: React.PropTypes.object
  },

  render() {
    console.log(this.props.selectedFriend.name,Date.now())
    return (
      <Card className={'mainCard'}>
        <CardHeader
          title={this.props.selectedFriend.name}
          subtitle="Subtitle"
          avatar={this.props.selectedFriend.pictureUrl}
        />
        <CardTitle title="Card title" subtitle="Card subtitle" />
        <CardText>
          <p>Likes: {this.props.selectedFriend.likeCount}</p>
          <p>Comments: {this.props.selectedFriend.commentCount}</p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
          Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
          Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
        </CardText>
        <CardActions>
          <FlatButton label="Action1" />
          <FlatButton label="Action2" />
        </CardActions>
      </Card>
    )
  }
})