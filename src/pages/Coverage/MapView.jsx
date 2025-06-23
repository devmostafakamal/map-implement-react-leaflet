// components/BranchMap.jsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import warehouses from "../../../public/data/warehouses.json"; // Put your branch data in a JSON file
import { useLoaderData } from "react-router";
import { useState } from "react";

// Fix Leaflet default icon bug in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const FlyToDistrict = ({ position }) => {
  const map = useMap();
  if (position) {
    map.flyTo(position, 10); // zoom level 10
  }
  return null;
};
const MapView = () => {
  const [searchText, setSearchText] = useState("");
  const [flyToPos, setFlyToPos] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();

    const found = warehouses.find((branch) =>
      branch.district.toLowerCase().includes(searchText.toLowerCase())
    );

    if (found) {
      setFlyToPos([found.latitude, found.longitude]);
    } else {
      alert("District not found!");
    }
  };
  const serviceCenters = useLoaderData();
  // console.log(serviceCenters);
  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex justify-center gap-2">
        <input
          type="text"
          placeholder="Enter district name"
          className="input input-bordered w-80"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>
      <div className="h-[700px] w-full border rounded-xl shadow">
        <MapContainer
          center={[23.685, 90.3563]}
          zoom={7}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {warehouses.map((branch, index) => (
            <Marker key={index} position={[branch.latitude, branch.longitude]}>
              <Popup>
                <div className="text-sm space-y-1">
                  <h3 className="font-bold">{branch.district}</h3>
                  <p>
                    <strong>City:</strong> {branch.city}
                  </p>
                  <p>
                    <strong>Areas:</strong> {branch.covered_area.join(", ")}
                  </p>
                  <a
                    href={branch.flowchart}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View Flowchart
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
          <FlyToDistrict position={flyToPos} />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
