import React from 'react';
import PropTypes from 'prop-types';

const defaultState = {
  language: 'go',
  changeLanguage: () => {},
};

const CodeContext = React.createContext(defaultState);

class CodeProvider extends React.Component {
  state = {
    language: 'go',
  };

  changeLanguage = language => {
    let newLanguage = '';
    switch (language.toLowerCase()) {
      case 'javascript':
        newLanguage = 'javascript';
        break;
      case 'typescript':
        newLanguage = 'typescript';
        break;
      case 'react':
        newLanguage = 'javascript';
        break;
      case 'python':
        newLanguage = 'python';
        break;
      case 'java':
        newLanguage = 'java';
        break;
      case 'bash':
        newLanguage = 'bash';
        break;
      case 'go':
        newLanguage = 'go';
        break;
      case 'graphql':
        newLanguage = 'graphql';
        break;
      default:
        newLanguage = 'go';
    }
    this.setState({ language: newLanguage });
  };

  render() {
    const { children } = this.props;
    const { language } = this.state;
    return (
      <CodeContext.Provider
        value={{
          language,
          changeLanguage: this.changeLanguage,
        }}
      >
        {children}
      </CodeContext.Provider>
    );
  }
}

CodeProvider.propTypes = {
  children: PropTypes.any.isRequired,
};

export default CodeContext;

export { CodeProvider };
