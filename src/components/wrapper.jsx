import React from 'react';
import PropTypes from 'prop-types';
import Header from './common/header';
import Footer from './common/footer';

export default class Wrapper extends React.Component {
  render() {
    return (
      <>
        <Header />
        {this.props.children}
        <Footer />
      </>
    );
  }
}

Wrapper.propTypes = {
  children: PropTypes.any.isRequired,
};
