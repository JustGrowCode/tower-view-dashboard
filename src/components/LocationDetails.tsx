
import { Tower } from "@/types/tower";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface LocationDetailsProps {
  tower: Tower;
}

export const LocationDetails = ({ tower }: LocationDetailsProps) => {
  // Função para construir a URL do Google Maps embed usando as coordenadas
  const getMapUrl = () => {
    const { lat, lng } = tower.coordinates;
    
    // Verifica se temos coordenadas válidas
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      console.warn(`Coordenadas inválidas para a torre ${tower.name}: ${lat}, ${lng}`);
      // Usa o nome da localização como fallback
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyB0JhrzJjRkyiOZibah2Z028S6G3QRCVco&q=${encodeURIComponent(tower.location)}`;
    }
    
    // Usa as coordenadas para posicionamento preciso
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyB0JhrzJjRkyiOZibah2Z028S6G3QRCVco&q=${lat},${lng}&zoom=15`;
  };

  return (
    <Card className="bg-[#1a1f2c] border-[#2e3b52] text-white">
      <CardHeader className="bg-[#222a3d] border-b border-[#2e3b52]">
        <CardTitle className="text-white">LOCALIZAÇÃO</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <MapPin className="text-[#9b87f5]" />
          <span className="font-semibold text-white">{tower.location}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="aspect-video w-full bg-[#222a3d] rounded-lg overflow-hidden mb-2 border border-[#2e3b52]">
              {/* Tenta usar o iframe do Google Maps, com fallback para mensagem se falhar */}
              <iframe 
                src={getMapUrl()} 
                className="w-full h-full"
                title={`Mapa da localização da ${tower.name}`}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onError={(e) => {
                  console.error("Erro ao carregar o mapa:", e);
                  const target = e.target as HTMLIFrameElement;
                  if (target && target.parentNode) {
                    const wrapper = document.createElement('div');
                    wrapper.className = "flex items-center justify-center w-full h-full text-gray-400";
                    wrapper.innerText = "Não foi possível carregar o mapa";
                    target.parentNode.replaceChild(wrapper, target);
                  }
                }}
              ></iframe>
            </div>
            <div className="text-xs text-gray-400 text-center">
              Localização: {tower.coordinates.lat}, {tower.coordinates.lng}
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <div className="text-sm text-gray-400 mb-2">Imagem do Terreno</div>
              <div className="aspect-video w-full bg-[#222a3d] rounded-lg overflow-hidden border border-[#2e3b52]">
                <img 
                  src={tower.images.location} 
                  alt={`Localização da ${tower.name}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.warn(`Erro ao carregar imagem do terreno para ${tower.name}:`, e);
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-400 mb-2">Imagem da Torre</div>
              <div className="aspect-video w-full bg-[#222a3d] rounded-lg overflow-hidden border border-[#2e3b52]">
                <img 
                  src={tower.images.tower} 
                  alt={`${tower.name}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.warn(`Erro ao carregar imagem da torre para ${tower.name}:`, e);
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
