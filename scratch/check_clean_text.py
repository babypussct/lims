from docx import Document

doc = Document('filebieumau2_FORM_CLEAN.docx')
for idx, para in enumerate(doc.paragraphs):
    if para.text.strip():
        print(f"P{idx}: {para.text.strip()}")
