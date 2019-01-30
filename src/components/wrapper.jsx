import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import Header from './common/header/header';
import Footer from './common/footer/footer';

export default class Wrapper extends React.Component {
  render() {
    return (
      <>
        <Helmet>
          <title>James Jarvis</title>
          <meta name="description" content="James Jarvis' personal site" />
          <meta name="keywords" content="personal,site,portfolio,developer" />
          <meta
            name="google-site-verification"
            content="qUT9bwH-WOAeZymmzvqBCmYdGu73nhhAPtRbBJbEabM"
          />
        </Helmet>
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
