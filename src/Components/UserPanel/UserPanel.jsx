import React, {Component} from 'react';
import {Grid, Header, Icon, Dropdown} from 'semantic-ui-react';

class UserPanel extends Component {
    dropdownOptions = () => [
        {
            key: 'user',
            text: <span>Signed in as <strong>User</strong></span>,
            disabled: true,
        },
        {
            key: 'avatar',
            text: <span>Change Avatar</span>
        },
        {
            key: 'out',
            text: <span>Sign Out</span>
        }
    ]
  render() {
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
          </Grid.Row>
          {/* user dropdown */}
          <Header style={{padding: '0.25rem'}} as='h4' inverted>
          <Dropdown trigger={
              <span>User</span>
          } options={this.dropdownOptions()}/>
          </Header>
        </Grid.Column>
      </Grid>
    );
  }
}

export default UserPanel;