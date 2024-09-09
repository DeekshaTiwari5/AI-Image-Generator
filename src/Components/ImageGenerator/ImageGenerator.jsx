import React, { useRef, useState } from "react";
import "./ImageGenerator.css";
import defaultImage from "../Assets/roar.jpg";

const ImageGenerator = () => {
  const [imageUrl, setImageUrl] = useState("/");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

 const imageGenerator = async () => {
  const prompt = inputRef.current.value.trim();
  if (!prompt) {
    alert("Please enter a valid prompt");
    return;
  }

   try {
     setLoading(true);
    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev", // Use a stable model
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_HUGGINGFACE_API_KEY}`, // Ensure the token is correct
        },
        body: JSON.stringify({
          inputs: prompt, // Send only the 'inputs' key with the prompt
        }),
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to generate image: ${errorMessage}`);
    }

    const blob = await response.blob(); // Handle binary image data
    const imageUrl = URL.createObjectURL(blob); // Convert blob to a usable URL
    setImageUrl(imageUrl); // Set image URL to display the generated image
  } catch (error) {
    console.error("Error fetching image:", error.message);
    alert("Error generating image. Please try again.");
   }
   setLoading(false);
};


      // if (data && data.length > 0) {
      //   setImageUrl(data[0].url); // Assuming API returns an image URL in this format
      // } else {
      //   alert("No image returned from API");
      // }
    // } catch (error) {
    //   console.error("Error fetching image:", error);
    //   alert("Error generating image. Please try again.");
    // }
  // };

  return (
    <div className="ai-image-generator">
      <div className="header">
        AI Image <span>generator</span>
      </div>
      <div className="img-loading">
        <div className="image">
          <img
            src={imageUrl === "/" ? defaultImage : imageUrl}
            alt="Generated AI"
          />
          <div className="loading">
            <div className={loading ? "loading-bar-full" : "loading-bar"}>
              {" "}
            </div>
            <div className={loading ? "loading-text" : "display-none"}>
              Loading...
            </div>
          </div>
        </div>
      </div>
      <div className="search-box">
        <input
          type="text"
          ref={inputRef}
          className="search-input"
          placeholder="Describe What You Want To See"
        />
        <div className="generate-btn" onClick={imageGenerator}>
          Generate
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
