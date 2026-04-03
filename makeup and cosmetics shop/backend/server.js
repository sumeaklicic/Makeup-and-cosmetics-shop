const http = require("http"); // Uvoz ugrađenog HTTP modula za kreiranje servera

let proizvodi = [
  { id: 1, naziv: "Ruž", cijena: 15, tip: "sminka" },
  { id: 2, naziv: "Krema za lice", cijena: 25, tip: "kozmetika" }
]; // Privremena "baza podataka" u memoriji

const server = http.createServer((req, res) => {

  // CORS zaglavlja (omogućava pristup React aplikaciji)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Browser šalje OPTIONS zahtjev prije POST/PUT/DELETE
  if (req.method === "OPTIONS") {
    res.end();
    return;
  }

  // ROOT ruta – provjera da li backend radi
  if (req.method === "GET" && req.url === "/") {
    res.end("Backend radi");
    return;
  }

  // READ – dohvaćanje svih proizvoda
  if (req.method === "GET" && req.url === "/proizvodi") {
    res.end(JSON.stringify(proizvodi)); // Slanje liste proizvoda u JSON formatu
    return;
  }

  // CREATE – dodavanje novog proizvoda
  if (req.method === "POST" && req.url === "/proizvodi") {
    let body = "";

    // Čitanje podataka koji dolaze iz React forme
    req.on("data", chunk => body += chunk);

    req.on("end", () => {
      const novi = JSON.parse(body); // Pretvaranje JSON stringa u objekt
      novi.id = Date.now();          // Generisanje jedinstvenog ID-a
      proizvodi.push(novi);          // Dodavanje u "bazu"
      res.end(JSON.stringify(novi)); // Vraćanje dodanog proizvoda
    });
    return;
  }

  // UPDATE – ažuriranje proizvoda po ID-u
  if (req.method === "PUT" && req.url.startsWith("/proizvodi/")) {
    const id = Number(req.url.split("/")[2]); // Uzimanje ID-a iz URL-a
    let body = "";

    req.on("data", chunk => body += chunk);

    req.on("end", () => {
      const podaci = JSON.parse(body);
      proizvodi = proizvodi.map(p =>
        p.id === id ? { ...p, ...podaci } : p // Ažuriranje samo izabranog proizvoda
      );
      res.end("Updated");
    });
    return;
  }

  // DELETE – brisanje proizvoda po ID-u
  if (req.method === "DELETE" && req.url.startsWith("/proizvodi/")) {
    const id = Number(req.url.split("/")[2]);
    proizvodi = proizvodi.filter(p => p.id !== id); // Uklanjanje iz niza
    res.end("Deleted");
    return;
  }

  // Ako ruta ne postoji
  res.statusCode = 404;
  res.end("Ruta ne postoji");
});

// Pokretanje servera na portu 5000
server.listen(5000, () => {
  console.log("Backend radi na http://localhost:5000");
});
