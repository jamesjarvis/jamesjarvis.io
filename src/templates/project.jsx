/* eslint-disable react/no-danger */
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { graphql, Link } from "gatsby";
import { OutboundLink } from "gatsby-plugin-gtag";
import moment from "moment";
import PropTypes from "prop-types";
import React from "react";
import ComplexWrapper from "../components/containers/complexWrapper";
import Wrapper from "../components/containers/wrapper";
import Tech from "../components/tech/tech";
import "../styles/tooltips.scss";

const Template = ({ data }) => {
  const {
    post: {
      excerpt,
      html,
      frontmatter: { link, source, title, date, tech, previewImage },
    },
  } = data;
  const postLink = link ? (
    <OutboundLink href={link} tooltip="Check it out!" alt="Webpage link">
      <FontAwesomeIcon icon={faLink} className={`link`} />
    </OutboundLink>
  ) : (
    <></>
  );
  const postSource = source ? (
    <OutboundLink href={source} tooltip="Clone it!" alt="Source code">
      <FontAwesomeIcon icon={faGithub} className={`link`} />
    </OutboundLink>
  ) : (
    <></>
  );
  const links =
    source || link ? (
      <span className={"links"}>
        {postLink}
        {postSource}
      </span>
    ) : (
      <></>
    );
  const image = previewImage ? previewImage.childImageSharp.fixed : null;
  const newDate = moment(date);
  return (
    <Wrapper title={title} description={excerpt} image={image}>
      <ComplexWrapper>
        <Link to="/projects">back</Link>
        <article className="h-entry">
          <h1 className="p-name">{title}</h1>
          {links}
          <time
            className={"date dt-published"}
            dateTime={newDate.toISOString()}
          >
            {newDate.format("MMMM YYYY")}
            <Tech techs={tech} />
          </time>
          <div
            className="blog-post-content e-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>
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
        date
        tech
        link
        source
        previewImage {
          childImageSharp {
            fixed(width: 1200) {
              ...GatsbyImageSharpFixed
            }
            # resize(width: 1200) {
            #   src
            #   height
            #   width
            # }
          }
        }
      }
    }
  }
`;
