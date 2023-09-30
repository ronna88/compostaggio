import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Titillium Web', sans-serif;
}

svg, path {
  width: 32px;
  height: 32px;
}

body, input-security, textarea, button {
    font-weight: 400;
    font-size: 1rem;
  }
`
