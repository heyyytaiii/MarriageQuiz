import { theme } from './theme'

export const globalStyles = `
  :root {
    font-family: ${theme.fontFamily};
    line-height: 1.5;
    font-weight: 400;
    color: ${theme.colors.ink[900]};
    background-color: ${theme.colors.background};
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-height: 100vh;
    background: radial-gradient(circle at 10% 20%, ${theme.colors.primary[50]} 0, transparent 25%),
      radial-gradient(circle at 90% 10%, #fce7f3 0, transparent 25%),
      radial-gradient(circle at 20% 80%, #dcfce7 0, transparent 25%),
      ${theme.colors.background};
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`
