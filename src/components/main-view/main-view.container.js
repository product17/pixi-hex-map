import React from 'react';
import { MainView } from './main-view.presenter';

export class MainViewComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { height: 0 };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }
  
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  
  updateWindowDimensions() {
    this.setState({
      height: window.innerHeight,
    });
  }

  render() {
    return (
      <MainView
        height={this.state.height}
      />
    );
  }
}
