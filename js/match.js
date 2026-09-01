const MATCHES_URL = "data/matches.json";

const formatDate = (value) =>
  new Intl.DateTimeFormat("sk-SK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));

async function initMatch() {
  const params = new URLSearchParams(window.location.search);
  const matchId = params.get("id");

  const title = document.getElementById("match-title");
  const meta = document.getElementById("match-meta");
  const details = document.getElementById("match-details");
  const gallery = document.getElementById("ente-gallery");
  const galleryWrap = document.getElementById("gallery-wrap");
  const error = document.getElementById("match-error");

  try {
    if (!matchId) throw new Error("Chýba ID zápasu.");

    const response = await fetch(MATCHES_URL);
    if (!response.ok) throw new Error("Nepodarilo sa načítať matches.json.");

    const matches = await response.json();
    const match = matches.find((item) => item.id === matchId);

    if (!match) throw new Error("Zápas neexistuje.");

    document.title = `${match.home} – ${match.away} | Football Photography`;
    title.textContent = `${match.home} – ${match.away}`;

    const metaItems = [
      formatDate(match.date),
      match.competition,
      match.season,
      match.score,
    ].filter(Boolean);

    meta.textContent = metaItems.join(" · ");
    details.textContent = [match.location, match.note].filter(Boolean).join(" · ");

    gallery.src = match.ente;
  } catch (err) {
    title.textContent = "Zápas sa nenašiel";
    meta.textContent = "";
    details.textContent = "";
    galleryWrap.hidden = true;
    error.hidden = false;
  }

  document.getElementById("footer-year").textContent = new Date().getFullYear();
}

initMatch();
