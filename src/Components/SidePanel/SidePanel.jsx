import React, {Component} from 'react';
import {Menu} from 'semantic-ui-react';
import { connect } from "react-redux";
import UserPanel from '../UserPanel/UserPanel';
import Channels from '../Channels/Channels';
import DirectMessages from '../DirectMessages/DirectMessages';

class SidePanel extends Component {
  render() {
    return (
      <Menu
        size='large'
        inverted
        fixed='left'
        vertical
        style={{background: this.props.primaryColor,fontSize: '1.2rem'}}>
        <UserPanel/>
        <Channels/>
        <DirectMessages/>
      </Menu>
    );
  }
}

const mapStateToProps = state => ({
  primaryColor: state.colors.primaryColor
});

export default connect(mapStateToProps)(SidePanel);