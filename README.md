# Adarsh Kumar — Portfolio

An interactive 3D portfolio: a real-time rendered character, GSAP scroll choreography,
a physics-driven tech stack and a custom cursor. Built with React, TypeScript, Vite,
Three.js, React Three Fiber and GSAP.

**Live:** [adarshkumar-one.vercel.app](https://adarshkumar-one.vercel.app)

---

## What's inside

| Section | What it does |
| --- | --- |
| Loading | decrypts the character model (AES-CBC), then drives a real upload-style counter |
| Landing | name, role, and a masked word sweep over the character |
| About | who I am, in full |
| What I Do | AI engineering / design-led web development |
| Career | 2023 → now: foundations, freelance since Jan 2024, AI work since 2025, education |
| Work | 48-model chat router, gallery server, HF Spaces, client websites |
| Tech Stack | physics spheres you can knock around |
| Contact | links, education, credits |

The character is a GLB encrypted with AES-CBC and decrypted in the browser at load
(`src/components/Character/utils/decrypt.ts`) — the model file alone is not usable.

---

## Run it

```bash
npm ci
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build → dist/
npm run preview
```

Deploys to Vercel as a static Vite build (`dist/`).

---

## Stack

React 18 · TypeScript · Vite · Three.js · React Three Fiber · drei · postprocessing
· rapier / cannon · GSAP + ScrollTrigger + ScrollSmoother · react-icons ·
react-fast-marquee · @vercel/analytics

---

## Notes

- `public/models/character.enc` is the encrypted character; `encrypt.cjs` documents the
  format (16-byte IV prefix, then AES-CBC ciphertext).
- Geist is loaded from Google Fonts in `src/index.css`. If it is blocked, the site
  falls back to the system sans — everything still works.
- `public/Adarsh-Kumar-CV.pdf` is the résumé served by the RESUME button.

---

## Contact

**Adarsh Kumar** — AI Developer & ML Engineer, Delhi, India
devadarshukumar@gmail.com ·
[GitHub](https://github.com/Adarshukumar) ·
[LinkedIn](https://www.linkedin.com/in/adarshu07/) ·
[Hugging Face](https://huggingface.co/AdarshJi) ·
[Instagram](https://www.instagram.com/adarshu.io/)
