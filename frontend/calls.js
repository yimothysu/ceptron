const axios = require("axios");
const BASE_URL = "https://ceptron.tech/api/";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

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

function padHttp(url) {
  if (!url.startsWith("http")) {
    return "https://" + url;
  }
  return url;
}

async function generateSummary(url, sentence_count = 10) {
  /*
	Route: GET /generate/summary
	Headers: prompt
	Return: summary text generated from url with sumy
  */
  const res = await axiosInstance.get(
    `summarize?url=${padHttp(url)}&sentence_count=${sentence_count}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
}

module.exports = {
  generateImage,
  generateSummary,
};
