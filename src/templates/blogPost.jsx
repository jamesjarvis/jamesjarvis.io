/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import { graphql, Link } from 'gatsby';
import Wrapper from '../components/containers/wrapper';
import ComplexWrapper from '../components/containers/complexWrapper';

const Template = ({ data }) => {
  const {
    post: {
      excerpt,
      html,
      frontmatter: { title, date, previewImage },
    },
  } = data;
  const image = previewImage ? previewImage.childImageSharp.resize : null;
  return (
    <Wrapper title={title} description={excerpt} image={image}>
      <ComplexWrapper>
        <Link to="/blog">back</Link>
        <h1>{title}</h1>
        <span className={'date'}>{date}</span>
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
  query BlogPostQuery($slug: String!) {
    post: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      excerpt(pruneLength: 200)
      frontmatter {
        title
        date(formatString: "MMMM, YYYY")
        tech
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
