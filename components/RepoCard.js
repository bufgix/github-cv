import { useState } from "react";
import { getLangColorsMap } from "./utils";

export default function({ repo }) {
  const [hover, setHover] = useState(false);
  const toggleHover = () => setHover(!hover);
  return (
    <a className="card-link" href={repo.html_url} target="_blank">
      <div
        className={`uk-card uk-card-default uk-margin-small card-hover ${
          hover ? "uk-box-shadow-xlarge" : ""
        }`}
        onMouseEnter={toggleHover}
        onMouseLeave={toggleHover}
      >
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
            <React.Fragment>
              <span
                className="uk-badge"
                style={{
                  backgroundColor: getLangColorsMap(1)[repo.language]
                }}
              >
                {repo.language}
              </span>
            </React.Fragment>
          ) : null}
        </div>
      </div>
    </a>
  );
}
