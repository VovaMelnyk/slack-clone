import React, {Component} from 'react';
import {Grid, Header, Icon, Dropdown, Image} from 'semantic-ui-react';
import {connect} from 'react-redux'
import firebase from '../../firebase';
class UserPanel extends Component {
  dropdownOptions = () => [
    {
      key: 'user',
      text: <span>Signed in as
        <strong>{this.props.currentUser.displayName}</strong>
      </span>,
      disabled: true
    }, {
      key: 'avatar',
      text: <span>Change Avatar</span>
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
        background: '4c3c4c'
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
                trigger={<span> <Image src={this.props.currentUser.photoURL} spaced='right' avatar/>
                {this.props.currentUser.displayName}</span>}
                options={this.dropdownOptions()}/>
            </Header>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({currentUser: state.user.currentUser})

export default connect(mapStateToProps)(UserPanel);
