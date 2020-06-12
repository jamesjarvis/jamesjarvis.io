import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { StaticQuery, graphql } from "gatsby";

const SEO = ({ title, image, description, keywords, lang, meta }) => (
  <StaticQuery
    query={detailsQuery}
    render={(data) => {
      const metaTitle = title || data.site.siteMetadata.title;
      const templateTitle = title ? `%s | ${data.site.siteMetadata.title}` : ``;
      const metaDescription = description || data.site.siteMetadata.description;
      const metaKeywords = keywords || data.site.siteMetadata.keywords;
      const metaImage =
        image && image.src
          ? `${data.site.siteMetadata.siteUrl}${image.src}`
          : null;
      return (
        <Helmet
          htmlAttributes={{
            lang,
          }}
          title={metaTitle}
          titleTemplate={templateTitle}
          meta={[
            {
              name: `description`,
              content: metaDescription,
            },
            {
              property: `og:title`,
              content: metaTitle,
            },
            {
              property: `og:description`,
              content: metaDescription,
            },
            {
              property: `og:type`,
              content: `website`,
            },
            {
              name: "twitter:creator",
              content: data.site.siteMetadata.author,
            },
            {
              name: `twitter:card`,
              content: `summary`,
            },
            {
              name: `twitter:title`,
              content: metaTitle,
            },
            {
              name: `twitter:description`,
              content: metaDescription,
            },
            {
              name: `google-site-verification`,
              content: `qUT9bwH-WOAeZymmzvqBCmYdGu73nhhAPtRbBJbEabM`,
            },
          ]
            .concat(
              metaImage
                ? [
                    {
                      property: "og:image",
                      content: metaImage,
                    },
                    {
                      property: "og:image:width",
                      content: image.width,
                    },
                    {
                      property: "og:image:height",
                      content: image.height,
                    },
                    {
                      name: "twitter:card",
                      content: "summary_large_image",
                    },
                  ]
                : [
                    {
                      name: "twitter:card",
                      content: "summary",
                    },
                  ]
            )
            .concat(
              metaKeywords.length > 0
                ? {
                    name: `keywords`,
                    content: metaKeywords.join(`, `),
                  }
                : []
            )
            .concat(meta)}
        />
      );
    }}
  />
);

const detailsQuery = graphql`
  query DefaultSEOQuery {
    site {
      siteMetadata {
        title
        description
        keywords
        siteUrl
        author
      }
    }
  }
`;

SEO.defaultProps = {
  description: null,
  lang: `en`,
  meta: [],
  keywords: null,
  title: null,
  image: null,
};

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.array,
  image: PropTypes.shape({
    src: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
  }),
  keywords: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
};

export default SEO;
