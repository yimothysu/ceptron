const axios = require("axios");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();
const BASE_URL = "https://ceptron.tech/api/";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

async function generateImage(prompt, size="512x512") {
  /*
  Route: GET /image
  Headers: prompt
  Return: image generated from DALL-E-2
  */
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createImage({
    prompt: prompt,
    n: 1,
    size: size,
  });
  return response.data.data[0].url;
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

async function generateTextCompletion(prompt, max_tokens = 500) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createCompletion({
    model: "text-davinci-003",
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
