import React from 'react';
import PropTypes from 'prop-types';
import { Link, graphql } from 'gatsby';
import Img from 'gatsby-image';
import Wrapper from '../components/containers/wrapper';
import ComplexWrapper from '../components/containers/complexWrapper';
import Tech from '../components/tech/tech';
import '../styles/postLists.scss';

const Blog = ({ data }) => {
  const { edges: posts } = data.allMarkdownRemark;
  const { info } = data;
  return (
    <Wrapper title="Blog">
      <ComplexWrapper>
        <h1>{info.title}</h1>
        <p>{info.about}</p>
        <ul className={'posts'}>
          {posts
            .filter(
              post => post.node.frontmatter.title.length > 0 && post.node.fields.type === 'post'
            )
            .map(({ node: post }) => {
              const image = post.frontmatter.previewImage ? (
                <Link to={post.fields.slug}>
                  <Img fluid={post.frontmatter.previewImage.childImageSharp.preview} />
                </Link>
              ) : (
                <></>
              );
              return (
                <li className="postPreview" key={post.id}>
                  <h2>
                    <Link to={post.fields.slug}>{post.frontmatter.title}</Link>
                  </h2>
                  <span className={'date'}>
                    {post.frontmatter.date}
                    {/* <Tech techs={post.frontmatter.tech} /> */}
                  </span>
                  {image}
                  <p>{post.excerpt}</p>
                </li>
              );
            })}
        </ul>
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
            previewImage {
              childImageSharp {
                preview: fluid(maxWidth: 750, quality: 80) {
                  ...GatsbyImageSharpFluid_tracedSVG
                }
              }
            }
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
