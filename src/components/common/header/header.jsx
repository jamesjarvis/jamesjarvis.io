import React from 'react';
import NavBar from './navbar';
import '../../../styles/codestyle.scss';
import './header.scss';
import CodeContext from '../CodeContext';

const Header = () => (
  <header className="translucent">
    <CodeContext.Consumer>{({ language }) => <NavBar language={language} />}</CodeContext.Consumer>
  </header>
);

export default Header;
