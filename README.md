# CandidateSync

Compare a resume with a job description, review keyword matches and gaps, and export a one-page report.
The local Python service uses explainable matching heuristics, not a hosted AI model.
Built with React, TypeScript, Vite, Tailwind CSS v4, and FastAPI.

## Run it

Install Docker Desktop (Windows/macOS) or Docker Engine with Docker Compose (Linux),
then run the single launcher from the project folder:

```bash
python run.py
```

Open [http://localhost:8080](http://localhost:8080). The launcher builds and starts the
frontend and local Python API together. Press `Ctrl+C` to stop. No Node.js, Python
packages, hosted AI service, or API key is needed for normal use—only Docker.

### Run for development

```bash
npm install
npm run dev
```

To run without Docker during development, use Node.js and Python 3.12+. Start the backend
in a second terminal:

```bash
python -m venv .venv
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# macOS/Linux:
source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --port 8000
```

Vite proxies API requests to the Python service at `localhost:8000`.

Run backend tests from the project directory with:

```bash
python -m unittest discover -s backend/tests
```

## Project structure

```
src/
├── App.tsx                      Page shell: header, step navigation, view switch
├── index.css                    Design tokens (light and dark), fonts, print styles
├── types/                       Shared TypeScript types
├── data/                        Static content: job descriptions and sample resumes
├── services/
│   ├── screeningApi.ts          Calls the local Python matcher
│   └── documentParser.ts        Upload validation and backend text extraction
├── hooks/
│   ├── useScreener.ts           All screening state and actions
│   ├── useTheme.ts              Light/dark theme, remembered between visits
│   └── useClipboard.ts          Copy-to-clipboard with a "Copied" state
├── lib/                         Small pure helpers (score bands, tone classes, job titles)
├── components/
│   ├── layout/                  Header, StepNav, PageContainer
│   └── ui/                      Button, Chip, Notice, Field, CodeBlock, and so on
└── features/                    One folder per screen
    ├── setup/                   Role picker, resume upload, run bar
    ├── analysis/                Score summary, breakdown, keywords, strengths and gaps
    ├── tailoring/               Guidance for manual resume tailoring
    ├── report/                  Printable one-page report
    ├── developer/               Local backend details and limitations
    └── ScreenerWorkspace.tsx    Chooses which step to show
backend/
├── main.py                      FastAPI local matcher and PDF/DOCX extraction
└── tests/                       Backend unit tests
```

Rule of thumb: components in `features/` and `components/` only render. State lives in
`hooks/useScreener.ts`, and anything that talks to a server lives in `services/`.

## Local matching limitations

The backend uses a curated skills dictionary and simple evidence checks, not a generative AI model.
Scores are indicative and should not be used as the sole basis for hiring decisions. Bullet rewrites
are left empty rather than generated or inferred. PDF extraction requires selectable text; scanned
PDFs and legacy `.doc` files are not supported. Uploaded files are processed by the local backend
and are not sent to an external model.

## Design tokens

All colours are CSS variables in `src/index.css` and are mapped to Tailwind names
(`bg-surface`, `text-soft`, `border-line`, `text-good`, and so on), so components never branch on dark mode.
Change a value once and the whole app follows. Green, amber and red are reserved for match quality.
