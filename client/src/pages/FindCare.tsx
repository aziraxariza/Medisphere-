import { ArrowLeft, Check, Cross, LocateFixed, MapPin, Navigation, Phone, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const demoCare = [
  { name: "City General Emergency Department", type: "Emergency department", distance: "2.4 km", address: "24 Westbrook Avenue", status: "Open 24 hours", phone: "+91 00000 00000" },
  { name: "Northside Family Clinic", type: "Clinic", distance: "3.1 km", address: "8 Willow Street", status: "Open until 8:00 PM", phone: "+91 00000 00000" },
  { name: "The Care Pharmacy", type: "Pharmacy", distance: "4.6 km", address: "118 Market Road", status: "Open until 10:00 PM", phone: "+91 00000 00000" },
];

export default function FindCare({ onBack }: { onBack: () => void }) {
  const [locationState, setLocationState] = useState<"idle" | "requesting" | "ready" | "denied">("idle");
  const requestLocation = () => {
    if (!navigator.geolocation) return setLocationState("denied");
    setLocationState("requesting");
    navigator.geolocation.getCurrentPosition(() => setLocationState("ready"), () => setLocationState("denied"), { enableHighAccuracy: false, timeout: 8000 });
  };

  return (
    <main className="care-page">
      <header className="simple-topbar"><button className="back-button" type="button" onClick={onBack}><ArrowLeft size={17} /> Back</button><div className="wordmark small-wordmark"><span className="wordmark-mark"><Cross size={14} /></span>Medi<span>Sphere</span></div><span className="care-label"><ShieldAlert size={15} /> Care directory</span></header>
      <div className="care-content">
        <div className="care-intro"><p className="eyebrow">Find care near you</p><h1>Practical help, closer to home.</h1><p className="lede">Use your location to sort nearby care options. Location is requested only when you choose it.</p><button className="button button-dark" type="button" onClick={requestLocation} disabled={locationState === "requesting"}><LocateFixed size={17} />{locationState === "requesting" ? "Finding nearby care..." : locationState === "ready" ? "Location enabled" : "Use my location"}</button>{locationState === "denied" && <p className="form-error">Location permission was not available. You can still browse the development directory below.</p>}</div>
        <div className="care-notice"><MapPin size={17} /><span><strong>Development directory</strong> These providers are mock data for the prototype. Connect a live Places API before presenting real provider information.</span></div>
        <div className="care-layout"><aside className="care-filters"><span className="small-label">Filter by</span><button className="filter-button is-active" type="button">All care</button><button className="filter-button" type="button">Open now</button><button className="filter-button" type="button">Emergency care</button><button className="filter-button" type="button">Within 5 km</button></aside><div className="care-results">{demoCare.map(place => <article className="care-card" key={place.name}><div className="care-card-icon"><MapPin size={18} /></div><div className="care-card-main"><div className="care-card-heading"><div><span className="small-label">{place.type}</span><h2>{place.name}</h2></div><strong>{place.distance}</strong></div><p>{place.address}</p><span className="open-status"><span />{place.status}</span><div className="care-card-actions"><a href={`tel:${place.phone}`}><Phone size={15} /> Call</a><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + " " + place.address)}`} target="_blank" rel="noreferrer"><Navigation size={15} /> Directions</a></div></div></article>)}</div></div>
        <div className="care-bottom"><Check size={16} /><span>For emergencies, call your local emergency number directly. MediSphere does not dispatch ambulances.</span></div>
      </div>
    </main>
  );
}
