import React from "react";
import Router from "next/router";
import ApiService, { getExtraData } from "../api";
import { HorizontalBar } from "react-chartjs-2";
import { RepoCard, Contacts, Stats, Analytics } from "../components";
import { calculateLangs, dynamicSort, redirect } from "../components/utils";
import "../styles/cv.scss";

class CV extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chartData: calculateLangs(props.ghData.userRepos)
    };
    Analytics.logPageView(`/${this.props.userName}`);
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
    return (
      <div>
        <h3 className="uk-margin-top">Most Starred Repos</h3>
        <hr />
        {mostRepos.map((repo, index) => (
          <RepoCard repo={repo} key={index} />
        ))}
      </div>
    );
  }

  renderWarnings() {
    const {
      ghData: {
        extraData: { warns }
      }
    } = this.props;
    if (!(typeof warns === "undefined")) {
      return warns.map((warn, index) => {
        return (
          <div className="uk-alert-warning" uk-alert="true" key={index}>
            <a className="uk-alert-close" uk-close="true"></a>
            <p>{warn}</p>
          </div>
        );
      });
    }
    return null;
  }

  renderExtraData(section) {
    const {
      ghData: {
        extraData: { about, repos, warns },
        userRepos
      }
    } = this.props;
    if (typeof warns === "undefined") {
      switch (section) {
        case "about":
          return about ? (
            <div class="uk-width-expand@m">
              <article className="uk-article uk-margin-medium-bottom">
                <h3 className="uk-article-title">About Me</h3> <hr />
                <p className="uk-text-lead uk-text-lighter ">{about}</p>
              </article>
            </div>
          ) : null;

        case "repos":
          return repos ? (
            <div class="uk-width-expand@m">
              <h3>Picked Repos</h3>
              <hr />
              {userRepos
                .filter(repo => {
                  return repos.includes(repo.name);
                })
                .sort(dynamicSort("-stargazers_count"))
                .map((repo, index) => (
                  <RepoCard repo={repo} key={index} />
                ))}
            </div>
          ) : null;
        default:
          return null;
      }
    }
  }

  render() {
    const {
      ghData: {
        userJson,
        extraData: { warns }
      }
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
            {typeof warns === "undefined" ? (
              <div uk-grid="true">
                {this.renderExtraData("about")}
                {this.renderExtraData("repos")}
              </div>
            ) : null}
            <div className="uk-width-expand">
              <h3>Education</h3>
              <hr />
              <dl class="uk-description-list uk-description-list-divider">
                <dt>Part-Time Student Worker </dt>
                <dd>Sakarya University</dd>
                <dt>Junior Software Developer </dt>
                <dd>Ekol Logistics</dd>
              </dl>
            </div>
            <div uk-grid="true">
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
              <div className="uk-width-1-2@s">{this.renderMostRepos()}</div>
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
  try {
    const [{ userJson, orgsJson }, userRepos, extraData] = await Promise.all([
      getUserData(),
      ApiService(
        `https://api.github.com/users/${query.user}/repos?per_page=100`
      ),
      getExtraData(query.user)
    ]);
    return {
      title: `${query.user}'s CV`,
      userName: query.user,
      ghData: { userJson, userRepos, orgsJson, extraData }
    };
  } catch (err) {
    redirect({ ctx, location: `/?notfound=${query.user}` });
  }
};

export default CV;
