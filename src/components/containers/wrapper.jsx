import React from 'react';
import PropTypes from 'prop-types';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faAngleDown, faLink } from '@fortawesome/free-solid-svg-icons';
import Header from '../common/header/header';
import Footer from '../common/footer/footer';
import SEO from '../common/seo';
import './wrapper.scss';

library.add(faAngleDown, fab, faLink);

const Wrapper = ({ title, children }) => (
  <div id={'wrapper'}>
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