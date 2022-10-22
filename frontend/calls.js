const BASE_URL = "https://ceptron.tech/api/";

function absoluteURL(url) {
  return BASE_URL + url;
}

async function generateImage(prompt) {
  return prompt;
  /*
	Route: GET /generate/image
	Headers: prompt
	Return: image generated from stable diffusion
  */
  //   return fetch(absoluteURL("generate/image"), {
  //     method: "GET",
  //     headers: {
  //       prompt: prompt,
  //     },
  //   })
  //     .then((res) => res.json)
  //     .then((json) => {
  //       return json;
  //     });
}

async function generateSummary(url) {
  let n_sentences = 10;
  return url;
  /*
	Route: GET /generate/summary
	Headers: prompt
	Return: summary text generated from url with sumy
  */
  //   return fetch(absoluteURL("summarize"), {
  //     method: "GET",
  //     headers: {
  //       url: url,
  //       sentence_count: n_sentences,
  //     },
  //   })
  //     .then((res) => res.json)
  //     .then((json) => {
  //       return json;
  //     });
}
module.exports = {
  generateImage,
  generateSummary,
};
