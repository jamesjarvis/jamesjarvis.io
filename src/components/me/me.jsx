import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import './me.scss';

const Me = ({ showDescription }) => (
  <StaticQuery
    query={query}
    render={data => (
      <div id={'Me'}>
        <Img fixed={data.avatar.childImageSharp.avatar} className="avatar" />
        <h1>{data.site.siteMetadata.title}</h1>
        {showDescription}
      </div>
    )}
  />
);

const query = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    avatar: file(relativePath: { eq: "avatar.jpg" }) {
      childImageSharp {
        avatar: fixed(width: 125, height: 125) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`;

Me.defaultProps = {
  showDescription: false,
};

Me.propTypes = {
  showDescription: PropTypes.bool,
};

export default Me;
