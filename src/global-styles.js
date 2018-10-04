import { injectGlobal } from 'styled-components';

// eslint-disable-next-line no-unused-expressions
injectGlobal`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  #root {
    background-color: #3798D4;
    color: #FFFFFF;
    min-height: 100%;
    min-width: 100%;
    height: 100%;
    display: flex;
  }
`;
