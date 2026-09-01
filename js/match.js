const MATCHES_URL = "data/matches.json";

const formatDate = (value) =>
  new Intl.DateTimeFormat("sk-SK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));

function getEnteAlbumUrl(embedUrl) {
  if (!embedUrl) return "";

  try {
    const url = new URL(embedUrl);

    if (url.hostname === "embed.ente.com") {
      url.hostname = "albums.ente.com";
    }

    return url.toString();
  } catch {
    return embedUrl.replace(
      "https://embed.ente.com",
      "https://albums.ente.com"
    );
  }
}

async function initMatch() {
  const params = new URLSearchParams(window.location.search);
  const matchId = params.get("id");

  const title = document.getElementById("match-title");
  const meta = document.getElementById("match-meta");
  const details = document.getElementById("match-details");
  const gallery = document.getElementById("ente-gallery");
  const galleryWrap = document.getElementById("gallery-wrap");
  const galleryActions = document.getElementById("gallery-actions");
  const enteAlbumLink = document.getElementById("ente-album-link");
  const error = document.getElementById("match-error");

  try {
    if (!matchId) throw new Error("Chýba ID zápasu.");

    const response = await fetch(MATCHES_URL);
    if (!response.ok) throw new Error("Nepodarilo sa načítať matches.json.");

    const matches = await response.json();
    const match = matches.find((item) => item.id === matchId);

    if (!match) throw new Error("Zápas neexistuje.");

    document.title = `${match.home} – ${match.away} | Jakub Šperka Photography`;
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

    // Optional explicit public URL can be stored as "ente_public".
    // Otherwise derive it automatically from the embed URL.
    const publicAlbumUrl = match.ente_public || getEnteAlbumUrl(match.ente);

    if (publicAlbumUrl) {
      enteAlbumLink.href = publicAlbumUrl;
      galleryActions.hidden = false;
    } else {
      galleryActions.hidden = true;
    }
  } catch (err) {
    title.textContent = "Zápas sa nenašiel";
    meta.textContent = "";
    details.textContent = "";
    galleryWrap.hidden = true;
    galleryActions.hidden = true;
    error.hidden = false;
  }

  document.getElementById("footer-year").textContent = new Date().getFullYear();
}

initMatch();
