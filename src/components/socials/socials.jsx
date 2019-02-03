import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './socials.scss';

const Socials = ({ showHover, socials }) => (
  <div id={'socials'} className={'animate fadeInUp three'}>
    {socials.map(social => (
      <a key={social.icon} id={social.icon} href={social.url} className={`icon`}>
        <FontAwesomeIcon icon={['fab', social.icon]} />
      </a>
    ))}
  </div>
);

Socials.defaultProps = {
  showHover: false,
};

Socials.propTypes = {
  showHover: PropTypes.bool,
  socials: PropTypes.array.isRequired,
};

export default Socials;
