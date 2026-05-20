from docx import Document

doc = Document('filebieumau2.docx')
for i, el in enumerate(doc.element.body):
    tag = el.tag.split('}')[-1]
    if tag == 'p':
        text = el.text if hasattr(el, 'text') else ''
        # python-docx has a simpler way to read paragraph text:
        pass
    
# Let's print paragraph texts in order around the tables
for idx, para in enumerate(doc.paragraphs):
    if para.text.strip():
        print(f"P{idx}: {para.text.strip()}")
