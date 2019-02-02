import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './me.scss';
// import { isAbsolute } from 'path';

// const Me = ({ showDescription }) => (
//   <StaticQuery
//     query={query}
//     render={data => {
//       const content = data.allContentJson.edges[0].node;
//       return (
//         <div id={'me'}>
//           <div className={'avatar animate fadeInUp one'}>
//             <Img fixed={data.avatar.childImageSharp.avatar} />
//           </div>
//           <h1 className={'animate fadeInUp two'}>{content.name}</h1>
//           <FontAwesomeIcon icon="angle-down" className={'animate fadeInUp two'} />
//           {showDescription && <p className={'animate fadeInUp three'}>{content.aboutMe}</p>}
//         </div>
//       );
//     }}
//   />
// );

class Me extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  render() {
    return (
      <StaticQuery
        query={query}
        render={data => {
          const content = data.allContentJson.edges[0].node;
          return (
            <div id={'me'}>
              <div className={'avatar animate fadeInUp one'}>
                <Img fixed={data.avatar.childImageSharp.avatar} />
              </div>
              <h1 className={'animate fadeInUp two'}>{content.name}</h1>
              <hr className={'animate growWidth two'} />
              {this.props.showDescription && this.state.show && (
                <p className={'animate fadeInUp three'}>{content.aboutMe}</p>
              )}
              <FontAwesomeIcon icon="angle-down" className={'animate fadeInUp two'} />
            </div>
          );
        }}
      />
    );
  }
}

const query = graphql`
  query {
    allContentJson {
      edges {
        node {
          name
          title
          aboutMe
        }
      }
    }
    avatar: file(relativePath: { eq: "avatar.jpg" }) {
      childImageSharp {
        avatar: fixed(width: 200, height: 200) {
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
