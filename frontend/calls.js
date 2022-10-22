const axios = require("axios");
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
  //   return axios
  //     .get(absoluteURL(`generate/image?prompt=${prompt}`))
  //     .then((res) => res.json)
  //     .then((json) => {
  //       return json;
  //     });
}

async function generateSummary(url, n_sentences = 10) {
  /*
	Route: GET /generate/summary
	Headers: prompt
	Return: summary text generated from url with sumy
  */
  return axios
    .get(absoluteURL(`summarize?url=${url}&sentence_count=${n_sentences}`))
    .then((res) => {
      return res;
    });
}

module.exports = {
  generateImage,
  generateSummary,
};
