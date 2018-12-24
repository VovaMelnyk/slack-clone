import React from 'react';
import {Grid} from 'semantic-ui-react';
import { connect } from "react-redux";
import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';
import './App.css';
const App = ({secondaryColor}) => {
  return (
    <Grid columns='equal' className='app' style={{ background: secondaryColor }}>
      <ColorPanel/>
      <SidePanel/>
      <Grid.Column style={{ marginLeft: 320 }}>
        <Messages/>
      </Grid.Column>
      <Grid.Column width={4}>
        <MetaPanel/>
      </Grid.Column>

    </Grid>
  );
};

const mapStateToProps = state => ({
  secondaryColor: state.colors.secondaryColor
});

export default connect(mapStateToProps)(App);
