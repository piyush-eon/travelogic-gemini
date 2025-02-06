import ReactMarkdown from "react-markdown";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface TravelItineraryProps {
  itinerary: string;
}

export function TravelItinerary({ itinerary }: TravelItineraryProps) {
  if (!itinerary) return null;

  // Split the itinerary into main content and flights section
  const [mainContent, flightsSection] = itinerary.split("## Available Flights");

  // Parse flight data from markdown if available
  const flightData = flightsSection?.match(/Option \d+[\s\S]*?(?=Option|\Z)/g) || [];

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Option</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Airline</TableHead>
                <TableHead>Flight Number</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flightData.map((flight, index) => {
                const price = flight.match(/Price: \$(\d+)/)?.[1];
                const duration = flight.match(/Duration: (\d+)/)?.[1];
                const airline = flight.match(/Airline: ([^\n]+)/)?.[1];
                const flightNumber = flight.match(/Flight Number: ([^\n]+)/)?.[1];
                const bookingToken = flight.match(/booking_token: ([^\n]+)/)?.[1];

                return (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>${price}</TableCell>
                    <TableCell>{duration} mins</TableCell>
                    <TableCell>{airline}</TableCell>
                    <TableCell>{flightNumber}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        className="text-travel-primary hover:text-travel-primary/80"
                        onClick={() => {
                          window.open(
                            `https://www.google.com/flights/booking?token=${bookingToken}`,
                            "_blank"
                          );
                        }}
                      >
                        Book Now
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}