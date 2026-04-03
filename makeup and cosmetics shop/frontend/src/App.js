import { useEffect, useState } from "react"; // React hook-ovi
import "./App.css"; // CSS stilovi aplikacije

function App() {

  // STATE varijable – čuvaju podatke u memoriji
  const [proizvodi, setProizvodi] = useState([]); // lista proizvoda
  const [naziv, setNaziv] = useState("");         // naziv proizvoda
  const [cijena, setCijena] = useState("");       // cijena proizvoda
  const [tip, setTip] = useState("sminka");       // kategorija proizvoda
  const [editId, setEditId] = useState(null);     // ID proizvoda koji se uređuje
  const [search, setSearch] = useState("");       // tekst za pretragu

  // Funkcija za učitavanje proizvoda sa backend-a
  const ucitaj = () => {
    fetch("http://localhost:5000/proizvodi")
      .then(res => res.json())
      .then(data => setProizvodi(data)); // spremanje u state
  };

  // useEffect se izvršava samo jednom prilikom pokretanja aplikacije
  useEffect(() => {
    ucitaj();
  }, []);

  // Dodavanje ili ažuriranje proizvoda
  const spremi = () => {
    const podatak = { naziv, cijena, tip };

    // Ako postoji editId → UPDATE
    if (editId) {
      fetch(`http://localhost:5000/proizvodi/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(podatak)
      }).then(() => {
        setEditId(null);
        setNaziv("");
        setCijena("");
        setTip("sminka");
        ucitaj(); // ponovno učitavanje liste
      });

    // Ako nema editId → CREATE
    } else {
      fetch("http://localhost:5000/proizvodi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(podatak)
      }).then(() => {
        setNaziv("");
        setCijena("");
        ucitaj();
      });
    }
  };

  // Brisanje proizvoda
  const obrisi = (id) => {
    fetch(`http://localhost:5000/proizvodi/${id}`, {
      method: "DELETE"
    }).then(ucitaj);
  };

  // Postavljanje podataka u formu za editovanje
  const edituj = (p) => {
    setEditId(p.id);
    setNaziv(p.naziv);
    setCijena(p.cijena);
    setTip(p.tip);
  };

  // Filtriranje proizvoda po pretrazi
  const filtrirani = proizvodi.filter(p =>
    p.naziv.toLowerCase().includes(search.toLowerCase())
  );

  // Razdvajanje po kategoriji
  const sminka = filtrirani.filter(p => p.tip === "sminka");
  const kozmetika = filtrirani.filter(p => p.tip === "kozmetika");

  return (
    <div className="app">
      <h1>💄 Trgovina šminke i kozmetike</h1>

      {/* Polje za pretragu */}
      <input
        className="search"
        placeholder="Pretraga proizvoda..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Forma za unos i izmjenu proizvoda */}
      <div className="forma">
        <input
          placeholder="Naziv"
          value={naziv}
          onChange={e => setNaziv(e.target.value)}
        />

        <input
          placeholder="Cijena"
          value={cijena}
          onChange={e => setCijena(e.target.value)}
        />

        <select value={tip} onChange={e => setTip(e.target.value)}>
          <option value="sminka">Šminka</option>
          <option value="kozmetika">Kozmetika</option>
        </select>

        <button onClick={spremi}>
          {editId ? "Spremi izmjene" : "Dodaj proizvod"}
        </button>
      </div>

      {/* Prikaz šminke */}
      <h2>Šminka</h2>
      {sminka.map(p => (
        <div className="kartica" key={p.id}>
          {p.naziv} – {p.cijena} KM
          <div>
            <button onClick={() => edituj(p)}>✏️</button>
            <button onClick={() => obrisi(p.id)}>❌</button>
          </div>
        </div>
      ))}

      {/* Prikaz kozmetike */}
      <h2>Kozmetika</h2>
      {kozmetika.map(p => (
        <div className="kartica" key={p.id}>
          {p.naziv} – {p.cijena} KM
          <div>
            <button onClick={() => edituj(p)}>✏️</button>
            <button onClick={() => obrisi(p.id)}>❌</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App; // Izvoz glavne komponente
