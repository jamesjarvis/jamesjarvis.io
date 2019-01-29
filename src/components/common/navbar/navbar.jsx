import React from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import './navbar.scss';

export default class NavBar extends React.Component {
  render() {
    return (
      <div className={this.props.className}>
        <ul>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/projects">Projects</Link>
          </li>
          <li>
            <Link to="/blog">Blog</Link>
          </li>
          <li>
            <Link to="/media">Media</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </div>
    );
  }
}

NavBar.propTypes = {
  className: PropTypes.string.isRequired,
};
