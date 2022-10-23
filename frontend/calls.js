const axios = require("axios");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();
const BASE_URL = "https://ceptron.tech/api/";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

async function generateImage(prompt) {
  /*
  Route: GET /image
  Headers: prompt
  Return: image generated from stable diffusion
  */
  const res = await axios.get(
    `http://34.71.228.105:8000/api/image?prompt=${prompt}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "arraybuffer",
    }
  );
  return res.data;
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

async function generateTextCompletion(prompt, max_tokens = 200) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: prompt,
    max_tokens: max_tokens,
    temperature: 0,
  });
  return prompt + response.data.choices[0].text;
}

module.exports = {
  generateImage,
  generateSummary,
  generateTextCompletion,
};
