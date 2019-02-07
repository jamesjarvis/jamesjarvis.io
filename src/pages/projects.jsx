import React from 'react';
import PropTypes from 'prop-types';
import { Link, graphql } from 'gatsby';
import Img from 'gatsby-image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OutboundLink } from 'gatsby-plugin-gtag';
import Wrapper from '../components/containers/wrapper';
import ComplexWrapper from '../components/containers/complexWrapper';
import Tech from '../components/tech/tech';
import '../styles/postLists.scss';
import '../styles/tooltips.scss';

const Projects = ({ data }) => {
  const { edges: posts } = data.allMarkdownRemark;
  const { info } = data;
  return (
    <Wrapper title="Projects">
      <ComplexWrapper>
        <h1>{info.title}</h1>
        <p>{info.about}</p>
        <ul className={'posts'}>
          {posts
            .filter(
              post => post.node.frontmatter.title.length > 0 && post.node.fields.type === 'project'
            )
            .map(({ node: post }) => {
              const image = post.frontmatter.previewImage ? (
                <Link to={post.fields.slug}>
                  <Img fluid={post.frontmatter.previewImage.childImageSharp.preview} />
                </Link>
              ) : (
                <></>
              );
              const link = post.frontmatter.link ? (
                <OutboundLink href={post.frontmatter.link} tooltip="Check it out!">
                  <FontAwesomeIcon icon="link" prefix={'fas'} className={`link`} />
                </OutboundLink>
              ) : (
                <></>
              );
              const source = post.frontmatter.source ? (
                <OutboundLink href={post.frontmatter.source} tooltip="Clone it!">
                  <FontAwesomeIcon icon={['fab', 'github']} className={`link`} />
                </OutboundLink>
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
                <li className="postPreview" key={post.id}>
                  <h2>
                    <Link to={post.fields.slug}>{post.frontmatter.title}</Link>
                  </h2>
                  {links}
                  <span className={'date'}>
                    {post.frontmatter.date}
                    <Tech techs={post.frontmatter.tech} />
                  </span>
                  {image}
                  <p>
                    {post.excerpt}
                    <Link to={post.fields.slug}> read more</Link>
                  </p>
                </li>
              );
            })}
        </ul>
      </ComplexWrapper>
    </Wrapper>
  );
};

Projects.propTypes = {
  data: PropTypes.any.isRequired,
};

export default Projects;

export const query = graphql`
  query ProjectsQuery {
    info: projectsJson {
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
            link
            source
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
