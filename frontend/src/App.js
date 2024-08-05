import React, { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [resultClass, setResultClass] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handlePredict = () => {
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.prediction === 1) {
            setResult("The person is having Diabetic Retinopathy.");
            setResultClass("positive");
          } else {
            setResult("No Diabetic Retinopathy detected.");
            setResultClass("negative");
          }
        })
        .catch((error) => console.error("Error:", error));
    } else {
      alert("Please choose an image file first.");
    }
  };

  return (
    <div className="App min-h-screen bg-custom-purple flex flex-col items-center justify-center">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-white bg-purple-700 p-4 rounded-lg">
          Diabetic Retinopathy Detection
        </h1>
        <img
          src="https://vissioneyes.com/img/services/diabetic-retinopathy.jpg"
          alt="Diabetic Retinopathy"
          className="w-full h-auto mt-4 rounded-lg shadow-md"
        />
        <input
          type="file"
          accept=".jpg, .jpeg, .png"
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
        />
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => document.getElementById("fileInput").click()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
          >
            Choose File
          </button>
          <button
            onClick={handlePredict}
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
          >
            Predict
          </button>
        </div>
        <p className={`mt-4 text-xl font-semibold ${resultClass}`}>{result}</p>
      </div>
    </div>
  );
}

export default App;
