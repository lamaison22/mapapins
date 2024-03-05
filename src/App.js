import { Icon, divIcon, point } from "leaflet";
import "./App.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
function App() {
  const markers = [
    {
      geocode: [48.86, 2.3522],
      popUp: "Harro je susi le oasdo",
    },
    {
      geocode: [48.85, 2.3522],
      popUp: "Harro je susi le oasd 2 ",
    },
    {
      geocode: [48.855, 2.34],
      popUp: "Harro je susi le oasdo 3",
    },
  ];
  const customIcon = new Icon({
    iconUrl: "pin.png",
    iconSize: [38, 38],
  });

  const createCustomClusterIcon = (cluster)=>{
    return new divIcon({
      html:`<div class="cluster-icon">${cluster.getChildCount()}</div>`,
      className:"custom-marker-cluster",
      iconSize:point(33,33,true)
    })
  }

  return (
    <div className="App">
      <MapContainer center={[48.8566, 2.3522]} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MarkerClusterGroup chunkedLoading iconCreateFunction={createCustomClusterIcon}>
          {markers.map((marker) => (
            <Marker position={marker.geocode} icon={customIcon}>
              <Popup>{marker.popUp}</Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}

export default App;
