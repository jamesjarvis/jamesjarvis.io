import React from 'react';
import NavBar from './navbar';
import '../../../styles/codestyle.scss';
import './header.scss';

export default class Header extends React.Component {
  render() {
    return (
      <header className="translucent">
        <NavBar language="java" />
      </header>
    );
  }
}
