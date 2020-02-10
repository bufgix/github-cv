import React from "react";
import Link from "next/link";
import ApiService from "../api";
import { HorizontalBar } from "react-chartjs-2";
import "../styles/cv.scss";

class CV extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: this.calculateLangs()
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

    this.calculateLangs();
  }

  dynamicSort(property) {
    var sortOrder = 1;

    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }

    return function(a, b) {
      if (sortOrder == -1) {
        return b[property] - a[property];
      } else {
        return a[property] - b[property];
      }
    };
  }

  calculateLangs() {
    const getByIndex = function(setObj, index) {
      return [...setObj][index];
    };
    const {
      ghData: { userRepos }
    } = this.props;

    let totalRepos = userRepos.length;
    let stats = [];
    let langs = new Set();

    userRepos.forEach(repo => {
      if (!(repo.language === null)) {
        langs.add(repo.language);
      }
    });
    for (var i = 0; i < langs.size; i++) {
      let count = 0;
      for (var j = 0; j < totalRepos; j++) {
        if (getByIndex(langs, i) == userRepos[j].language) {
          count++;
        }
      }
      stats.push({
        name: getByIndex(langs, i),
        count: +count
      });
    }
    stats = stats.map(stat => {
      return {
        ...stat,
        percentage: (stat.count / totalRepos) * 100,
        color: this.getLangColorsMap()[stat.name],
        borderColor: this.getLangColorsMap("1")[stat.name]
      };
    });

    /*
    return {
        name,
        count,
        percentage
    }
    */

    return stats;
  }

  getLangColorsMap(opacity = "0.5") {
    const langColorsMap = {
      Python: `rgba(53,114,165, ${opacity})`,
      JavaScript: `rgba(241,224,90, ${opacity})`,
      Java: `rgba(176,114,25, ${opacity})`,
      Vue: `rgba(44,62,80, ${opacity})`,
      Shell: `rgba(137,224,81, ${opacity})`,
      C: `rgba(85,85,85, ${opacity})`,
      CSS: `rgba(85,85,85, ${opacity})`,
      HTML: `rgba(227,76,38, ${opacity})`,
      Lua: `rgba(227,76,38, ${opacity})`,
      "C#": `rgba(23,134,0, ${opacity})`,
      CoffeeScript: `rgba(36,71,118, ${opacity})`,
      TypeScript: `rgba(43,116,137, ${opacity})`,
      Crystal: `rgba(0,1,0, ${opacity})`,
      Ruby: `rgba(112,21,22, ${opacity})`,
      Assembly: `rgba(110,76,19, ${opacity})`,
      Go: `rgba(0,173,216, ${opacity})`,
      Dart: `rgba(0,180,171, ${opacity})`,
      Kotlin: `rgba(241,142,51, ${opacity})`,
      PHP: `rgba(79,93,149, ${opacity})`
    };

    return langColorsMap;
  }

  renderContacts() {
    const {
      ghData: { userJson }
    } = this.props;
    return (
      <div>
        <ul className="uk-list">
          {userJson.blog ? (
            <li className="uk-align-center uk-margin-remove-bottom">
              <span uk-icon="home"></span> Blog:{" "}
              <a href={userJson.blog}>
                <b>{userJson.blog}</b>
              </a>
            </li>
          ) : null}
          {userJson.email ? (
            <li className="uk-align-center uk-margin-remove-bottom">
              <span uk-icon="mail"></span> Mail:{" "}
              <a href={`mailto:${userJson.email}`}>
                <b>{userJson.email}</b>
              </a>
            </li>
          ) : null}
          {userJson.location ? (
            <li className="uk-align-center uk-margin-remove-bottom">
              <span uk-icon="location"></span> Location:{" "}
              <b>{userJson.location}</b>
            </li>
          ) : null}
          {userJson.company ? (
            <li className="uk-align-center uk-margin-remove-bottom">
              <span uk-icon="bolt"></span> Company: <b>{userJson.company}</b>
            </li>
          ) : null}
        </ul>
      </div>
    );
  }

  renderStats() {
    const {
      ghData: { userJson }
    } = this.props;
    return (
      <ul className="uk-list">
        <li className="uk-align-center uk-margin-remove-bottom">
          <span uk-icon="code"></span> Total Repositories:{" "}
          <a href={`${userJson.html_url}?tab=repositories`}><b>{userJson.public_repos}</b></a>
        </li>
        <li className="uk-align-center uk-margin-remove-bottom">
          <span uk-icon="users"></span> Followers: <a href={`${userJson.html_url}?tab=followers`}><b>{userJson.followers}</b></a>
        </li>
      </ul>
    );
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
          <ul className="uk-list">
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
          </ul>
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
      .sort(this.dynamicSort("-stargazers_count"))
      .slice(0, 3);
    return mostRepos.map((repo, index) => {
      return (
        <div className="uk-card uk-card-default uk-margin-small" key={index}>
          <div className="uk-card-body">
            <div className="uk-flex" uk-grid="true">
              <div className="uk-width-expand">
                <h4 className="uk-margin-remove-bottom">{repo.name}</h4>
                <p className="uk-text-muted uk-margin-remove-top">
                  {repo.description}
                </p>
              </div>
              <div className="uk-width-auto">
                <span uk-icon="star"></span> {repo.stargazers_count}
              </div>
            </div>
            {repo.language ? (
              <span
                className="uk-badge"
                style={{
                  backgroundColor: this.getLangColorsMap(1)[repo.language]
                }}
              >
                {repo.language}
              </span>
            ) : null}
          </div>
        </div>
      );
    });
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
            <div className="uk-flex" uk-grid="true">
              <div className="uk-width-1-6@m">
                <img
                  src={userJson.avatar_url}
                  alt="profile-img"
                  uk-img="true"
                />
              </div>
              <div className="uk-width-expand">
                <h3 className="uk-card-title uk-margin-remove-bottom">
                  {userJson.name}
                </h3>
                <p className="uk-text-muted uk-margin-remove-top">
                  {userJson.bio}
                </p>
                {this.renderContacts()}
              </div>
              <div className="uk-width-auto">{this.renderStats()}</div>
            </div>
          </div>
          <div className="uk-card-body">
            <div className="uk-flex" uk-grid="true">
              <div className="uk-width-1-2@s">
                <div>
                  <h3 className="uk-margin-remove-top">Languages</h3>
                  <hr />
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
                      responsive: true
                    }}
                  />
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
        </div>
      </div>
    );
  }
}

CV.getInitialProps = async ({ query }) => {
  const userJson = await ApiService(
    `https://api.github.com/users/${query.user}`
  );
  const userRepos = await ApiService(
    `https://api.github.com/users/${query.user}/repos`
  );
  const orgsJson = await ApiService(userJson.organizations_url);

  return {
    ghData: { userJson, userRepos, orgsJson }
  };
};

export default CV;
