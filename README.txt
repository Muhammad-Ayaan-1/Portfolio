================================================================================
AYN — PREMIUM 2D ARTIST & ILLUSTRATOR PORTFOLIO WEBSITE
================================================================================

Welcome to your new portfolio website! This project is crafted specifically for
a 2D Artist, Character Designer, and Animator using pure HTML5, CSS3, Vanilla
JavaScript, and JSON. There are no heavy frameworks, complex dependencies, or
build steps required.

This file provides quick, step-by-step instructions on running, editing, and
deploying your website.

--------------------------------------------------------------------------------
1. PROJECT STRUCTURE
--------------------------------------------------------------------------------

AYN-Portfolio/
│
├── index.html          # Main HTML structure with all editable text sections
├── style.css           # Pure CSS3 styles, exact brand colors, and animations
├── script.js           # Vanilla JS for gallery, lightbox, filters, & navigation
├── artworks.json       # JSON database powering your artwork gallery
├── CV.pdf              # Your downloadable resume/CV
├── README.txt          # This instruction guide
│
└── assets/
    ├── images/         # Place your local artwork & profile images here
    │   ├── profile.jpg
    │   ├── mystic-warrior.jpg
    │   ├── cyber-rooftop.jpg
    │   ├── spirit-forest.jpg
    │   ├── mecha-pilot.jpg
    │   ├── solar-glider.jpg
    │   └── placeholder-artwork.png
    └── icons/          # Any optional icons or vector assets

--------------------------------------------------------------------------------
2. HOW TO RUN THE WEBSITE LOCALLY
--------------------------------------------------------------------------------

Because the website dynamically fetches "artworks.json", modern browsers require
an HTTP server rather than opening "file:///index.html" directly.

The easiest way to run the website locally:

1. Open Visual Studio Code.
2. Select "File" -> "Open Folder..." and choose this project folder.
3. Install the "Live Server" extension (by Ritwick Dey) from the VS Code Extensions tab.
4. Right-click "index.html" in the file explorer.
5. Click "Open with Live Server".
6. Your default web browser will open at http://127.0.0.1:5500 with the full,
   interactive website running!

Alternative options:
- Using Python: Open a terminal in the project folder and run:
    python -m http.server 3000
  Then open http://localhost:3000 in your browser.
- Using Node.js: Run `npx serve .`

--------------------------------------------------------------------------------
3. HOW TO ADD OR EDIT ARTWORK (JSON-POWERED GALLERY)
--------------------------------------------------------------------------------

You do NOT need to touch index.html or script.js to add, update, or remove artworks!
Everything is controlled by editing "artworks.json".

Step-by-step guide:
1. Open "artworks.json" in any text editor or VS Code.
2. Add a new artwork object. The gallery supports BOTH single images and
   multi-image projects (such as Line Art + Final Version):

Example 1: Single image artwork (any aspect ratio: vertical 3:4, square 1:1, or wide 16:9):
{
  "id": 7,
  "title": "Celestial Valkyrie",
  "description": "A vertical fantasy painting of a winged solar warrior.",
  "type": "Character Art",
  "image": "assets/images/valkyrie-vertical.jpg"
}

Example 2: Multi-image project (Line Art, Sketches, & Final version):
{
  "id": 8,
  "title": "Cyber Ronin",
  "description": "Character concept showing inking pass and final render.",
  "type": "Character Art",
  "image": "assets/images/ronin-final.jpg",
  "images": [
    {
      "url": "assets/images/ronin-final.jpg",
      "label": "Final Artwork",
      "caption": "Full-color digital render with volumetric lighting."
    },
    {
      "url": "assets/images/ronin-lineart.jpg",
      "label": "Clean Line Art",
      "caption": "Pure black-and-white inking detailing silhouette and armor."
    }
  ]
}

Aspect Ratio Auto-Adjustment:
- You do NOT need to crop your images to a fixed ratio! The gallery automatically
  uses responsive masonry columns that adjust to vertical portraits (3:4, 9:16),
  square canvases (1:1), and wide panoramas (16:9) naturally without cropping.

Multi-Image Viewer Features:
- Artwork cards automatically display a "2 Versions" badge when multiple images exist.
- In the Lightbox, visitors can switch versions with one click via pills or thumbnails,
  or browse with arrow buttons (< and >) and keyboard arrow keys (Left/Right).

