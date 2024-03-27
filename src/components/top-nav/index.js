import React from "react";

import "./styles.css";
import Logo from "../icons/logo";
import { addColumn, removeColumn } from "../../redux/preference/actions";
import { connect } from "react-redux";
class TopNav extends React.Component {
  tweet =
    "GitHunt(Multiple Column Version v.2) – Most starred projects on Github by @arash-hacker https://github.com/arash-hacker/githunt";

  render() {
    // We need that to show the extension button only if not running in extension
    const isRunningExtension =
      window.chrome && window.chrome.runtime && window.chrome.runtime.id;

    return (
      <div className="top-nav">
        <div className="container clearfix">
          <a
            href="https://github.com/arash-hacker/githunt"
            rel="noopener noreferrer"
            target="_blank"
            className="logo clearfix float-left"
          >
            <Logo />
            <div className="logo-text">
              <h4>GitHunt(Multiple Columns Version V2.0 By @Arash-hacker)</h4>
              <p className="text-muted d-none d-sm-inline-block d-md-inline-block d-xl-inline-block d-lg-inline-block">
                Most starred projects on GitHub
              </p>
              <p className="text-muted d-inline-block d-sm-none d-md-none d-xl-none d-lg-none">
                Top Github Projects
              </p>
            </div>
          </a>
          <div className="float-right external-btns">
            <button
              onClick={() => {
                this.props.addColumn();
              }}
              // target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-tweet d-none d-sm-none d-md-none d-xl-inline-block d-lg-inline-block"
            >
              <i className="fa fa-plus mr-1"></i>
            </button>
            <button
              onClick={this.props.removeColumn}
              // target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-tweet d-none d-sm-none d-md-none d-xl-inline-block d-lg-inline-block"
            >
              <i className="fa fa-minus mr-1"></i>
            </button>
            <a
              href="http://github.com/arash-hacker/githunt"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-dark"
            >
              <i className="fa fa-github mr-1"></i> View Source
            </a>
            {!isRunningExtension && (
              <a
                href="https://goo.gl/e7YP1h"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-danger d-none d-sm-none d-md-inline-block d-xl-inline-block d-lg-inline-block"
              >
                <i className="fa fa-chrome mr-1"></i> Use Extension
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  addColumn,
  removeColumn,
};

export default connect(null, mapDispatchToProps)(TopNav);
