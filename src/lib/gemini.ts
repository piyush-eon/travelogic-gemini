import { GoogleGenerativeAI } from "@google/generative-ai";

export type TravelPreferences = {
  source: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelers: number;
  interests: string;
};

export async function generateTravelPlan(preferences: TravelPreferences) {
  const genAI = new GoogleGenerativeAI(localStorage.getItem("GEMINI_API_KEY") || "");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Act as a travel planning expert. Create a detailed travel itinerary based on the following preferences:
    - Traveling from: ${preferences.source}
    - Destination: ${preferences.destination}
    - Dates: ${preferences.startDate} to ${preferences.endDate}
    - Budget: ${preferences.budget}
    - Number of Travelers: ${preferences.travelers}
    - Interests: ${preferences.interests}

    Please provide:
    1. Daily itinerary with timings
    2. Estimated costs for activities
    3. Recommended accommodations
    4. Travel tips and recommendations
    5. Must-visit places based on interests

    Format the response in a clear, organized way.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating travel plan:", error);
    throw new Error("Failed to generate travel plan. Please try again.");
  }
}