import React from "react";
import Router from "next/router";
import css from "../styles/index.scss";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      username: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault(); // for now
  }

  render() {
    return (
      <div className="uk-container uk-padding">
        <div className="uk-card uk-card-default">
          <div className="uk-card-header">
            <h2>Github CV ⭐ 📃</h2>
          </div>
          <div className="uk-card-body">
            <div className="uk-flex" uk-grid="true">
              <div className="uk-width-1-2@m uk-flex-first uk-margin-medium-right">
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
                        className="uk-button uk-button-default uk-margin-top"
                        onClick={() => Router.push(`/${this.state.username}`)}
                      >
                        Generate
                      </button>
                    </div>
                  </fieldset>
                </form>
              </div>
              <hr
                className="uk-width-auto@s uk-divider-vertical uk-visible@l"
                style={{ paddingLeft: 0 }}
              ></hr>
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

export default Index;
