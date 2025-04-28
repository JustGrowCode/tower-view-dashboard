
import { Tower } from "@/types/tower";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface LocationCardProps {
  tower: Tower;
}

export const LocationCard = ({ tower }: LocationCardProps) => {
  // Function to construct Google Maps embed URL
  const getMapUrl = () => {
    const { lat, lng } = tower.coordinates;
    return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${lat},${lng}&zoom=15`;
  };

  return (
    <Card className="h-full">
      <CardHeader className="bg-slate-50 border-b">
        <CardTitle>LOCALIZAÇÃO</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <MapPin className="text-primary" />
          <span className="font-semibold">{tower.location}</span>
        </div>
        
        <div className="aspect-video w-full bg-slate-200 rounded overflow-hidden mb-4">
          {/* In a real application, this would be a proper map component */}
          {/* For demo purposes, we'll show the location image */}
          <img 
            src={tower.images.location} 
            alt={`Localização da ${tower.name}`}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="aspect-video w-full bg-slate-200 rounded overflow-hidden">
          <img 
            src={tower.images.tower} 
            alt={`${tower.name}`}
            className="w-full h-full object-cover"
          />
        </div>
      </CardContent>
    </Card>
  );
};
