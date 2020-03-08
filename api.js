import fetch from "isomorphic-unfetch";

// API utilty function
const ApiService = async url => {
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`
      }
    });
    const json = await res.json();

    return Promise.resolve(json);
  } catch (error) {
    return Promise.reject({ error });
  }
};

// This function looking for `username` gist and grab content of `my-github-cv.json` file
const getExtraData = async username => {
  const gistsJson = await ApiService(
    `https://api.github.com/users/${username}/gists`
  );
  const cv = gistsJson.filter(({ files }) =>
    files.hasOwnProperty("my-github-cv.json")
  )[0];
  if (!(typeof cv === "undefined")) {
    const cvContent = await ApiService(cv.url);
    return Promise.resolve(
      JSON.parse(cvContent.files["my-github-cv.json"].content)
    );
  } else {
    return Promise.resolve({
      warns: [
        "my-github-cv.json not found in your gists"
      ]
    });
  }
};

export { getExtraData };
export default ApiService;
