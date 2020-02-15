import React from "react";
import Router, { withRouter } from "next/router";
import { Analytics } from "../components";
import "../styles/index.scss";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ""
    };
    Analytics.logPageView("/")
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  loadUiKit() {
    import("uikit/dist/js/uikit")
      .then(uikit => {
        this.uikit = uikit;
        import("uikit/dist/js/uikit-icons").then(icon => {
          this.uikit.use(icon);
        });
      })
      .catch(error => console.error(error));
  }

  componentDidMount() {
    this.loadUiKit();
    window.history.replaceState(null, null, window.location.pathname);
  }

  handleChange(event) {
    this.setState({
      username: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault(); // for now
  }

  renderWarnings() {
    const {
      router: { query }
    } = this.props;
    if (query.notfound) {
      return (
        <div className="uk-alert-danger" uk-alert="true">
          <a className="uk-alert-close" uk-close="true"></a>
          <p>
            User not found <b>{query.notfound}</b>
          </p>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="uk-container uk-padding">
        <div className="uk-card uk-card-default">
          <div className="uk-card-header">
            <h2>Github CV ⭐ 📃</h2>
          </div>
          <div className="uk-card-body">
            <div className="uk-flex uk-grid-divider" uk-grid="true">
              <div className="uk-width-1-2@m uk-flex-first uk-margin-right@m">
                <form onSubmit={this.handleSubmit}>
                  <fieldset className="uk-fieldset">
                    <legend className="uk-legend">
                      Type your Github Username
                    </legend>
                    <div className="uk-margin">
                      <input
                        className="uk-input"
                        type="text"
                        placeholder="Username"
                        value={this.state.username}
                        onChange={this.handleChange}
                      />
                      <button
                        type="submit"
                        className="uk-button uk-button-default uk-margin-top uk-width-1-1@s uk-width-1-3@m"
                        onClick={() => Router.push(`/${this.state.username}`)}
                      >
                        Generate
                      </button>
                    </div>
                  </fieldset>
                </form>
                {this.renderWarnings()}
                <div className="uk-flex uk-flex-center uk-margin-top">
                  <a href="https://github.com/bufgix/github-cv" target="_blank">
                    <span uk-icon="icon: github; ratio: 2"></span>
                  </a>
                  <a href="https://twitter.com/bufgix" target="_blank">
                    <span
                      uk-icon="icon: twitter; ratio: 2"
                      className="uk-margin-small-left"
                    ></span>
                  </a>
                </div>
              </div>
              <div className="uk-width-expand">
                <h4>This web app generates CV based on your Github Profile</h4>

                <p>
                  If you want to share extra information, create gist that name{" "}
                  <code>my-github-cv.json</code> like below
                </p>
                <div style={{ boxShadow: "0 5px 15px rgba(0,0,0,.08)" }}>
                  <img src="./carbon.png" alt="example" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Index.getInitialProps = () => {
  return { title: "Github CV" };
};

export default withRouter(Index);
