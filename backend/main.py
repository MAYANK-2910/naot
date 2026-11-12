import re
from io import BytesIO
from typing import Annotated
from zipfile import BadZipFile

import fitz
from docx import Document
from docx.opc.exceptions import PackageNotFoundError
from fastapi import FastAPI, File, HTTPException, UploadFile
from pydantic import BaseModel, Field

app = FastAPI(title="Resume Screener Local Matcher", version="1.0.0")

MAX_UPLOAD_BYTES = 10 * 1024 * 1024

# Terms are intentionally curated and explainable; this service does not call an LLM.
SKILL_TERMS: dict[str, tuple[str, ...]] = {
    "A/B Testing": ("a/b testing", "ab testing", "split testing"),
    "Agile/Scrum": ("agile/scrum", "agile scrum", "scrum", "agile"),
    "AWS": ("aws", "amazon web services"),
    "Amplitude": ("amplitude",),
    "Apache Spark": ("apache spark", "spark"),
    "Azure": ("azure",),
    "CI/CD": ("ci/cd", "ci cd", "continuous integration", "continuous delivery"),
    "Cypress": ("cypress",),
    "Docker": ("docker", "containers", "containerization"),
    "ETL": ("etl", "data pipelines"),
    "Express": ("express.js", "express"),
    "FastAPI": ("fastapi",),
    "Figma": ("figma",),
    "Flask": ("flask",),
    "Google Analytics": ("google analytics", "ga4"),
    "GraphQL": ("graphql",),
    "Hugging Face": ("hugging face", "huggingface"),
    "Java": ("java",),
    "JavaScript": ("javascript",),
    "Jest": ("jest",),
    "Jira": ("jira",),
    "Kubernetes": ("kubernetes", "k8s"),
    "LangChain": ("langchain",),
    "Machine Learning": ("machine learning", "ml models"),
    "Microsoft Office": ("microsoft office", "excel", "powerpoint"),
    "Mixpanel": ("mixpanel",),
    "MongoDB": ("mongodb", "mongo"),
    "Natural Language Processing": ("natural language processing", "nlp"),
    "Next.js": ("next.js", "nextjs"),
    "Node.js": ("node.js", "nodejs", "node js"),
    "PostgreSQL": ("postgresql", "postgres"),
    "Product Management": ("product management", "product manager"),
    "Product Roadmap": ("product roadmap", "roadmap ownership"),
    "PyTorch": ("pytorch",),
    "Python": ("python",),
    "R": ("r programming", "r language"),
    "REST APIs": ("rest api", "restful api", "rest apis", "restful apis"),
    "Redis": ("redis",),
    "Redux": ("redux",),
    "Retrieval-Augmented Generation": ("retrieval augmented generation", "rag"),
    "SQL": ("sql",),
    "Scikit-learn": ("scikit-learn", "scikit learn", "sklearn"),
    "Snowflake": ("snowflake",),
    "Stakeholder Management": ("stakeholder management", "stakeholders"),
    "Tableau": ("tableau",),
    "Tailwind CSS": ("tailwind css", "tailwind"),
    "TensorFlow": ("tensorflow",),
    "Transformers": ("transformers", "transformer models"),
    "TypeScript": ("typescript", "ts"),
    "User Research": ("user research", "customer research", "user interviews"),
    "Vector Databases": ("vector database", "vector databases", "vector db", "vector dbs"),
    "WebAssembly": ("webassembly", "wasm"),
    "WordPress": ("wordpress",),
}

DEGREE_TERMS = (
    "bachelor",
    "master",
    "phd",
    "doctorate",
    "associate degree",
    "b.s.",
    "b.a.",
    "m.s.",
    "m.a.",
)
EDUCATION_HEADERS = ("education", "academic background", "qualifications")
RESUME_SECTIONS = ("experience", "skills", "education", "summary", "projects")


class MatchRequest(BaseModel):
    job_description: str = Field(min_length=1, max_length=100_000)
    resume_text: str = Field(min_length=1, max_length=100_000)


def _validate_pdf(contents: bytes) -> str:
    with fitz.open(stream=contents, filetype="pdf") as document:
        if document.needs_pass:
            raise HTTPException(status_code=422, detail="The PDF is password-protected.")
        return "\n".join(page.get_text() for page in document)


def _validate_docx(contents: bytes) -> str:
    document = Document(BytesIO(contents))
    paragraphs = [paragraph.text for paragraph in document.paragraphs]
    table_rows = [
        " ".join(cell.text for cell in row.cells)
        for table in document.tables
        for row in table.rows
    ]
    return "\n".join(paragraphs + table_rows)


def _normalize(text: str) -> str:
    return re.sub(r"[^\w]+", " ", text.casefold()).strip()


def _contains_term(text: str, term: str) -> bool:
    normalized_text = f" {_normalize(text)} "
    normalized_term = _normalize(term)
    return bool(normalized_term) and f" {normalized_term} " in normalized_text


def _matching_terms(text: str, terms: list[str] | tuple[str, ...]) -> list[str]:
    return [term for term in terms if _contains_term(text, term)]


def _extract_keywords(job_description: str) -> list[str]:
    return [
        label
        for label, aliases in SKILL_TERMS.items()
        if any(_contains_term(job_description, alias) for alias in aliases)
    ]


