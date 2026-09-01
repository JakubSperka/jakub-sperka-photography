const MATCHES_URL = "data/matches.json";

const formatDate = (value) =>
  new Intl.DateTimeFormat("sk-SK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));

const uniqueSorted = (values) =>
  [...new Set(values.filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "sk", { sensitivity: "base" })
  );

function appendOptions(select, values) {
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function createMatchCard(match) {
  const article = document.createElement("article");
  article.className = "match-card";

  const cover = document.createElement("div");
  cover.className = "match-cover";

  if (match.cover) {
    const image = document.createElement("img");
    image.src = match.cover;
    image.alt = `${match.home} – ${match.away}`;
    image.loading = "lazy";

    image.addEventListener("error", () => {
      cover.innerHTML = '<div class="cover-fallback">Cover fotografia</div>';
    });

    cover.appendChild(image);
  } else {
    cover.innerHTML = '<div class="cover-fallback">Cover fotografia</div>';
  }

  const body = document.createElement("div");
  body.className = "match-card-body";

  const score = match.score ? `<span class="match-score">${match.score}</span>` : "";

  body.innerHTML = `
    <div class="match-card-topline">
      <span>${formatDate(match.date)}</span>
      <span>${match.competition || ""}</span>
      ${score}
    </div>
    <h3>${match.home} – ${match.away}</h3>
    <p>${match.location || ""}</p>
    <a class="match-button" href="match.html?id=${encodeURIComponent(match.id)}">
      Zobraziť galériu →
    </a>
  `;

  article.append(cover, body);
  return article;
}

async function initMatches() {
  const grid = document.getElementById("matches-grid");
  const seasonFilter = document.getElementById("season-filter");
  const teamFilter = document.getElementById("team-filter");
  const competitionFilter = document.getElementById("competition-filter");
  const resetFilters = document.getElementById("reset-filters");
  const resultsCount = document.getElementById("results-count");
  const emptyState = document.getElementById("empty-state");

  try {
    const response = await fetch(MATCHES_URL);
    if (!response.ok) throw new Error("Nepodarilo sa načítať matches.json.");

    const matches = await response.json();
    matches.sort((a, b) => b.date.localeCompare(a.date));

    const seasons = uniqueSorted(matches.map((match) => match.season)).reverse();
    const teams = uniqueSorted(
      matches.flatMap((match) => [match.home, match.away])
    );
    const competitions = uniqueSorted(
      matches.map((match) => match.competition)
    );

    appendOptions(seasonFilter, seasons);
    appendOptions(teamFilter, teams);
    appendOptions(competitionFilter, competitions);

    const render = () => {
      const selectedSeason = seasonFilter.value;
      const selectedTeam = teamFilter.value;
      const selectedCompetition = competitionFilter.value;

      const visible = matches.filter((match) => {
        const seasonMatches =
          selectedSeason === "all" || match.season === selectedSeason;

        const teamMatches =
          selectedTeam === "all" ||
          match.home === selectedTeam ||
          match.away === selectedTeam;

        const competitionMatches =
          selectedCompetition === "all" ||
          match.competition === selectedCompetition;

        return seasonMatches && teamMatches && competitionMatches;
      });

      grid.innerHTML = "";
      visible.forEach((match) => grid.appendChild(createMatchCard(match)));

      emptyState.hidden = visible.length !== 0;
      resultsCount.textContent =
        visible.length === 1
          ? "1 zápas"
          : `${visible.length} zápasov`;
    };

    [seasonFilter, teamFilter, competitionFilter].forEach((select) =>
      select.addEventListener("change", render)
    );

    resetFilters.addEventListener("click", () => {
      seasonFilter.value = "all";
      teamFilter.value = "all";
      competitionFilter.value = "all";
      render();
    });

    render();
  } catch (error) {
    grid.innerHTML = `<p class="empty-state">${error.message}</p>`;
    resultsCount.textContent = "";
  }

  document.getElementById("footer-year").textContent = new Date().getFullYear();
}

initMatches();
