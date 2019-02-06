/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import { graphql, Link } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Wrapper from '../components/containers/wrapper';
import ComplexWrapper from '../components/containers/complexWrapper';
import Tech from '../components/tech/tech';
import '../styles/tooltips.scss';

const Template = ({ data }) => {
  const { post } = data; // data.markdownRemark holds our post data
  const link = post.frontmatter.link ? (
    <a href={post.frontmatter.link} tooltip="Check it out!">
      <FontAwesomeIcon icon="link" prefix={'fas'} className={`link`} />
    </a>
  ) : (
    <></>
  );
  const source = post.frontmatter.source ? (
    <a href={post.frontmatter.source} tooltip="Clone it!">
      <FontAwesomeIcon icon={['fab', 'github']} className={`link`} />
    </a>
  ) : (
    <></>
  );
  const links =
    post.frontmatter.source || post.frontmatter.link ? (
      <span className={'links'}>
        {link}
        {source}
      </span>
    ) : (
      <></>
    );
  return (
    <Wrapper title={post.frontmatter.title}>
      <ComplexWrapper>
        <Link to="/projects">back</Link>
        <h1>{post.frontmatter.title}</h1>
        {links}
        <span className={'date'}>
          {post.frontmatter.date}
          <Tech techs={post.frontmatter.tech} />
        </span>
        <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: post.html }} />
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
      frontmatter {
        title
        date(formatString: "MMMM, YYYY")
        tech
        link
        source
      }
    }
  }
`;
