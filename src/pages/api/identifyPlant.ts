import { GoogleGenerativeAI } from "@google/generative-ai";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb'
    }
  }
};

const genAI = new GoogleGenerativeAI("AIzaSyD5wfA-0RmuJkc4rFnUtYNd0pEjDQyh92E");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { fileType, base64Image } = req.body;

  if (!fileType || !base64Image) {
    return res.status(400).json({ error: "Missing required fields: fileType or base64Image" });
  }

  const prompt =
    "Identify this plant in detail. Provide comprehensive information as a json, for each of the following, i want a short info and detailed information. For the sort of temperate i want a min and max:" +
    "\n- Scientific Name" +
    "\n- Common Name" +
    "\n- Plant Family" +
    "\n- Detailed Description" +
    "\n- Native Region" +
    "\n- Growth Type (tree, shrub, herb)" +
    "\n- Sunlight Requirements" +
    "\n- Temperature Requirements" +
    "\n- Soil Preference" +
    "\n- Water Needs" +
    "\n- Typical Bloom Season" +
    "\n- Detailed Propagation Methods" +
    "\n\nProvide the most accurate and detailed information possible.";

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: fileType,
                data: base64Image,
              },
            },
          ],
        },
      ],
    });

    const response = await result.response.text();
    console.log("Generative AI response:", response);

    res.status(200).json({ response });
  } catch (error) {
    console.error("Error in Generative AI API call:", error);
    res.status(500).json({ error: "Failed to identify the plant." });
  }
}