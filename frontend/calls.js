async function generateImage(prompt) {
  return prompt;
  /*
	Route: GET /generate/image
	headers: include prompt
  */
  return fetch("https://localhost:8000/generate/image", {
    method: "GET",
    headers: {
      prompt: prompt,
    },
  })
    .then((res) => res.json)
    .then((json) => {
      return json;
    });
}

async function generateSummary(url) {
  return url;
  return fetch("https://localhost:8000/generate/summary", {
    method: "GET",
    headers: {
      prompt: prompt,
    },
  })
    .then((res) => res.json)
    .then((json) => {
      return json;
    });
  return url;
}
module.exports = {
  generateImage,
  generateSummary,
};
