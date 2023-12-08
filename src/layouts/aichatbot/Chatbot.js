import React, { useState } from "react";
import { CircularProgress, Typography } from "@mui/material";
import { Send as SendIcon, Clear as ClearIcon } from "@mui/icons-material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

const Chatbot = () => {
  const [userQuestion, setUserQuestion] = useState("");
  const [userGoal, setUserGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [responseIconVisible, setResponseIconVisible] = useState(false);

  const clearInput = () => {
    setUserQuestion("");
    setResponse("");
    setResponseIconVisible(false);
    setUserGoal("");
  };

  const generateResponse = async () => {
    setResponseIconVisible(false);
    setResponse("");
    if (userQuestion.trim() === "") {
      setResponseIconVisible(false);
      document.getElementById("question").style.border = "2px solid red";
      return;
    } else {
      document.getElementById("question").style.border = "none";
    }
    let prompt;
    if (userGoal.trim() !== "") {
      prompt = `Explore the results of all peer-reviewed publications of ${userQuestion} for ${userGoal}. Additionally, suggest the amount of dosage, duration of usage, and their effects. Response should be a JSON object structure of response always this and strictly mention that there is no any text outside the json object:
        {
          "studies": [
            {
              "title": "",
              "published_in": "",
              "dosage": "",
              "duration": "",
              "effects": "",
              "conclusion": ""
            },
            {
              "title": "",
              "published_in": "",
              "dosage": "",
              "duration": "",
              "effects": "",
              "conclusion": ""
            },
            {
              "title": "",
              "published_in": "",
              "dosage": "",
              "duration": "",
              "effects": "",
              "conclusion": ""
            },
            {
              "title": "",
              "published_in": "",
              "dosage": "",
              "duration": "",
              "effects": "",
              "conclusion": ""
            }
          ],
          "suggested_dosage": "",
          "suggested_duration": "",
          "common_effects": ""
        }`;
    } else {
      prompt = `Explore the results of all peer-reviewed publications of ${userQuestion}. Additionally, suggest the amount of dosage, duration of usage, and their effects. Response should be a JSON object structure of response always this and strictly mention that there is no any text outside the json object:
        {
          "studies": [
            {
              "title": "",
              "published_in": "",
              "dosage": "",
              "duration": "",
              "effects": "",
              "conclusion": ""
            },
            {
              "title": "",
              "published_in": "",
              "dosage": "",
              "duration": "",
              "effects": "",
              "conclusion": ""
            },
            {
              "title": "",
              "published_in": "",
              "dosage": "",
              "duration": "",
              "effects": "",
              "conclusion": ""
            },
            {
              "title": "",
              "published_in": "",
              "dosage": "",
              "duration": "",
              "effects": "",
              "conclusion": ""
            }
          ],
          "suggested_dosage": "",
          "suggested_duration": "",
          "common_effects": ""
        }`;
    }
    const url = "https://api.openai.com/v1/chat/completions";
    const requestBody = {
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    };
    document.getElementById("Button").disabled = true;
    console.log("Request Body:", JSON.stringify(requestBody));
    setLoading(true);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setResponseIconVisible(true);
      const data = await response.json();
      const apiResponse = data.choices[0].message.content;
      console.log(apiResponse);
      makeApiRequest(userQuestion, userGoal, apiResponse, prompt);
      setResponse(apiResponse);
      setResponseIconVisible(true);
    } catch (error) {
      console.error("Error:", error);
      setResponse(`Response: Error occurred - ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const makeApiRequest = async (userQuestion, userGoal, apiResponse, prompt) => {
    const targetUrl =
      "https://ap-southeast-1.aws.data.mongodb-api.com/app/data-pezxd/endpoint/publicationRecord";
    const data = {
      prompt: prompt,
      ingredients: userQuestion,
      goal: userGoal,
      airesponse: apiResponse,
    };

    console.log(data);
    try {
      const response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Data stored successfully:", result);
      document.getElementById("Button").disabled = false;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 3, width: "25ch", height: "7ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          label="Search Ingredients "
          variant="outlined"
          fullWidth
          className="input-ingredients"
          type="text"
          id="question"
          value={userQuestion}
          onChange={(e) => setUserQuestion(e.target.value)}
        />
        <TextField
          label="Goal e.g muscle strength ,fat burning"
          variant="outlined"
          fullWidth
          className="input-goal"
          type="text"
          id="goal"
          value={userGoal}
          onChange={(e) => setUserGoal(e.target.value)}
        />
        <Button id="Button" variant="contained" color="success" onClick={generateResponse}>
          Search
        </Button>
        <Button
          id="clear-button"
          variant="contained"
          onClick={clearInput}
          style={{ marginLeft: "4px", backgroundColor: "black", width: "5px", border: "25px" }}
        >
          <DeleteIcon style={{ color: "white" }} />
        </Button>
      </Box>
      <div id="loadingMessage" style={{ display: loading ? "block" : "none" }}>
        <CircularProgress color="success" size={22} style={{ marginRight: "10px" }} />
        Please hold, your response is generating....
      </div>
      <span id="response_icon" style={{ display: responseIconVisible ? "inline-block" : "none" }}>
        <img src="./response_icon.png" alt="response-icon" id="responseIcon" />
      </span>
      <Box item xs={6} mb={8} lg={6}>
        <pre id="response">{response}</pre>
      </Box>
    </div>
  );
};

export default Chatbot;
