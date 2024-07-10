import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const TrackShipment = () => {
  const [searchParams] = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState(searchParams.get("id") || "");

  const fetchShipmentDetails = async (id) => {
    // Simulating API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Mock data
    const mockData = {
      shipmentId: id,
      status: "In Transit",
      origin: "New York, USA",
      destination: "London, UK",
      estimatedDelivery: "2024-03-15",
      currentLocation: "Paris, France",
    };

    // Simulating API error for specific tracking numbers
    if (id === "ERROR") {
      throw new Error("Invalid tracking number");
    }

    return mockData;
  };

  const { data: shipment, error, isLoading, refetch } = useQuery({
    queryKey: ["shipment", trackingNumber],
    queryFn: () => fetchShipmentDetails(trackingNumber),
    enabled: false,
  });

  const handleTrack = () => {
    if (trackingNumber) {
      refetch();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Track Shipment</h1>
      <div className="flex max-w-md mx-auto space-x-2 mb-8">
        <Input
          type="text"
          placeholder="Enter tracking number"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
        />
        <Button onClick={handleTrack}>Track</Button>
      </div>

      {isLoading && <p className="text-center">Loading shipment details...</p>}

      {error && (
        <p className="text-center text-red-500">
          Error: {error.message || "Failed to fetch shipment details"}
        </p>
      )}

      {shipment && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Shipment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="font-semibold">Shipment ID</dt>
                <dd>{shipment.shipmentId}</dd>
              </div>
              <div>
                <dt className="font-semibold">Status</dt>
                <dd>{shipment.status}</dd>
              </div>
              <div>
                <dt className="font-semibold">Origin</dt>
                <dd>{shipment.origin}</dd>
              </div>
              <div>
                <dt className="font-semibold">Destination</dt>
                <dd>{shipment.destination}</dd>
              </div>
              <div>
                <dt className="font-semibold">Estimated Delivery</dt>
                <dd>{shipment.estimatedDelivery}</dd>
              </div>
              <div>
                <dt className="font-semibold">Current Location</dt>
                <dd>{shipment.currentLocation}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrackShipment;