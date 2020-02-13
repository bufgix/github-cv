import fetch from "isomorphic-unfetch";

const ApiService = async url => {
  const res = await fetch(url, {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`
    }
  });
  const json = await res.json();

  return json;
};

const getExtraData = async username => {
  const gistsJson = await ApiService(
    `https://api.github.com/users/${username}/gists`
  );
  const cv = gistsJson.filter(({ files }) =>
    files.hasOwnProperty("my-github-cv.json")
  )[0];
  if (!(typeof cv === "undefined")) {
    const cvContent = await ApiService(cv.url);
    return JSON.parse(cvContent.files["my-github-cv.json"].content);
  } else {
    return null;
  }
};

export { getExtraData };
export default ApiService;
