import { HashRouter, Switch, Route } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import React, { Component } from "react";
import AuthPage from "./pages/AuthPage";
import MainPage from "./pages/MainPage";
import ComicSansMS from "./assets/fonts/comic-sans-ms.ttf";
import setup from "./setup";


/** 
 * Global styles for the application
 */
const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Comic-Sans-MS";
  }
  @font-face {
    font-family: "Comic-Sans-MS";
    src: url(${ComicSansMS}) format("truetype");
  }
`;

/**
 * Main Root component of the entire application capable of handling application level state and router configuration
 */
export default class App extends Component {
  componentDidMount() {
    setup()
  }
  /**
   * Render the entire application
   */
  render() {
    {
      return (
        <div className="App">
          <GlobalStyles />
          <HashRouter>
            <Switch>
              <Route path="/" exact>
                <AuthPage />
              </Route>
              <Route path="/main">
                <MainPage />
              </Route>
            </Switch>
          </HashRouter>
        </div>
      );
    }
  }
}
