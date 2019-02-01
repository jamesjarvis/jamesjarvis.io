import React from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import './header.scss';

export default class NavBar extends React.Component {
  render() {
    return (
      <nav className={`navbar ${this.props.language}`}>
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
  }
}

NavBar.propTypes = {
  language: PropTypes.string.isRequired,
};
