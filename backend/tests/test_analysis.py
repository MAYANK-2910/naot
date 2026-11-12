import unittest
from io import BytesIO

import fitz
from fastapi import HTTPException
from docx import Document

from backend.main import analyze_match, extract_resume_text


class AnalyzeMatchTests(unittest.TestCase):
    def test_detects_matching_and_missing_keywords(self) -> None:
        result = analyze_match(
            "Senior Engineer",
            "Requirements: Python, FastAPI, Docker, and 3+ years experience.",
            "- Python developer with 4 years experience. Skills include Python and Docker.",
        )

        self.assertEqual(result["matchedKeywords"], ["Docker", "Python"])
        self.assertEqual(result["missingKeywords"], ["FastAPI"])
        self.assertEqual(result["breakdown"]["experience"], 100)
        self.assertEqual(len(result["rewrites"]), 1)
        suggestion = result["rewrites"][0]
        self.assertEqual(
            suggestion["original"],
            "Python developer with 4 years experience. Skills include Python and Docker.",
        )
        self.assertIn("Docker, Python", suggestion["impact"])
        self.assertNotIn("FastAPI", suggestion["suggested"])

    def test_tailoring_suggestions_only_use_job_keywords_found_in_resume_bullets(self) -> None:
        result = analyze_match(
            "Frontend Engineer",
            "Requirements: React, TypeScript, Docker, and Kubernetes.",
            (
                "EXPERIENCE\n"
                "- Built dashboards with React and TypeScript for customer reporting.\n"
                "- Coordinated a design review and wrote project notes.\n"
                "SKILLS\n"
                "Docker, Kubernetes"
            ),
        )

        self.assertEqual(len(result["rewrites"]), 1)
        self.assertEqual(result["rewrites"][0]["impact"], "Role keywords already evidenced in this bullet: React, TypeScript.")
        self.assertIn("original scope and results", result["rewrites"][0]["suggested"])

    def test_returns_no_tailoring_suggestions_when_no_bullet_matches(self) -> None:
        result = analyze_match(
            "Coordinator",
            "Requirements: Python, FastAPI.",
            "- Coordinated project schedules and documented stakeholder decisions.",
        )

        self.assertEqual(result["rewrites"], [])

    def test_rejects_empty_analysis_inputs(self) -> None:
        with self.assertRaises(HTTPException) as raised:
            analyze_match("Developer", "   ", "resume")

        self.assertEqual(raised.exception.status_code, 422)

    def test_does_not_report_missing_years_when_job_has_no_years_requirement(self) -> None:
        result = analyze_match("Developer", "Required skills: Python.", "Python developer.")

    def test_role_title_keywords_are_included_in_matching(self) -> None:
        result = analyze_match(
            "React Engineer",
            "Requirements: TypeScript.",
            "- Built customer dashboards with React for business reporting.",
        )

        self.assertIn("React", result["matchedKeywords"])

        self.assertFalse(any("years-of-experience" in gap for gap in result["gaps"]))


class ResumeExtractionTests(unittest.TestCase):
    def test_rejects_legacy_word_documents(self) -> None:
        with self.assertRaises(HTTPException) as raised:
            extract_resume_text("resume.doc", b"legacy word")

        self.assertEqual(raised.exception.status_code, 415)

    def test_rejects_empty_file(self) -> None:
        with self.assertRaises(HTTPException) as raised:
            extract_resume_text("resume.pdf", b"")

        self.assertEqual(raised.exception.status_code, 422)

    def test_rejects_invalid_document_contents(self) -> None:
        for filename in ("resume.pdf", "resume.docx"):
            with self.subTest(filename=filename):
                with self.assertRaises(HTTPException) as raised:
                    extract_resume_text(filename, b"not a valid document")
                self.assertEqual(raised.exception.status_code, 422)

    def test_extracts_text_from_pdf(self) -> None:
        pdf = fitz.open()
        page = pdf.new_page()
        page.insert_text((72, 72), "Python resume experience")
        contents = pdf.tobytes()
        pdf.close()

        text = extract_resume_text("resume.pdf", contents)

        self.assertIn("Python resume experience", text)

    def test_extracts_paragraphs_and_tables_from_docx(self) -> None:
        document = Document()
        document.add_paragraph("Python resume experience")
        document.add_paragraph(
            "Built reliable Python services for customer reporting and internal analytics.",
            style="List Bullet",
        )
        table = document.add_table(rows=1, cols=1)
        table.cell(0, 0).text = "FastAPI"
        contents = BytesIO()
        document.save(contents)

        text = extract_resume_text("resume.docx", contents.getvalue())

        self.assertIn("Python resume experience", text)
        self.assertIn("• Built reliable Python services", text)
        self.assertIn("FastAPI", text)


if __name__ == "__main__":
    unittest.main()
