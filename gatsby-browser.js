/* eslint-disable import/prefer-default-export */
import './src/styles/global.scss';
import 'prismjs/themes/prism-tomorrow.css';
import React from 'react';
import { CodeProvider } from './src/components/common/CodeContext';

// eslint-disable-next-line react/prop-types
export const wrapRootElement = ({ element }) => <CodeProvider>{element}</CodeProvider>;
