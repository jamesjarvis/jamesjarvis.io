import React from 'react';
import PropTypes from 'prop-types';
import Header from './common/header/header';
import Footer from './common/footer/footer';
import SEO from './common/seo';
import './wrapper.scss';

const Wrapper = ({ title, children }) => (
  <div id={'body'}>
    <SEO title={title} />
    <Header />
    {children}
    <Footer />
  </div>
);

Wrapper.defaultProps = {
  title: null,
};

Wrapper.propTypes = {
  children: PropTypes.any.isRequired,
  title: PropTypes.string,
};

export default Wrapper;
