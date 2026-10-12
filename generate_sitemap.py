from __future__ import annotations

import json
from pathlib import Path
from xml.etree.ElementTree import Element, SubElement, ElementTree, indent

BASE_URL = "https://futbal.sperka.sk"
MATCHES_FILE = Path("data/matches.json")
OUTPUT_FILE = Path("sitemap.xml")


def add_url(urlset: Element, url: str) -> None:
    """Add one URL to the sitemap."""
    url_element = SubElement(urlset, "url")
    loc = SubElement(url_element, "loc")
    loc.text = url


def main() -> None:
    if not MATCHES_FILE.exists():
        raise FileNotFoundError(f"Missing file: {MATCHES_FILE}")

    matches = json.loads(MATCHES_FILE.read_text(encoding="utf-8"))

    urlset = Element(
        "urlset",
        {"xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9"},
    )

    # Permanent pages
    add_url(urlset, f"{BASE_URL}/")
    add_url(urlset, f"{BASE_URL}/about.html")

    # Match detail pages
    for match in sorted(matches, key=lambda item: item.get("date", ""), reverse=True):
        match_id = match.get("id")
        if not match_id:
            continue

        add_url(
            urlset,
            f"{BASE_URL}/match.html?id={match_id}",
        )

    tree = ElementTree(urlset)
    indent(tree, space="  ")

    tree.write(
        OUTPUT_FILE,
        encoding="utf-8",
        xml_declaration=True,
    )

    print(f"Generated {OUTPUT_FILE} with {len(matches) + 2} URLs.")


if __name__ == "__main__":
    main()