Important JSON rules:
- Separate objects with commas (,) except the last one.
- Make sure each "id" is unique.
- Save and refresh your browser. Your new artworks appear instantly!

--------------------------------------------------------------------------------
4. HOW TO USE LOCAL IMAGES
--------------------------------------------------------------------------------

To use your own artwork images:
1. Save your artwork file (JPEG, PNG, or WebP) into the "assets/images/" folder.
   Example: assets/images/my-artwork.jpg
2. In "artworks.json", set:
   "image": "assets/images/my-artwork.jpg"

If an image fails to load or is missing, the site displays a graceful, elegant
artwork card fallback instead of a broken image icon.

--------------------------------------------------------------------------------
5. HOW TO REPLACE YOUR CV / RESUME
--------------------------------------------------------------------------------

1. Export your resume/CV as a PDF from your favorite tool (Canva, Word, InDesign, etc.).
2. Name the file "CV.pdf" (capital C and V).
3. Place it directly in the project root folder, replacing the starter "CV.pdf".
4. When visitors click "Download CV" in the top navigation, hero section, or
   footer, your actual CV will download with the filename "AYN-CV.pdf".

--------------------------------------------------------------------------------
6. HOW TO UPDATE ARTIST INFORMATION IN INDEX.HTML
--------------------------------------------------------------------------------

All textual information is cleanly structured in "index.html" with descriptive
comments:

- Hero Heading, Subtitle & Portrait Artwork:
  Look for `<section id="home">` in index.html to adjust the main heading and intro text.
  To replace the featured portrait artwork in the hero section:
  Replace "assets/images/featured-artwork.jpg" with your own portrait image (vertical 3:4 ratio).
  The frame automatically styles and frames your artwork with glowing accents and corner brackets.
- Intro Loading Screen (3-4 Seconds):
  Whenever the website loads, a creative loading animation plays with the message:
  "Welcome to the Ayaan's portfolio", along with a progress bar and stage updates.
  Visitors can also click "Skip Intro" to jump in immediately.
- About Section:
  Look for `<section id="about">` to edit your artist biography and highlights.
  To replace your profile photo, replace "assets/images/profile.jpg".
- Experience Timeline:
  Look for `<section id="experience">` to add or edit roles, studios, dates, and skill tags.
- Skills Section:
  Look for `<section id="skills">` to update your creative disciplines and software tools.
- Email & Social Media:
  Look for `<section id="contact">` to update your email and social media links
  (ArtStation, Behance, Instagram, LinkedIn).
  In "script.js", update the constant `ARTIST_EMAIL = 'ayaanzakir12345@gmail.com'`
  with your desired contact address.
- Theme Changer (Light & Dark Mode):
  The theme button in the top navigation and mobile drawer toggles between
  light and dark aesthetics with smooth transitions. User preference is saved
  automatically in localStorage and honors the visitor's OS preference by default.

--------------------------------------------------------------------------------
7. ANIMATIONS & SCROLL FEATURES
--------------------------------------------------------------------------------

- Dynamic Reading Scroll Progress Bar: Fills smoothly across the top of the header.
- Floating Back-to-Top Button: Appears automatically when scrolling past the hero.
- Animated Milestone Numbers: Numbers in the About section count up on scroll reveal.
- Ambient Canvas Stardust: Subtle glowing particles float gently in the background.
- 3D Interactive Card Tilt: Hovering over artwork cards tilts them in 3D perspective.

--------------------------------------------------------------------------------
8. HOW TO PUBLISH YOUR PORTFOLIO TO THE WEB
--------------------------------------------------------------------------------

Because this is a 100% static website, you can host it for free on any modern
static hosting service:

- GitHub Pages:
  Push this repository to GitHub and enable GitHub Pages in Settings -> Pages.
- Vercel:
  Drag and drop your project folder or connect your Git repository.
- Netlify:
  Drag and drop the folder directly into Netlify Drop.
- Cloudflare Pages:
  Connect your repo and deploy with zero build configuration.

IMPORTANT: Ensure you upload all files, including:
- index.html
- style.css
- script.js
- artworks.json
- CV.pdf
- assets/ directory (with all your images)

Congratulations on your new portfolio!
================================================================================
