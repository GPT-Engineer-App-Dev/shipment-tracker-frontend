import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const navigate = useNavigate();

  const handleTrack = () => {
    if (trackingNumber) {
      navigate(`/track?id=${trackingNumber}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-4">Shipment Tracking</h1>
      <p className="text-xl text-center mb-8">Track your cargo shipments in real-time</p>
      <div className="flex max-w-md mx-auto space-x-2">
        <Input
          type="text"
          placeholder="Enter tracking number"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
        />
        <Button onClick={handleTrack}>Track</Button>
      </div>
    </div>
  );
};

export default Index;