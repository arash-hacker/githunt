import React from "react";
import moment from "moment";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import "./styles.css";
import Alert from "../../components/alert";
import Loader from "../../components/loader";
import TopNav from "../../components/top-nav";
import Filters from "../../components/filters";
import GroupHeading from "../../components/group-heading";
import { fetchTrending } from "../../redux/github/actions";
import RepositoryList from "../../components/repository-list";
import RepositoryGrid from "../../components/repository-grid";
import {
  updateDateJump,
  updateLanguage,
  updateViewType,
  resetRepoAndPrefs,
} from "../../redux/preference/actions";

class FeedContainer extends React.Component {
  componentDidMount() {
    if (
      this.props.preference.prefs.length > this.props.github.repositories.length
    ) {
      this.props.resetRepoAndPrefs(this.props.preference.prefs);
      return;
    }
    // If there are no loaded repositories before, fetch them
    this.props.github.repositories.map((repo, index) => {
      if (repo.length === 0) {
        this.fetchNextRepositories(index);
      }
    });
  }

  fetchNextRepositories(index = 0, reset = false) {
    const filters = this.getFilters(index);
    this.props.fetchTrending(filters, index, reset);
  }

  componentDidUpdate(prevProps) {
    const currPreferences = this.props.preference.prefs;
    const prevPreferences = prevProps.preference.prefs;

    // If language or dateJump has been updated, reload
    // the repositories
    if (currPreferences.length > prevPreferences.length) {
      this.fetchNextRepositories(currPreferences.length - 1);
      return;
    }
    if (currPreferences.length < prevPreferences.length) {
      return;
    }
    if (
      JSON.stringify(this.props.github.repositories) !=
      JSON.stringify(prevProps.github.repositories)
    ) {
      for (let index = 0; index < currPreferences.length; index++) {
        this.fetchNextRepositories(index, true);
      }
      return;
    }

    for (let index = 0; index < currPreferences.length; index++) {
      if (
        currPreferences[index].language !== prevPreferences[index].language ||
        currPreferences[index].dateJump !== prevPreferences[index].dateJump
      ) {
        this.fetchNextRepositories(index, true);
      }
    }
  }

  getFilters(index = 0) {
    const filters = {};

    filters.dateRange = this.getNextDateRange(index);
    if (this.props.preference.prefs[index].language) {
      filters.language = this.props.preference.prefs[index].language;
    }

    if (this.props.preference.prefs[index].options.token) {
      filters.token = this.props.preference.prefs[index].options.token;
    }

    return filters;
  }

  getNextDateRange(index = 0) {
    const repositories = this.props.github.repositories[index];
    const dateJump = this.props.preference.prefs[index].dateJump;

    const dateRange = {};
    const lastRecords = repositories[repositories.length - 1];

    if (lastRecords) {
      dateRange.start = moment(lastRecords.start)
        .subtract(1, dateJump)
        .startOf("day");
      dateRange.end = lastRecords.start;
    } else {
      dateRange.start = moment().subtract(1, dateJump).startOf("day");
      dateRange.end = moment().startOf("day");
    }

    return dateRange;
  }

  renderTokenWarning() {
    return (
      !this.props.preference[0]?.options?.token && (
        <Alert type="warning">
          Make sure to
          <strong className="ml-1 mr-1">
            <Link to="/options">add a token</Link>
          </strong>
          to avoid hitting the rate limit
        </Alert>
      )
    );
  }

  renderErrors() {
    if (!this.props.github.error) {
      return null;
    }

    let message = "";
    switch (this.props.github.error.toLowerCase()) {
      case "bad credentials":
        message = (
          <span>
            Token is invalid, try <Link to="/options">updating the token</Link>{" "}
            on the options page
          </span>
        );
        break;
      case "network error":
        message = "Error trying to connect to GitHub servers";
        break;
      default:
        message = this.props.github.error;
        break;
    }

    return <Alert type="danger">{message}</Alert>;
  }

  renderAlerts() {
    const tokenWarning = this.renderTokenWarning();
    const error = this.renderErrors();

    if (tokenWarning || error) {
      return (
        <div className="alert-group">
          {tokenWarning}
          {error}
        </div>
      );
    }

    return null;
  }

  renderRepositoriesList(index) {
    // if (this.props.preference.prefs[index]?.viewType === "grid") {
    //   return (
    //     <RepositoryGrid
    //       repositories={this.props.github.repositories[index] || []}
    //       dateJump={this.props.preference.prefs[index].dateJump}
    //     />
    //   );
    // }

    return (
      <RepositoryList
        index={index}
        repositories={this.props.github.repositories[index] || []}
        dateJump={this.props.preference.prefs[index]?.dateJump}
      />
    );
  }

  hasRepositories(index) {
    return (
      this.props.github.repositories[index] &&
      this.props.github.repositories[index].length !== 0
    );
  }

  render() {
    return (
      <div className="page-wrap">
        <TopNav />

        {this.renderAlerts()}
        <div style={{ display: "flex", flexDirection: "row" }}>
          {this.props.preference.prefs.map((pref, index, arrs) => (
            <div
              className="container mb-5 pb-10"
              style={{ width: 100 / arrs.length + "%" }}
            >
              <div className="header-row clearfix">
                {this.hasRepositories(index) && (
                  <GroupHeading
                    start={this.props.github.repositories[index].start}
                    end={this.props.github.repositories[index].end}
                    dateJump={pref.dateJump}
                  />
                )}
                <br />
                <div className="group-filters">
                  {this.hasRepositories(index) && (
                    <Filters
                      selectedLanguage={pref.language}
                      selectedViewType={pref.viewType}
                      updateLanguage={this.props.updateLanguage}
                      updateViewType={this.props.updateViewType}
                      updateDateJump={this.props.updateDateJump}
                      index={index}
                      selectedDateJump={pref.dateJump}
                    />
                  )}
                </div>
              </div>
              <div className="body-row">
                {this.renderRepositoriesList(index)}

                {this.props.github.processing[index] && <Loader />}

                {!this.props.github.processing[index] &&
                  this.hasRepositories(index) && (
                    <button
                      className="btn btn-primary shadow load-next-date"
                      onClick={() => this.fetchNextRepositories(index)}
                    >
                      <i className="fa fa-refresh mr-2"></i>
                      Load next {pref.dateJump}
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    preference: store.preference,
    github: store.github,
  };
};

const mapDispatchToProps = {
  updateLanguage,
  updateViewType,
  updateDateJump,
  fetchTrending,
  resetRepoAndPrefs,
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedContainer);
