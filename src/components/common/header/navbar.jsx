import React from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import './header.scss';

const NavBar = ({ language }) => (
  <nav className={`navbar ${language}`}>
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/projects">Projects</Link>
      </li>
      <li>
        <Link to="/blog">Blog</Link>
      </li>
    </ul>
  </nav>
);

NavBar.propTypes = {
  language: PropTypes.string.isRequired,
};

export default NavBar;