def _score_experience(job_description: str, resume_text: str) -> int:
    required = re.search(r"\b(\d+)\+?\s*(?:years|yrs)\b", job_description, re.IGNORECASE)
    candidate = re.search(r"\b(\d+)\+?\s*(?:years|yrs)\b", resume_text, re.IGNORECASE)
    if not required:
        return 75 if _contains_term(resume_text, "experience") else 55
    if not candidate:
        return 35
    return min(100, round(int(candidate.group(1)) / int(required.group(1)) * 100))


def _score_education(job_description: str, resume_text: str) -> int:
    required_degrees = _matching_terms(job_description, DEGREE_TERMS)
    if not required_degrees:
        return 75 if _matching_terms(resume_text, EDUCATION_HEADERS) else 60
    return 100 if any(_contains_term(resume_text, degree) for degree in required_degrees) else 25


def _score_ats(resume_text: str) -> int:
    sections = sum(_contains_term(resume_text, section) for section in RESUME_SECTIONS)
    has_contact = bool(
        re.search(r"\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b", resume_text, re.IGNORECASE)
        or re.search(r"\+?[\d][\d ().-]{7,}\d", resume_text)
    )
    return min(100, 25 + sections * 12 + (25 if has_contact else 0))


def analyze_match(job_description: str, resume_text: str) -> dict[str, object]:
    if not job_description.strip() or not resume_text.strip():
        raise HTTPException(status_code=422, detail="Job description and resume text are required.")

    keywords = _extract_keywords(job_description)
    matched = [term for term in keywords if any(_contains_term(resume_text, alias) for alias in SKILL_TERMS[term])]
    missing = [term for term in keywords if term not in matched]
    skills_score = round(len(matched) / len(keywords) * 100) if keywords else 50
    experience_score = _score_experience(job_description, resume_text)
    has_years_requirement = re.search(r"\b\d+\+?\s*(?:years|yrs)\b", job_description, re.IGNORECASE) is not None
    education_score = _score_education(job_description, resume_text)
    ats_score = _score_ats(resume_text)
    overall_score = round(
        skills_score * 0.6 + experience_score * 0.2 + education_score * 0.1 + ats_score * 0.1
    )

    if overall_score >= 80:
        verdict = "Strong match based on the skills and evidence found in the resume."
    elif overall_score >= 60:
        verdict = "Partial match. Review the missing requirements before moving forward."
    else:
        verdict = "Limited match. Several requirements were not found in the resume."

    strengths = []
    if matched:
        strengths.append(f"Resume evidence matches {len(matched)} of {len(keywords)} identified role keywords.")
        strengths.append(f"Relevant matching terms include {', '.join(matched[:5])}.")
    else:
        strengths.append("No matching terms from the local skill dictionary were found.")
    if has_years_requirement and experience_score >= 75:
        strengths.append("The resume includes an experience signal that meets or approaches the stated requirement.")

    gaps = []
    if missing:
        gaps.append(f"Role keywords not found in the resume: {', '.join(missing[:8])}.")
    if has_years_requirement and experience_score < 60:
        gaps.append("The resume does not provide enough explicit years-of-experience evidence for this role.")
    if education_score < 50:
        gaps.append("The degree requirement was not found in the resume text.")
    if not gaps:
        gaps.append("No major gaps were detected by the local keyword and evidence checks.")

    return {
        "overallScore": overall_score,
        "verdict": verdict,
        "breakdown": {
            "skills": skills_score,
            "experience": experience_score,
            "education": education_score,
            "ats": ats_score,
        },
        "matchedKeywords": matched,
        "missingKeywords": missing,
        "strengths": strengths[:3],
        "gaps": gaps[:3],
        "rewrites": [],
    }


def extract_resume_text(filename: str, contents: bytes) -> str:
    extension = filename.rsplit(".", 1)[-1].casefold() if "." in filename else ""
    if extension not in {"pdf", "docx"}:
        raise HTTPException(status_code=415, detail="Upload a PDF or DOCX file. Legacy .doc files are not supported.")
    if not contents:
        raise HTTPException(status_code=422, detail="The uploaded file is empty.")
    if len(contents) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="The uploaded file exceeds the 10 MB limit.")

    try:
        text = _validate_pdf(contents) if extension == "pdf" else _validate_docx(contents)
    except (fitz.FileDataError, RuntimeError, BadZipFile, PackageNotFoundError) as error:
        raise HTTPException(status_code=422, detail="The file could not be read. Check that it is a valid PDF or DOCX.") from error

    text = text.strip()
    if not text:
        raise HTTPException(
            status_code=422,
            detail="No selectable text was found. Scanned PDFs need OCR before they can be analyzed.",
        )
    return text


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/v1/extract-text")
async def extract_text(file: Annotated[UploadFile, File(...)]) -> dict[str, str]:
    filename = file.filename or ""
    contents = await file.read(MAX_UPLOAD_BYTES + 1)
    text = extract_resume_text(filename, contents)
    return {"filename": filename, "text": text}


@app.post("/api/v1/analyze-match")
def analyze_match_endpoint(request: MatchRequest) -> dict[str, object]:
    return analyze_match(request.job_description, request.resume_text)
