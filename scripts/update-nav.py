#!/usr/bin/env python3
"""Regenerate the grouped navigation inlined in each public page.

    scripts/update-nav.py          # rewrite the nav block in every page
    scripts/update-nav.py --check  # verify every page already matches

The header is inlined in each page so it paints with the document. Edit the
GROUPS table here, not ten HTML files. 404.html is deliberately minimal and
is left alone.
"""
import argparse
import pathlib
import re
import sys

SITE = pathlib.Path(__file__).resolve().parent.parent / "site"

GROUPS = [
    ("cases", "Cases", [
        ("/csos-order.html", "CSOS Order", "csos-order.html"),
        ("/csos-order-518015.html", "Complaint Two <small>518015</small>", "csos-order-518015.html"),
        ("/csos-518015-statement.html", "518015 Statement", "csos-518015-statement.html"),
    ]),
    ("documents", "Documents", [
        ("/charter.html", "Charter", "charter.html"),
        ("/article.html", "Article", "article.html"),
        ("/governance-article.html", "Governance", "governance-article.html"),
        ("/draft-resolution-clause-5-5.docx", "Draft motion", "draft-resolution-clause-5-5.docx"),
    ]),
    ("campaign", "Campaign", [
        ("/#about", "About", None),
        ("/#position", "Position", None),
        ("/why.html", "Why", "why.html"),
        ("/#rights", "Rights", None),
        ("/#contact", "Contact", None),
    ]),
]

# Pages whose own link gets aria-current="page". All other pages have none.
CURRENT = {page for _, _, links in GROUPS for _, _, page in links if page}


def build_nav(indent: str, current: str | None) -> str:
    lines = [f'{indent}<nav class="nav-links" id="site-nav">']
    for key, label, links in GROUPS:
        lines.append(f'{indent}    <div class="nav-group">')
        lines.append(
            f'{indent}        <button class="nav-trigger" type="button" '
            f'aria-expanded="false" aria-controls="nav-{key}">'
            f'{label} <span class="nav-chevron" aria-hidden="true"></span></button>'
        )
        lines.append(f'{indent}        <div class="nav-panel" id="nav-{key}">')
        lines.append(f'{indent}            <div class="nav-panel-inner">')
        for href, text, page in links:
            active = ' aria-current="page"' if page and page == current else ""
            download = " download" if href.endswith(".docx") else ""
            lines.append(f'{indent}                <a href="{href}"{active}{download}>{text}</a>')
        lines.append(f'{indent}            </div>')
        lines.append(f'{indent}        </div>')
        lines.append(f'{indent}    </div>')
    lines.append(f"{indent}</nav>")
    return "\n".join(lines)


def page_markup(path: pathlib.Path, nav: str) -> str:
    text = path.read_text(encoding="utf-8")
    match = re.search(
        r'(?m)^(?P<indent>[ \t]*)<nav class="nav-links"[^>]*>.*?</nav>',
        text,
        re.S,
    )
    if not match:
        raise RuntimeError(f"no nav block found in {path.name}")
    text = text[:match.start()] + nav + text[match.end():]
    return text.replace(
        '<button class="burger" aria-label="Toggle menu" aria-expanded="false">',
        '<button class="burger" aria-label="Toggle menu" aria-expanded="false" aria-controls="site-nav">',
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="verify without writing")
    args = parser.parse_args()

    changed = []
    for path in sorted(SITE.glob("*.html")):
        if path.name == "404.html":
            continue
        current = path.name if path.name in CURRENT else None
        match = re.search(
            r'(?m)^(?P<indent>[ \t]*)<nav class="nav-links"[^>]*>.*?</nav>',
            path.read_text(encoding="utf-8"),
            re.S,
        )
        indent = match.group("indent") if match else "            "
        if match and not indent:
            # Older generated blocks left the opening <nav> line unindented.
            # Infer the indent from its first child so --check can converge.
            child = re.search(r'(?m)^([ \t]+)<div class="nav-group">', match.group(0))
            if child and child.group(1).endswith("    "):
                indent = child.group(1)[:-4]
        expected = page_markup(path, build_nav(indent, current))
        actual = path.read_text(encoding="utf-8")
        if expected == actual:
            continue
        changed.append(path.name)
        if not args.check:
            path.write_text(expected, encoding="utf-8")

    if args.check:
        if changed:
            print("nav out of date:", ", ".join(changed), file=sys.stderr)
            return 1
        print("all page navs match scripts/update-nav.py")
        return 0

    print("updated:", ", ".join(changed) if changed else "nothing (already current)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
