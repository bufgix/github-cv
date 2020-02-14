import React from "react";
import Router from "next/router";
import ApiService, { getExtraData } from "../api";
import { HorizontalBar } from "react-chartjs-2";
import { RepoCard, Contacts, Stats } from "../components";
import { calculateLangs, dynamicSort, redirect } from "../components/utils";
import "../styles/cv.scss";

class CV extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: calculateLangs(props.ghData.userRepos)
    };
    this.langPerChart = React.createRef();
  }
  componentDidMount() {
    import("uikit/dist/js/uikit")
      .then(uikit => {
        this.uikit = uikit;
        import("uikit/dist/js/uikit-icons").then(icon => {
          this.uikit.use(icon);
        });
      })
      .catch(error => console.error(error));
  }

  renderContacts() {
    const {
      ghData: { userJson }
    } = this.props;
    return <Contacts userJson={userJson} />;
  }
  renderStats() {
    const {
      ghData: { userJson }
    } = this.props;
    return <Stats userJson={userJson} />;
  }

  renderOrgs() {
    const {
      ghData: { orgsJson }
    } = this.props;
    if (orgsJson.length) {
      return (
        <div>
          <h3>Organizations</h3>
          <hr />

          <div className="uk-flex uk-flex-wrap uk-flex-left">
            {orgsJson.map((org, index) => (
              <div
                className="uk-card uk-card-default uk-margin-small-left uk-margin-small-right uk-margin-small-bottom uk-card-small"
                key={index}
              >
                <div className="uk-card-header">
                  <img
                    className="uk-margin-right"
                    src={org.avatar_url}
                    alt="org_image"
                    height="50"
                    width="50"
                    uk-img={true}
                  />
                  <span>{org.login}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  }

  renderMostRepos() {
    const {
      ghData: { userRepos }
    } = this.props;
    const mostRepos = userRepos
      .sort(dynamicSort("-stargazers_count"))
      .slice(0, 3);
    return mostRepos.map((repo, index) => {
      return <RepoCard repo={repo} key={index} />;
    });
  }

  renderWarnings() {
    const {
      ghData: { extraData }
    } = this.props;
    if (!extraData) {
      return (
        <div className="uk-alert-warning" uk-alert="true">
          <a className="uk-alert-close" uk-close="true"></a>
          <p>
            Seems like you are not created <b>my-gihub-cv.json</b> file in your
            gists. <a href="#">More</a>
          </p>
        </div>
      );
    }
    return null;
  }

  renderExtraData() {
    const {
      ghData: { extraData }
    } = this.props;
    if (extraData) {
      return (
        <article className="uk-article uk-margin-medium-bottom">
          <h3 className="uk-article-title">About Me</h3> <hr />
          <p>{extraData.about}</p>
        </article>
      );
    }
    return null;
  }

  render() {
    const {
      ghData: { userJson }
    } = this.props;
    const { chartData } = this.state;
    return (
      <div className="uk-container uk-padding">
        <div className="uk-card uk-card-default ">
          <div className="uk-card-header">
            <div className="uk-child-width-expand@s" uk-grid="true">
              <div className="uk-width-1-6@m">
                <img
                  src={userJson.avatar_url}
                  alt="profile-img"
                  uk-img="true"
                />
              </div>
              <div className="uk-width-expand@m">
                <h3 className="uk-card-title uk-margin-remove-bottom">
                  {userJson.name}
                </h3>
                <p className="uk-text-muted uk-margin-remove-top">
                  {userJson.bio}
                </p>
                {this.renderContacts()}
              </div>
              <div className="uk-width-auto@m">{this.renderStats()}</div>
            </div>
          </div>
          <div className="uk-card-body">
            {this.renderExtraData()}
            <div className="uk-flex" uk-grid="true">
              <div className="uk-width-1-2@s">
                <div>
                  <h3 className="uk-margin-remove-top">Languages</h3>
                  <hr />
                  <div style={{ height: 300 }}>
                    <HorizontalBar
                      data={{
                        labels: chartData.map(x => x.name),
                        datasets: [
                          {
                            label: "Languages (%)",
                            data: chartData.map(x => x.percentage.toFixed(2)),
                            backgroundColor: chartData.map(x => x.color),
                            borderColor: chartData.map(x => x.borderColor),
                            borderWidth: 2
                          }
                        ]
                      }}
                      options={{
                        scales: {
                          xAxes: [
                            {
                              ticks: {
                                suggestedMax: 30,
                                suggestedMin: 0
                              }
                            }
                          ]
                        },
                        responsive: true,
                        maintainAspectRatio: false
                      }}
                    />
                  </div>
                </div>
                {this.renderOrgs()}
              </div>
              <div className="uk-width-1-2@s">
                <h3 className="uk-margin-remove-top">Most Repos</h3>
                <hr />
                {this.renderMostRepos()}
              </div>
            </div>
          </div>
          {this.renderWarnings()}
        </div>
      </div>
    );
  }
}

CV.getInitialProps = async ctx => {
  const { query } = ctx;
  const getUserData = async () => {
    const userJson = await ApiService(
      `https://api.github.com/users/${query.user}`
    );
    const orgsJson = await ApiService(userJson.organizations_url);

    return { userJson, orgsJson };
  };
  const [{ userJson, orgsJson }, userRepos, extraData] = await Promise.all([
    getUserData(),
    ApiService(`https://api.github.com/users/${query.user}/repos?per_page=100`),
    getExtraData(query.user)
  ]).catch(err => {
    console.error(err);
    redirect({ ctx, location: "/" });
  });

  return {
    title: `${query.user}'s CV`,
    ghData: { userJson, userRepos, orgsJson, extraData }
  };
};

export default CV;
