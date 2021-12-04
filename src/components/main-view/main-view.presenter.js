import React from 'react';
import { Router } from '@reach/router';
import { MenuContainer } from '../menu';
import { Editor } from '../editor';
import { Home } from '../home';

export function MainView(props) {
  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-12' style={{height: `${props.height - 38}px`}}>
          <Router>
            <Home path='/' />
            <Editor path='/editor/:id' />
          </Router>
        </div>
      </div>
      <div className='row'>
        <div className='col-12' style={{height: '38px'}}>
          <MenuContainer />
        </div>
      </div>
    </div>
  );
}
