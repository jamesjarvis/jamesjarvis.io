/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import { graphql, Link } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OutboundLink } from 'gatsby-plugin-gtag';
import Wrapper from '../components/containers/wrapper';
import ComplexWrapper from '../components/containers/complexWrapper';
import Tech from '../components/tech/tech';
import '../styles/tooltips.scss';

const Template = ({ data }) => {
  const {
    post: {
      excerpt,
      html,
      frontmatter: { link, source, title, date, tech, previewImage },
    },
  } = data;
  const postLink = link ? (
    <OutboundLink href={link} tooltip="Check it out!">
      <FontAwesomeIcon icon="link" prefix={'fas'} className={`link`} />
    </OutboundLink>
  ) : (
    <></>
  );
  const postSource = source ? (
    <OutboundLink href={source} tooltip="Clone it!">
      <FontAwesomeIcon icon={['fab', 'github']} className={`link`} />
    </OutboundLink>
  ) : (
    <></>
  );
  const links =
    source || link ? (
      <span className={'links'}>
        {postLink}
        {postSource}
      </span>
    ) : (
      <></>
    );
  const image = previewImage ? previewImage.childImageSharp.resize : null;
  return (
    <Wrapper title={title} description={excerpt} image={image}>
      <ComplexWrapper>
        <Link to="/projects">back</Link>
        <h1>{title}</h1>
        {links}
        <span className={'date'}>
          {date}
          <Tech techs={tech} />
        </span>
        <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: html }} />
      </ComplexWrapper>
    </Wrapper>
  );
};

Template.propTypes = {
  data: PropTypes.any.isRequired,
};

export default Template;

export const pageQuery = graphql`
  query ProjectPostQuery($slug: String!) {
    post: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      excerpt(pruneLength: 200)
      frontmatter {
        title
        date(formatString: "MMMM, YYYY")
        tech
        link
        source
        previewImage {
          childImageSharp {
            resize(width: 1200) {
              src
              height
              width
            }
          }
        }
      }
    }
  }
`;
