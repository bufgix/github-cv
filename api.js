import fetch from "isomorphic-unfetch";

export default async function(url) {
  const res = await fetch(url, {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`
    }
  });
  const json = await res.json();

  return json;
}
