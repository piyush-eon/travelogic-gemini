import ReactMarkdown from "react-markdown";

interface TravelItineraryProps {
  itinerary: string;
}

export function TravelItinerary({ itinerary }: TravelItineraryProps) {
  if (!itinerary) return null;

  // Split the itinerary into main content and flights section
  const [mainContent, flightsSection] = itinerary.split("## Available Flights");

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-lg animate-fade-in">
      <h2 className="text-2xl font-semibold mb-4 text-travel-primary">
        Your Travel Itinerary
      </h2>
      <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
        <ReactMarkdown>{mainContent}</ReactMarkdown>
      </div>

      {flightsSection && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-xl font-semibold mb-4 text-travel-primary">
            Available Flights
          </h3>
          <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
            <ReactMarkdown>{flightsSection}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}