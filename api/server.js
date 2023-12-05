import express from "express";
import "dotenv/config";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "This is Chat GPT AI App",
  });
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
app.post("/", async (req, res) => {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: req.body.input,
      temperature:0.4,
      max_tokens: 4000,
    });
    console.log("Passed: ", req.body.input);
    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (err) {
    console.log("Failed: ", req.body.input);
    console.log(err);
    res.status(500).send(err);
  }
});
app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
