async function generateImage(prompt) {
  return prompt;
  /*
	Route: GET /generate/image
	Headers: prompt
	Return: image generated from stable diffusion
  */
  //   return fetch("https://localhost:8000/generate/image", {
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
  return url;
  /*
	Route: GET /generate/summary
	Headers: prompt
	Return: summary text generated from url with sumy
  */
  //   return fetch("https://localhost:8000/generate/summary", {
  //     method: "GET",
  //     headers: {
  //       prompt: prompt,
  //     },
  //   })
  //     .then((res) => res.json)
  //     .then((json) => {
  //       return json;
  //     });
  //   return url;
}
module.exports = {
  generateImage,
  generateSummary,
};
