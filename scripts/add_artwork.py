#!/usr/bin/env python3
"""
Add a new piece of artwork to the Brushmagic gallery.

Usage (flags):
  python3 scripts/add_artwork.py ~/Desktop/photo.jpg \
      --title "Rainbow Dragon" --age 6 --date 2026-07-15 \
      --medium "Crayon and marker" \
      --description "A dragon that breathes rainbows instead of fire."

Usage (interactive — just leave out flags and it'll ask):
  python3 scripts/add_artwork.py ~/Desktop/photo.jpg

Remove the placeholder "Sample:" entries once you have real artwork in:
  python3 scripts/add_artwork.py --remove-samples
"""

import argparse
import datetime
import json
import os
import re
import shutil
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART_DIR = os.path.join(ROOT, "images", "art")
DATA_FILE = os.path.join(ROOT, "js", "artworks-data.js")
MARKER = "const ARTWORKS = ["


def slugify(text):
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-") or "artwork"


def unique_filename(dest_dir, filename):
    base, ext = os.path.splitext(filename)
    candidate = filename
    n = 2
    while os.path.exists(os.path.join(dest_dir, candidate)):
        candidate = f"{base}-{n}{ext}"
        n += 1
    return candidate


def prompt(label, default=None, required=False):
    suffix = f" [{default}]" if default else ""
    while True:
        value = input(f"{label}{suffix}: ").strip()
        if not value and default is not None:
            return default
        if not value and required:
            print("  (required)")
            continue
        return value


def remove_samples():
    with open(DATA_FILE, "r") as f:
        content = f.read()

    pattern = re.compile(r'\{\s*title:\s*"Sample:.*?\},?\s*', re.S)
    new_content, count = pattern.subn("", content)

    with open(DATA_FILE, "w") as f:
        f.write(new_content)

    print(f"Removed {count} sample entr{'y' if count == 1 else 'ies'}.")


def add_artwork(args):
    if not os.path.isfile(args.image):
        sys.exit(f"Image not found: {args.image}")

    title = args.title or prompt("Title", required=True)

    age = args.age
    if age is None:
        age = int(prompt("Age (how old was she when she made it)", required=True))

    date = args.date
    if not date:
        date = prompt("Date made (YYYY-MM-DD)", default=datetime.date.today().isoformat())
    try:
        datetime.date.fromisoformat(date)
    except ValueError:
        sys.exit(f"Date must be in YYYY-MM-DD format, got: {date}")

    medium = args.medium if args.medium is not None else prompt("Medium (optional)", default="")
    description = args.description if args.description is not None else prompt("Description (optional)", default="")

    os.makedirs(ART_DIR, exist_ok=True)
    ext = os.path.splitext(args.image)[1].lower()
    filename = unique_filename(ART_DIR, slugify(title) + ext)
    dest_path = os.path.join(ART_DIR, filename)
    shutil.copy2(args.image, dest_path)
    rel_image_path = f"images/art/{filename}"

    entry = "\n".join([
        "  {",
        f"    title: {json.dumps(title)},",
        f"    image: {json.dumps(rel_image_path)},",
        "    placeholderColor: null,",
        f"    date: {json.dumps(date)},",
        f"    age: {age},",
        f"    medium: {json.dumps(medium)},",
        f"    description: {json.dumps(description)}",
        "  },",
    ])

    with open(DATA_FILE, "r") as f:
        content = f.read()

    idx = content.find(MARKER)
    if idx == -1:
        sys.exit(f"Could not find '{MARKER}' in {DATA_FILE} — has the file been edited?")
    insert_at = idx + len(MARKER)
    new_content = content[:insert_at] + "\n" + entry + content[insert_at:]

    with open(DATA_FILE, "w") as f:
        f.write(new_content)

    print(f'Added "{title}" (age {age}, {date})')
    print(f"  Photo copied to {os.path.relpath(dest_path, ROOT)}")
    print(f"  Entry added to {os.path.relpath(DATA_FILE, ROOT)}")


def main():
    parser = argparse.ArgumentParser(description="Add a new artwork to the Brushmagic gallery.")
    parser.add_argument("image", nargs="?", help="Path to the photo of the artwork")
    parser.add_argument("--title", help="Title of the artwork")
    parser.add_argument("--age", type=int, help="Her age when she made it")
    parser.add_argument("--date", help="Date made, YYYY-MM-DD (defaults to today)")
    parser.add_argument("--medium", help="e.g. Crayon, Watercolor")
    parser.add_argument("--description", help="Short caption")
    parser.add_argument("--remove-samples", action="store_true", help="Remove placeholder 'Sample:' entries")
    args = parser.parse_args()

    if args.remove_samples and not args.image:
        remove_samples()
        return

    if not args.image:
        parser.error("an image path is required unless using --remove-samples")

    add_artwork(args)
    if args.remove_samples:
        remove_samples()


if __name__ == "__main__":
    main()
