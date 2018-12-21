import React from 'react';
import {Grid} from 'semantic-ui-react';
import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';
import './App.css';
const App = () => {
  return (
    <Grid columns='equal' className='app'>
      <ColorPanel/>
      <SidePanel/>
      <Grid.Column textAlign='center'>
        <Messages/>
      </Grid.Column>
      <Grid.Column width={4}>
        <MetaPanel/>
      </Grid.Column>
    </Grid>
  );
};

export default App;