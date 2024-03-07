import { Icon, divIcon, point } from "leaflet";
import "./App.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import Papa from "papaparse";
import { useEffect, useState } from "react";
function App() {
  const [dados, setDados] = useState([]);
  const [lats, setLats] = useState([]);

  useEffect(() => {
    // Função para ler e analisar o arquivo CSV
    const lerCSV = async () => {
      try {
        const response = await fetch("chapecoreal.csv");
        const text = await response.text();
        const resultado = Papa.parse(text, { header: true });
        setDados(resultado.data);
        console.log(resultado)
      } catch (error) {
        console.error("Ocorreu um erro:", error);
      }
    };

    lerCSV();
  }, []); // O array vazio como segundo argumento do useEffect garante que a função seja executada apenas uma vez, equivalente a componentDidMount

   function getBbox() {
    const bboxPromises =dados.map((linha, index) => {
      const bboxSemChaves = linha.bbox.replace(/[{}]/g, "");
      // Remove espaços em branco
      const bboxSemEspaco = bboxSemChaves.replace(/\s+/g, "");
      // Substitui "=" por ":"
      const bboxStringComDoisPontos = bboxSemEspaco.replace(/=/g, ":");
      // Adiciona aspas
      const bboxComAspas = bboxStringComDoisPontos.replace(
        /([^,]+)(?=:)/g,
        '"$1"'
      );
      // Faz o parsing da string JSON ajustada
      return JSON.parse(`{${bboxComAspas}}`);
      //agora a gente taca nos marker
      
    });
    return Promise.all(bboxPromises)
  }

  const markers = [
    {
      geocode: [48.86, 2.3522],
      popUp: "Harro je susi le oasdo",
      title: "cooperativa ",
    },
    {
      geocode: [48.85, 2.3522],
      popUp: "Harro je susi le oasd 2 ",
      title: "celeiro",
    },
    {
      geocode: [48.855, 2.34],
      popUp: "Harro je susi le oasdo 3",
      cnae: "12313131",
      title: "banco immobiliariop",
      empregadosTotais: 640,
      novosContratados: 240,
      descricao:
        "uma empresa que faz algo na area da saudo e tabme m asodkawkdoakwa",
    },
  ];
  const customIcon = new Icon({
    iconUrl: "pin.png",
    iconSize: [38, 38],
  });

  const createCustomClusterIcon = (cluster) => {
    return new divIcon({
      html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
      className: "custom-marker-cluster",
      iconSize: point(33, 33, true),
    });
  };
  
  async function createMarkers (){
    const createMarkers= await getBbox()
    const oi = (createMarkers.map(element=>{
      return [element.miny,element.minx]
    }))
    setLats(oi)
  }
  createMarkers()


  return (
    <div className="App">
      <MapContainer center={[-27.1210083,-52.8153874]} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createCustomClusterIcon}
        >
          {lats.map((marker) => (
                 <Marker
                 position={marker}
                 icon={customIcon}
               >
                 <Popup className="popupsContent">
                   <p>empregados:</p>
                   <p>novos empregados:</p>
                 </Popup>
               </Marker>
          ))}
          {markers.map((marker) => (
            <Marker
              position={marker.geocode}
              icon={customIcon}
              title={marker.title}
            >
              <Popup className="popupsContent">
                <p>empregados: {marker.empregadosTotais}</p>
                <p>novos empregados: {marker.novosContratados}</p>
                <p>
                  taxa de crescimento:{" "}
                  {(marker.empregadosTotais * 100) /
                    (marker.empregadosTotais - marker.novosContratados)}
                  %
                </p>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}

export default App;
