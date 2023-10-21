import React from "react";
import { ipcRenderer } from "electron";
import Styled, { ThemeProvider } from "styled-components";

import GlobalStyles from "@Renderer/theme/GlobalStyles";
import Light from "@Renderer/theme/LightTheme";
import Dark from "@Renderer/theme/DarkTheme";
import Store from "@Renderer/utils/Store";

const store = Store.getStore();

const Styles = Styled.div`
.alert {
  display: block;
  width: 100vw;
  text-align: center;
  margin-top: 30vh;
}
.errormsg {
  display: inline-block;
  width: 80%;
  margin: 64px;
  margin-left: auto;
  margin-right: auto;
  border: solid 2px #ff6b72;
  border-radius: 30px;
  padding: 32px;
  h3 {
    margin: 0px;
    display: inline-block;
    background-color: #ff6b72;
    border-radius: 8px;
    padding-left: 16px;
    padding-right: 16px;
    float: left;
  }
  p {
    display: inline-block;
    padding-top: 16px;
  }
}
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    let isDark;
    const mode = store.get("settings.darkMode");
    isDark = mode === "dark";
    if (mode === "system") {
      isDark = ipcRenderer.invoke("get-NativeTheme");
    }

    this.state = { hasError: false, errorMessage: "", isDark };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message };
  }

  render() {
    const { hasError, errorMessage, isDark } = this.state;
    const { children } = this.props;
    if (hasError) {
      return (
        <ThemeProvider theme={isDark ? Dark : Light}>
          <GlobalStyles />
          <Styles>
            <div className="alert">
              <h1>Uh oh!</h1>
              <p>This wasn&apos;t supposed to happen. If you continue to see this message, please reach out to support.</p>
              <div className="errormsg">
                <h3>Error:</h3>
                <p>{errorMessage}</p>
              </div>
            </div>
          </Styles>
        </ThemeProvider>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
