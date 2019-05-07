import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OutboundLink } from 'gatsby-plugin-gtag';
import Obfuscate from 'react-obfuscate';
import './socials.scss';

const Socials = ({ showHover, socials, email }) => {
  const middle = Math.round((socials.length - 1) / 2);
  return (
    <div id={'socials'} className={'animate fadeInUp three'}>
      {socials.map((social, i) => (
        <React.Fragment key={`social_${i + 1}`}>
          {i === middle ? (
            <Obfuscate
              email={email.address}
              headers={{
                subject: email.subject,
                body: email.body,
              }}
              id={'email'}
              className={'icon'}
              aria-label={email.text}
              title={email.text}
            >
              <FontAwesomeIcon icon={['fas', 'envelope']} />
            </Obfuscate>
          ) : (
            <></>
          )}
          <OutboundLink
            key={social.icon}
            id={social.icon}
            href={social.url}
            className={`icon`}
            aria-label={social.text}
            title={social.text}
          >
            <FontAwesomeIcon icon={['fab', social.icon]} />
          </OutboundLink>
        </React.Fragment>
      ))}
    </div>
  );
};

Socials.defaultProps = {
  showHover: false,
  email: null,
};

Socials.propTypes = {
  showHover: PropTypes.bool,
  socials: PropTypes.array.isRequired,
  email: PropTypes.any,
};

export default Socials;
