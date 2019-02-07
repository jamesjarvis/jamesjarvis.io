import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OutboundLink } from 'gatsby-plugin-gtag';
import './socials.scss';

const Socials = ({ showHover, socials }) => (
  <div id={'socials'} className={'animate fadeInUp three'}>
    {socials.map(social => (
      <OutboundLink key={social.icon} id={social.icon} href={social.url} className={`icon`}>
        <FontAwesomeIcon icon={['fab', social.icon]} />
      </OutboundLink>
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
