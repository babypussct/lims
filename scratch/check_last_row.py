from docx import Document

for name in ['filebieumau2_FORM_CLEAN.docx', 'filebieumau2_TEMPLATE.docx']:
    try:
        doc = Document(name)
        print(f"\n=== {name} ===")
        table = doc.tables[1]
        print(f"Table 1 Rows count: {len(table.rows)}")
        for r_idx in range(len(table.rows)):
            cells = [c.text.strip() for c in table.rows[r_idx].cells]
            print(f"  Row {r_idx}: {cells}")
    except Exception as e:
        print(f"Error on {name}: {e}")
