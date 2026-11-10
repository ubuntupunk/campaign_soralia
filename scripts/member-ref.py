#!/usr/bin/env python3
"""Resolve member references against the private mapping.

    scripts/member-ref.py m-001
    scripts/member-ref.py --find someone@example.com
    scripts/member-ref.py --list

Reads emails/private/members.csv, which is gitignored. Never write its output
into a tracked file.
"""
import csv
import pathlib
import sys

MEMBERS = pathlib.Path(__file__).resolve().parent.parent / "emails/private/members.csv"
SENDS = pathlib.Path(__file__).resolve().parent.parent / "emails/private/sent-log.csv"


def load():
    with MEMBERS.open(encoding="utf-8") as f:
        return list(csv.DictReader(f))


def sends_for(member_id):
    if not SENDS.exists():
        return []
    with SENDS.open(encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    out = []
    for r in rows:
        ref = r.get("member_id") or ""
        if ref == member_id:
            out.append(r)
    return out


def main(argv):
    rows = load()
    if not argv or argv[0] in ("-h", "--help"):
        print(__doc__.strip())
        return 0

    if argv[0] == "--list":
        for r in rows:
            print(f"{r['member_id']:8} {r['name']:20} {r['email']}")
        return 0

    if argv[0] == "--find":
        if len(argv) < 2:
            print("usage: member-ref.py --find EMAIL")
            return 2
        target = argv[1].strip().lower()
        for r in rows:
            if r["email"].lower() == target:
                print(f"{r['member_id']}  {r['name']}  {r['email']}")
                return 0
        print("not found")
        return 1

    ref = argv[0]
    match = [r for r in rows if r["member_id"] == ref]
    if not match:
        print(f"unknown reference: {ref}")
        return 1
    r = match[0]
    print(f"{r['member_id']}  {r['name']}  {r['email']}  unit={r['unit'] or '-'}")
    history = sends_for(ref)
    if history:
        print(f"\n{len(history)} send(s):")
        for h in history:
            print(f"  {h.get('sent_date')}  {h.get('campaign')}  {h.get('message_id')}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
