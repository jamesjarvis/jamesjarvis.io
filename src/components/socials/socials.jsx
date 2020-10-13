import {
  faGithub,
  faInstagram,
  faKeybase,
  faLinkedinIn,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OutboundLink } from "gatsby-plugin-gtag";
import PropTypes from "prop-types";
import React from "react";
import Obfuscate from "react-obfuscate";
import "./socials.scss";

const Socials = ({ showHover, socials, email }) => {
  const icons = {
    "linkedin-in": faLinkedinIn,
    github: faGithub,
    keybase: faKeybase,
    instagram: faInstagram,
    youtube: faYoutube,
  };

  return (
    <div id={"socials"} className={"animate fadeInUp three"}>
      {socials.map((social, i) => (
        <React.Fragment key={`social_${i + 1}`}>
          <OutboundLink
            key={social.icon}
            id={social.icon}
            href={social.url}
            className={`icon`}
            aria-label={social.text}
            title={social.text}
            rel={"me"}
          >
            <FontAwesomeIcon icon={icons[social.icon]} />
          </OutboundLink>
        </React.Fragment>
      ))}
      <Obfuscate
        email={email.address}
        headers={{
          subject: email.subject,
          body: email.body,
        }}
        id={"email"}
        className={"icon"}
        aria-label={email.text}
        title={email.text}
      >
        <FontAwesomeIcon icon={faEnvelope} />
      </Obfuscate>
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
