
import { Tower } from "@/types/tower";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface LocationCardProps {
  tower: Tower;
}

export const LocationCard = ({ tower }: LocationCardProps) => {
  // Função para construir a URL do Google Maps embed
  const getMapUrl = () => {
    const { lat, lng } = tower.coordinates;
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyB0JhrzJjRkyiOZibah2Z028S6G3QRCVco&q=${encodeURIComponent(tower.location)}&zoom=12`;
    }
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyB0JhrzJjRkyiOZibah2Z028S6G3QRCVco&q=${lat},${lng}&zoom=15`;
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
          {/* Agora usando iframe do Google Maps */}
          <iframe 
            src={getMapUrl()}
            className="w-full h-full" 
            title={`Localização da ${tower.name}`}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onError={(e) => {
              console.error("Erro ao carregar o mapa:", e);
              // Fallback para imagem
              const target = e.target as HTMLIFrameElement;
              if (target && target.parentNode) {
                const img = document.createElement('img');
                img.src = tower.images.location;
                img.alt = `Localização da ${tower.name}`;
                img.className = "w-full h-full object-cover";
                target.parentNode.replaceChild(img, target);
              }
            }}
          ></iframe>
        </div>

        <div className="aspect-video w-full bg-slate-200 rounded overflow-hidden">
          <img 
            src={tower.images.tower} 
            alt={`${tower.name}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.warn(`Erro ao carregar imagem da torre para ${tower.name}`);
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
