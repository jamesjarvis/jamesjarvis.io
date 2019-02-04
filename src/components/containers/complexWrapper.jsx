import React from 'react';
import PropTypes from 'prop-types';
import Me from '../me/me';
import './complexWrapper.scss';

const ComplexWrapper = ({ children }) => (
  <div id={'content'}>
    <aside id={'content_left'}>
      <Me />
    </aside>
    <section id={'main'}>{children}</section>
  </div>
);

ComplexWrapper.propTypes = {
  children: PropTypes.any.isRequired,
};

export default ComplexWrapper;
