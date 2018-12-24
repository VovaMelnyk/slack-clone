import React, {Component} from 'react';
import { Grid, Header, Icon, Dropdown, Image, Modal, Input, Button } from "semantic-ui-react";
import {connect} from 'react-redux'
import firebase from '../../firebase';
class UserPanel extends Component {

  state = {
    modal: false
  }
  openModal = () => this.setState({ modal: true });

  closeModal = () => this.setState({ modal: false });

  dropdownOptions = () => [
    {
      key: 'user',
      text: <span>Signed in as
        <strong>{this.props.currentUser.displayName}</strong>
      </span>,
      disabled: true
    }, {
      key: 'avatar',
      text: <span onClick={this.openModal}>Change Avatar</span>
    }, {
      key: 'out',
      text: <span onClick={this.signOut}>Sign Out</span>
    }
  ]

  signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log('signed out');
      })
  }

  render() {
    //   console.log(this.props.currentUser.displayName);
    return (
      <Grid style={{
        background: this.props.primaryColor
      }}>
        <Grid.Column>
          <Grid.Row
            style={{
            padding: '1.2rem',
            margin: '0'
          }}>
            {/* app header */}
            <Header inverted floated='left' as='h2'>
              <Icon name='cloud'/>
              <Header.Content>Slack clone</Header.Content>
            </Header>
            {/* user dropdown */}
            <Header
              style={{
              padding: '0.25rem'
            }}
              as='h4'
              inverted>
              <Dropdown
                trigger={< span > <Image src={this.props.currentUser.photoURL} spaced='right' avatar/>
                {this.props.currentUser.displayName}</span>}
                options={this.dropdownOptions()}/>
            </Header>
          </Grid.Row>
          {/* Change User Avatar Modal   */}
          <Modal open={this.state.modal} onClose={this.closeModal}>
            <Modal.Header>Change Avatar</Modal.Header>
            <Modal.Content>
              <Input fluid type="file" label="New Avatar" name="previewImage" />
              <Grid centered stackable columns={2}>
                <Grid.Row centered>
                  <Grid.Column className="ui center aligned grid">
                    {/* Image Preview */}
                  </Grid.Column>
                  <Grid.Column>{/* Cropped Image Preview */}</Grid.Column>
                </Grid.Row>
              </Grid>
            </Modal.Content>
            <Modal.Actions>
              <Button color="green" inverted>
                <Icon name="save" /> Change Avatar
              </Button>
              <Button color="green" inverted>
                <Icon name="image" /> Preview
              </Button>
              <Button color="red" inverted onClick={this.closeModal}>
                <Icon name="remove" /> Cancel
              </Button>
            </Modal.Actions>
          </Modal>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({currentUser: state.user.currentUser, primaryColor: state.colors.primaryColor})

export default connect(mapStateToProps)(UserPanel);
