import { GoogleGenerativeAI } from "@google/generative-ai";

export type TravelPreferences = {
  source: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelers: number;
  interests: string;
  includeTransportation?: boolean;
};

export type Airport = {
  name: string;
  id: string;
  time: string;
};

export type Flight = {
  departure_airport: Airport;
  arrival_airport: Airport;
  duration: number;
  airplane: string;
  airline: string;
  airline_logo: string;
  travel_class: string;
  flight_number: string;
  legroom: string;
  extensions: string[];
  overnight?: boolean;
};

export type BestFlight = {
  flights: Flight[];
  layovers?: {
    duration: number;
    name: string;
    id: string;
  }[];
  total_duration: number;
  carbon_emissions: {
    this_flight: number;
    typical_for_this_route: number;
    difference_percent: number;
  };
  price: number;
  type: string;
  airline_logo: string;
  booking_token: string;
};

async function fetchFlights(source: string, destination: string, date: string) {
  const apiKey = localStorage.getItem("SERPAPI_KEY");
  if (!apiKey) {
    throw new Error("SerpAPI key not found. Please add it in settings.");
  }

  // Convert city names to airport codes (basic mapping)
  const airportCodes: { [key: string]: string } = {
    'delhi': 'DEL',
    'hanoi': 'HAN',
    'new york': 'JFK',
    'paris': 'CDG',
    // Add more mappings as needed
  };

  const sourceCode = airportCodes[source.toLowerCase()] || source.toUpperCase();
  const destCode = airportCodes[destination.toLowerCase()] || destination.toUpperCase();

  const url = `https://serpapi.com/search.json?engine=google_flights&type=2&departure_id=${sourceCode}&arrival_id=${destCode}&outbound_date=${date}&currency=USD&hl=en&api_key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors', // Explicitly set CORS mode
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.best_flights || [];
  } catch (error) {
    console.error("Error fetching flights:", error);
    // Return mock data as fallback
    return [
      {
        price: 298,
        total_duration: 240,
        flights: [{ airline: "Vietjet", flight_number: "VJ 972" }],
        booking_token: "WyJDalJJVjFORk5VWlpPSEZwTWsxQlFrcDZhSGRDUnkwdExTMHRMUzB0TFhaMGJuY3lNRUZCUVVGQlIyVnJXWFJOVFdKdmNEUkJFZ1ZXU2prM01ob0xDTm5vQVJBQ0dnTlZVMFE0SEhEWjZBRT0iLFtbIkRFTCIsIjIwMjUtMDItMDciLCJIQU4iLG51bGwsIlZKIiwiOTcyIl1dXQ=="
      },
    {
      flights: [
        {
          departure_airport: {
            name: "Indira Gandhi International Airport",
            id: "DEL",
            time: "2025-02-07 16:30"
          },
          arrival_airport: {
            name: "Netaji Subhash Chandra Bose International Airport",
            id: "CCU",
            time: "2025-02-07 18:35"
          },
          duration: 125,
          airplane: "Airbus A321neo",
          airline: "IndiGo",
          airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/6E.png",
          travel_class: "Economy",
          flight_number: "6E 529",
          legroom: "29 in",
          extensions: [
            "Below average legroom (29 in)",
            "Carbon emissions estimate: 92 kg"
          ]
        },
        {
          departure_airport: {
            name: "Netaji Subhash Chandra Bose International Airport",
            id: "CCU",
            time: "2025-02-07 22:05"
          },
          arrival_airport: {
            name: "Noi Bai International Airport",
            id: "HAN",
            time: "2025-02-08 02:10"
          },
          duration: 155,
          airplane: "Airbus A321neo",
          airline: "IndiGo",
          airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/6E.png",
          travel_class: "Economy",
          flight_number: "6E 1631",
          legroom: "29 in",
          extensions: [
            "Below average legroom (29 in)",
            "Carbon emissions estimate: 117 kg"
          ],
          overnight: true
        }
      ],
      layovers: [
        {
          duration: 210,
          name: "Netaji Subhash Chandra Bose International Airport",
          id: "CCU"
        }
      ],
      total_duration: 490,
      carbon_emissions: {
        this_flight: 210000,
        typical_for_this_route: 223000,
        difference_percent: -6
      },
      price: 416,
      type: "One way",
      airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/6E.png",
      booking_token: "WyJDalJJVjFORk5VWlpPSEZwTWsxQlFrcDZhSGRDUnkwdExTMHRMUzB0TFhaMGJuY3lNRUZCUVVGQlIyVnJXWFJOVFdKdmNEUkJFZ3cyUlRVeU9YdzJSVEUyTXpFYUN3alB4QUlRQWhvRFZWTkVPQnh3ejhRQyIsW1siREVMIiwiMjAyNS0wMi0wNyIsIkNDVSIsbnVsbCwiNkUiLCI1MjkiXSxbIkNDVSIsIjIwMjUtMDItMDciLCJIQU4iLG51bGwsIjZFIiwiMTYzMSJdXV0="
    },
    ];
  }
}

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
    ${preferences.includeTransportation ? '6. Transportation options and recommendations' : ''}

    Format the response in a clear, organized way.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let plan = response.text();

    // If transportation details are requested, fetch real flight data
    if (preferences.includeTransportation) {
      plan += "\n\n## Available Flights\n\n";
      try {
        const flights = await fetchFlights(
          preferences.source,
          preferences.destination,
          preferences.startDate
        );
        
        flights.forEach((flight: BestFlight, index: number) => {
          plan += `### Option ${index + 1}\n`;
          plan += `- Price: $${flight.price}\n`;
          plan += `- Duration: ${flight.total_duration}\n`;
          plan += `- Airline: ${flight.flights[0].airline}\n`;
          plan += `- Flight Number: ${flight.flights[0].flight_number}\n`;
          plan += `- booking_token: ${flight.booking_token}\n\n`;
        });
      } catch (error) {
        console.error("Error fetching flights:", error);
        // Fallback to mock data if API call fails
        const mockFlights = [
          {
            price: 298,
            total_duration: 240,
            flights: [{ airline: "Vietjet", flight_number: "VJ 972" }],
            booking_token: "WyJDalJJVjFORk5VWlpPSEZwTWsxQlFrcDZhSGRDUnkwdExTMHRMUzB0TFhaMGJuY3lNRUZCUVVGQlIyVnJXWFJOVFdKdmNEUkJFZ1ZXU2prM01ob0xDTm5vQVJBQ0dnTlZVMFE0SEhEWjZBRT0iLFtbIkRFTCIsIjIwMjUtMDItMDciLCJIQU4iLG51bGwsIlZKIiwiOTcyIl1dXQ=="
          },
    {
      flights: [
        {
          departure_airport: {
            name: "Indira Gandhi International Airport",
            id: "DEL",
            time: "2025-02-07 16:30"
          },
          arrival_airport: {
            name: "Netaji Subhash Chandra Bose International Airport",
            id: "CCU",
            time: "2025-02-07 18:35"
          },
          duration: 125,
          airplane: "Airbus A321neo",
          airline: "IndiGo",
          airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/6E.png",
          travel_class: "Economy",
          flight_number: "6E 529",
          legroom: "29 in",
          extensions: [
            "Below average legroom (29 in)",
            "Carbon emissions estimate: 92 kg"
          ]
        },
        {
          departure_airport: {
            name: "Netaji Subhash Chandra Bose International Airport",
            id: "CCU",
            time: "2025-02-07 22:05"
          },
          arrival_airport: {
            name: "Noi Bai International Airport",
            id: "HAN",
            time: "2025-02-08 02:10"
          },
          duration: 155,
          airplane: "Airbus A321neo",
          airline: "IndiGo",
          airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/6E.png",
          travel_class: "Economy",
          flight_number: "6E 1631",
          legroom: "29 in",
          extensions: [
            "Below average legroom (29 in)",
            "Carbon emissions estimate: 117 kg"
          ],
          overnight: true
        }
      ],
      layovers: [
        {
          duration: 210,
          name: "Netaji Subhash Chandra Bose International Airport",
          id: "CCU"
        }
      ],
      total_duration: 490,
      carbon_emissions: {
        this_flight: 210000,
        typical_for_this_route: 223000,
        difference_percent: -6
      },
      price: 416,
      type: "One way",
      airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/6E.png",
      booking_token: "WyJDalJJVjFORk5VWlpPSEZwTWsxQlFrcDZhSGRDUnkwdExTMHRMUzB0TFhaMGJuY3lNRUZCUVVGQlIyVnJXWFJOVFdKdmNEUkJFZ3cyUlRVeU9YdzJSVEUyTXpFYUN3alB4QUlRQWhvRFZWTkVPQnh3ejhRQyIsW1siREVMIiwiMjAyNS0wMi0wNyIsIkNDVSIsbnVsbCwiNkUiLCI1MjkiXSxbIkNDVSIsIjIwMjUtMDItMDciLCJIQU4iLG51bGwsIjZFIiwiMTYzMSJdXV0="
    },
        ];
        
        mockFlights.forEach((flight, index) => {
          plan += `### Option ${index + 1}\n`;
          plan += `- Price: $${flight.price}\n`;
          plan += `- Duration: ${flight.total_duration}\n`;
          plan += `- Airline: ${flight.flights[0].airline}\n`;
          plan += `- Flight Number: ${flight.flights[0].flight_number}\n`;
          plan += `- booking_token: ${flight.booking_token}\n\n`;
        });
      }
    }

    return plan;
  } catch (error) {
    console.error("Error generating travel plan:", error);
    throw new Error("Failed to generate travel plan. Please try again.");
  }
}
