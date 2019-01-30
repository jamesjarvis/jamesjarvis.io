import React from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import './header.scss';

export default class NavBar extends React.Component {
  render() {
    return (
      <div className={`navbar ${this.props.language}`}>
        <ul>
          {/* <li>
            <Link to="/about">About</Link>
          </li> */}
          <li>
            <Link to="/projects">Projects</Link>
          </li>
          <li>
            <Link to="/blog">Blog</Link>
          </li>
          {/* <li>
            <Link to="/media">Media</Link>
          </li> */}
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </div>
    );
  }
}

NavBar.propTypes = {
  language: PropTypes.string.isRequired,
};
