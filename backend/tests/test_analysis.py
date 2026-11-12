import unittest
from io import BytesIO

import fitz
from fastapi import HTTPException
from docx import Document

from backend.main import analyze_match, extract_resume_text


class AnalyzeMatchTests(unittest.TestCase):
    def test_detects_matching_and_missing_keywords(self) -> None:
        result = analyze_match(
            "Requirements: Python, FastAPI, Docker, and 3+ years experience.",
            "Python developer with 4 years experience. Skills include Python and Docker.",
        )

        self.assertEqual(result["matchedKeywords"], ["Docker", "Python"])
        self.assertEqual(result["missingKeywords"], ["FastAPI"])
        self.assertEqual(result["breakdown"]["experience"], 100)
        self.assertEqual(result["rewrites"], [])

    def test_rejects_empty_analysis_inputs(self) -> None:
        with self.assertRaises(HTTPException) as raised:
            analyze_match("   ", "resume")

        self.assertEqual(raised.exception.status_code, 422)

    def test_does_not_report_missing_years_when_job_has_no_years_requirement(self) -> None:
        result = analyze_match("Required skills: Python.", "Python developer.")

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
        table = document.add_table(rows=1, cols=1)
        table.cell(0, 0).text = "FastAPI"
        contents = BytesIO()
        document.save(contents)

        text = extract_resume_text("resume.docx", contents.getvalue())

        self.assertIn("Python resume experience", text)
        self.assertIn("FastAPI", text)


if __name__ == "__main__":
    unittest.main()
