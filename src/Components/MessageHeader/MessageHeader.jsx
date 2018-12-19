import React, {Component} from 'react';
import {Segment, Header, Icon, Input} from 'semantic-ui-react';
import {connect} from 'react-redux';

class MessageHeader extends Component {
  render() {
    return (
      <Segment clearing>
        {/* channel title */}
        <Header
          fluid='true'
          as='h2'
          floated='left'
          style={{
          marginBottom: 0
        }}>
          <span>
            # {this.props.currentChannel ? this.props.currentChannel.name : 'Channel'}
            <Icon name='star outline' color='black'/>
          </span>
          <Header.Subheader>
            {this.props.usersAmount}
          </Header.Subheader>
        </Header>
        {/* ChannelSearch input */}
        <Header floated='right'>
          <Input size='mini' icon='search' name='searchTerm' placeholder='Search' onChange={this.props.hendleSearch}/>
        </Header>

      </Segment>
    );
  }
}

const mapStateToProps = state => ({
  currentChannel: state.channel,
}) 

export default connect(mapStateToProps)(MessageHeader);