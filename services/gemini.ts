import * as fs from "fs";
import { GoogleGenAI, Modality } from "@google/genai";

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateImage(
    prompt: string,
    imagePath: string,
): Promise<void> {
    try {
        // IMPORTANT: only this gemini model supports image generation
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-preview-image-generation",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                responseModalities: [Modality.TEXT, Modality.IMAGE],
            },
        });

        const candidates = response.candidates;
        if (!candidates || candidates.length === 0) {
            throw new Error("No image generated from Gemini API");
        }

        const content = candidates[0].content;
        if (!content || !content.parts) {
            throw new Error("Invalid response format from Gemini API");
        }

        let imageGenerated = false;
        for (const part of content.parts) {
            if (part.text) {
                console.log("Gemini response:", part.text);
            } else if (part.inlineData && part.inlineData.data) {
                const imageData = Buffer.from(part.inlineData.data, "base64");
                fs.writeFileSync(imagePath, imageData);
                console.log(`Image saved as ${imagePath}`);
                imageGenerated = true;
                break;
            }
        }

        if (!imageGenerated) {
            throw new Error("No image data found in Gemini response");
        }
    } catch (error) {
        console.error("Gemini image generation error:", error);
        throw new Error(`Failed to generate image: ${error}`);
    }
}
