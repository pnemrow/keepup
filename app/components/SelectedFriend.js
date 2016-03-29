import React from 'react'
import {CardTitle, Tab, Tabs, FontIcon, TextField, RaisedButton, Card, Paper, Avatar, CardHeader, CardText, CardActions, FlatButton} from 'material-ui'

export default React.createClass({
  propTypes: {
    selectedFriend: React.PropTypes.object
  },

  render() {
    console.log(this.props.selectedFriend.name,Date.now())
    return (
      <Card className={'mainCard'}>
        <a href={'https://facebook.com/' + this.props.selectedFriend.id} target='_blank'>
          <CardHeader
            title={this.props.selectedFriend.name}
            subtitle="Subtitle"
            avatar={this.props.selectedFriend.pictureUrl}
          />
        </a>
        <CardTitle title="Card title" subtitle="Card subtitle" />
        <CardText>
          <p>Likes: {this.props.selectedFriend.likeCount}</p>
          <p>Comments: {this.props.selectedFriend.commentCount}</p>
          <p>Last Reach Out: </p>
          <p>Next Scheduled Reach Out: </p>

        </CardText>
        <Paper style={{width:'50%', padding:'15px', float:'left'}}>
        <Tabs>
          <Tab
            icon={<FontIcon className="material-icons">phone</FontIcon>}
            label="RECENTS"
          />
          <Tab
            icon={<FontIcon className="material-icons">favorite</FontIcon>}
            label="FAVORITES"
          />
          <Tab
            icon={<FontIcon className="material-icons">person_pin</FontIcon>}
            label="NEARBY"
          />
          <Tab
            icon={<FontIcon className="material-icons">person_pin</FontIcon>}
            label="NEARBY"
          />
        </Tabs>
        <TextField
          hintText="Message Field"
          floatingLabelText="MultiLine and FloatingLabel"
          fullWidth={true}
          multiLine={true}
          rows={3}
        />
        <RaisedButton label="Add Note" secondary={true} fullWidth={true} />
        </Paper>
        <Paper style={{width:'50%', padding:'15px', float:'right'}}>
          <CardText>
            <p>Likes: {this.props.selectedFriend.likeCount}</p>
            <p>Comments: {this.props.selectedFriend.commentCount}</p>
            <p>Last Reach Out: </p>
            <p>Next Scheduled Reach Out: </p>

          </CardText>
        </Paper>

      </Card>
    )
  }
})