/*
  ADD NEW ARTWORK HERE.

  1. Drop the photo file into images/art/  (e.g. images/art/rainbow-dragon.jpg)
  2. Copy one of the objects below and fill in the details.
  3. If you don't have a photo yet, leave "image" as null and set a
     "placeholderColor" — a nice gradient card will show instead.

  Fields:
    title            - name of the artwork
    image            - path to the photo, e.g. "images/art/my-file.jpg", or null
    placeholderColor - CSS gradient used when there's no image yet
    date             - "YYYY-MM-DD" (used for sorting + year filter)
    age              - her age when she made it (used for age filter)
    medium           - e.g. "Crayon", "Watercolor", "Marker + collage"
    description      - a short caption, in her voice if you like
*/

const ARTWORKS = [
  {
    title: "Sample: Rainbow Dragon",
    image: null,
    placeholderColor: "linear-gradient(135deg, #FF6B6B, #FFD93D)",
    date: "2026-03-15",
    age: 6,
    medium: "Crayon and marker",
    description: "Replace this with your daughter's first piece! A dragon that breathes rainbows instead of fire."
  },
  {
    title: "Sample: Our House",
    image: null,
    placeholderColor: "linear-gradient(135deg, #4ECDC4, #A78BFA)",
    date: "2026-01-10",
    age: 5,
    medium: "Watercolor",
    description: "Swap in a real photo by editing js/artworks-data.js"
  },
  {
    title: "Sample: Sunny Garden",
    image: null,
    placeholderColor: "linear-gradient(135deg, #FFD93D, #6BCB77)",
    date: "2025-06-02",
    age: 5,
    medium: "Colored pencil",
    description: "Every card here is just a placeholder until you add real artwork."
  },
  {
    title: "Sample: Space Adventure",
    image: null,
    placeholderColor: "linear-gradient(135deg, #A78BFA, #FF6B6B)",
    date: "2024-11-20",
    age: 4,
    medium: "Marker",
    description: "Delete these samples once you've added a few of her own pieces."
  }
];
