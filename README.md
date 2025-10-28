# Audiomate

Create broadcast‑ready audio ads from plain text and brand inputs. Audiomate generates scripts, selects voices, and mixes background music to deliver polished MP3s in seconds.

---

### Overview

Audiomate consists of a Python backend (Flask) and a React + Vite frontend. The backend integrates with the ElevenLabs API for speech synthesis and can optionally mix preloaded background music. The frontend provides an interface to enter product details, generate a script, and render the final ad.

### Key Features

- **Script generation**: Produces concise, on‑brand ad copy using an LLM.
- **Voice selection**: Chooses an ElevenLabs voice based on tone, gender, and language preferences.
- **Text‑to‑speech**: Converts the generated script to high‑quality speech.
- **Background music**: Mixes a selectable music bed (ambient, upbeat, classical, electronic, acoustic) beneath narration.
- **Ready‑to‑share output**: Exports MP3s to the `outputs` directory with meaningful file names.

---

### Prerequisites

- Python 3.10+
- Node.js 18+
- ElevenLabs API key (set `ELEVENLABS_API_KEY` in your environment or a `.env` file)

---

### Setup

1) Backend

```bash
pip install -r requirements.txt
```

Environment variables:

- `ELEVENLABS_API_KEY`: required to generate speech

Start the API server:

```bash
python api.py
```

This launches Flask on `http://localhost:5001` and serves static files from `frontend/dist` if present.

2) Frontend

```bash
cd frontend
npm install
npm run dev
```

The development server runs on `http://localhost:8080`.

Build for production:

```bash
npm run build
```

The build output is written to `frontend/dist` and is served by the Flask app.

---

### API Endpoints (Backend)

- `POST /api/generate-script`
  - Body: `{ product_name, product_details, company_context, target_audience, distribution_method, desired_length, example_output, language }`
  - Returns: `{ script }`

- `POST /api/generate-speech`
  - Body: `{ script, tone, gender, background_music, language }`
  - Returns: `{ filename, filepath }` where files are stored under `outputs/`

- `GET /api/audio/:filename`
  - Streams an MP3 from the `outputs` directory.

---

### Development Tips

- Ensure `.env` is present with a valid `ELEVENLABS_API_KEY` before calling the speech endpoint.
- Production builds of the frontend should be generated before running the Flask server to enable static serving from `frontend/dist`.
- Output files are timestamped for easier organization, for example: `speech_professional_female_english_bg_upbeat_YYYYMMDD_HHMMSS.mp3`.

---

### Project Structure

- `api.py` — Flask server exposing REST endpoints and serving the frontend
- `speech_generator.py` — ElevenLabs integration and optional audio mixing
- `frontend/` — React + Vite app (UI)
- `outputs/` — Generated MP3 files
- `background_music/` — Local music beds used for mixing

---

### License

This project is provided as‑is for demonstration purposes. Review licenses for any third‑party services or libraries you use.
