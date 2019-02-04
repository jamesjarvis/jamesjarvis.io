import React from 'react';
import PropTypes from 'prop-types';
import { Link, graphql } from 'gatsby';
import Wrapper from '../components/containers/wrapper';
import ComplexWrapper from '../components/containers/complexWrapper';
import Tech from '../components/tech/tech';

const Blog = ({ data }) => {
  const { edges: posts } = data.allMarkdownRemark;
  const { info } = data;
  return (
    <Wrapper title="Blog">
      <ComplexWrapper>
        <h1>{info.title}</h1>
        <p>{info.about}</p>
        {posts
          .filter(
            post => post.node.frontmatter.title.length > 0 && post.node.fields.type === 'post'
          )
          .map(({ node: post }) => (
            <div className="blog-preview" key={post.id}>
              <h2>
                <Link to={post.fields.slug}>{post.frontmatter.title}</Link>
              </h2>
              <span className={'date'}>
                {post.frontmatter.date}
                {/* <Tech techs={post.frontmatter.tech} /> */}
              </span>
              <p>{post.excerpt}</p>
            </div>
          ))}
      </ComplexWrapper>
    </Wrapper>
  );
};

Blog.propTypes = {
  data: PropTypes.any.isRequired,
};

export default Blog;

export const query = graphql`
  query BlogQuery {
    info: blogJson {
      title
      about
    }
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          excerpt(pruneLength: 250)
          id
          frontmatter {
            title
            date(formatString: "MMMM, YYYY")
            tech
          }
          fields {
            slug
            type
          }
        }
      }
    }
  }
`;
