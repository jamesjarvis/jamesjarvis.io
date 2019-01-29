import React from 'react';
import NavBar from './navbar/navbar';
import '../../styles/codestyle.scss';

export default class Header extends React.Component {
  render() {
    return (
      <header>
        <NavBar className="python" />
      </header>
    );
  }
}
