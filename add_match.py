"""Interaktívne pridanie nového zápasu do data/matches.json."""

from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path

DATA_FILE = Path(__file__).parent / "data" / "matches.json"


def slugify(text: str) -> str:
    """Vytvorí jednoduchý URL-safe text bez diakritiky."""
    normalized = unicodedata.normalize("NFKD", text)
    ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
    ascii_text = ascii_text.lower()
    ascii_text = re.sub(r"[^a-z0-9]+", "-", ascii_text)
    return ascii_text.strip("-")


def ask(label: str, required: bool = False) -> str:
    """Načíta hodnotu od používateľa."""
    while True:
        value = input(f"{label}: ").strip()
        if value or not required:
            return value
        print("Táto hodnota je povinná.")


def main() -> None:
    if not DATA_FILE.exists():
        DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
        DATA_FILE.write_text("[]", encoding="utf-8")

    matches = json.loads(DATA_FILE.read_text(encoding="utf-8"))

    print("\nPridanie nového zápasu\n" + "-" * 24)

    date = ask("Dátum (YYYY-MM-DD)", required=True)
    home = ask("Domáci tím", required=True)
    away = ask("Hosťujúci tím", required=True)
    score = ask("Výsledok (napr. 2:1)")
    location = ask("Miesto")
    competition = ask("Súťaž")
    season = ask("Sezóna (napr. 2026/27)")
    ente = ask("Ente embed URL", required=True)
    cover = ask("Cover obrázok (napr. images/covers/zapas.jpg)")
    note = ask("Poznámka")

    match_id = f"{date}-{slugify(home)}-{slugify(away)}"

    if any(item.get("id") == match_id for item in matches):
        raise ValueError(f"Zápas s ID '{match_id}' už existuje.")

    matches.append(
        {
            "id": match_id,
            "date": date,
            "home": home,
            "away": away,
            "score": score,
            "location": location,
            "competition": competition,
            "season": season,
            "cover": cover,
            "ente": ente,
            "note": note,
        }
    )

    matches.sort(key=lambda item: item["date"], reverse=True)

    DATA_FILE.write_text(
        json.dumps(matches, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print(f"\nZápas bol pridaný: {match_id}")
    print(f"Detail: match.html?id={match_id}")


if __name__ == "__main__":
    main()
