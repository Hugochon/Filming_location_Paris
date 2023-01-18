import { useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import './App.css'

function App() {

  const [data, setData] = useState("");
  const [filmName, setFilmName] = useState("")
  const [showInfo, setShowInfo] = useState(false)

  const centreParis = [48.85819487147879, 2.3360550627818585];

  async function requests() {
    try {
      const response = await fetch(`https://opendata.paris.fr/api/records/1.0/search/?dataset=lieux-de-tournage-a-paris&q=nom_tournage:*"${filmName}*"`);
      if (!response.ok) {
        throw new Error("response status not ok");
      }
      const data = await response.json();
      setData(data);
      setShowInfo(true);
    } catch (error) {
      console.error(error);
    }
  }

  function handleChange(event) {
      setFilmName(event.target.value);
  }
  function clickEvent(film) {
    const updatedRecords = data.records.map((film) => {
      film.clicked = false;
      return film;
    });
    setData({records : updatedRecords});
    film.clicked = true;
  }
  function handleSubmit(event) {
    event.preventDefault();
    console.log('Form submitted with text:', filmName);
    requests();
  }

  return (
    <div>
      <h2 className="title"> Which film information are you looking for ?</h2>
      <form onSubmit={handleSubmit}>
      <input type="text" value={filmName} onChange={handleChange} />
      <button type="submit">Submit</button>
      </form>

      {showInfo && (      
            <div>     
            {data.records.map((film, index) => (
              <div className={`filmBlock ${film.clicked ? "surligne" : ""}`} key={index}>
                <h2>{film.fields.nom_tournage} :</h2>
                <p>Réalisateur : {film.fields.nom_realisateur}</p>
                <p>Address : {film.fields.adresse_lieu}</p>
                <p>Date début : {film.fields.date_debut}</p>          
              </div>
            ))}
            <p>Map of Paris</p>
        <MapContainer center={centreParis} zoom={12} scrollWheelZoom={false}>
        <TileLayer  
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>      
       {data.records.map((film,index) => (
            <Marker eventHandlers={{click : _ => clickEvent(film)}} key={index} position={[film.fields.geo_point_2d[0], film.fields.geo_point_2d[1]]}>
                <Popup>
                    <p>{film.fields.nom_tournage}</p>
                    <p>{film.fields.adresse_lieu}</p>
                </Popup>
            </Marker>
        ))}
        </MapContainer>
          </div>     
         )}
    </div>
  );
}

export default App;