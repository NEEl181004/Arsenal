import zipfile
import xml.etree.ElementTree as ET
import os
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

docs_dir = r"d:\Arsenal\docs"
files = [
    "auditd (2).docx",
    "dnsrecon (2).docx",
    "hping.docx",
    "hydra (2).docx",
    "Nuclei (2).docx",
    "shodan (2).docx",
    "urlscan.docx",
    "web-check.docx",
    "wget (2).docx",
    "whatweb (2).docx"
]

def parse_and_dump_docx(filename):
    filepath = os.path.join(docs_dir, filename)
    if not os.path.exists(filepath):
        print(f"Skipping missing file: {filename}")
        return

    # Determine output json filename
    base_name = filename.replace(" (2)", "").replace(".docx", "")
    output_json = os.path.join(docs_dir, f"extracted_{base_name}_structure.json")

    print(f"Parsing {filename} -> {output_json}")

    with zipfile.ZipFile(filepath, 'r') as docx:
        # Get relationships
        rels_xml = docx.read('word/_rels/document.xml.rels')
        rels_root = ET.fromstring(rels_xml)
        rid_map = {}
        for child in rels_root:
            rid = child.attrib.get('Id')
            target = child.attrib.get('Target')
            if target and 'media' in target:
                rid_map[rid] = os.path.basename(target)
                
        # Read document XML
        doc_xml = docx.read('word/document.xml')
        root = ET.fromstring(doc_xml)
        
        elements = []
        
        def process_element(elem):
            if elem.tag.endswith('}p'):
                text = "".join(node.text for node in elem.iter() if node.tag.endswith('}t') and node.text).strip()
                images = []
                for node in elem.iter():
                    if node.tag.endswith('}blip'):
                        for attr_name, attr_val in node.attrib.items():
                            if attr_name.endswith('embed') and attr_val in rid_map:
                                images.append(rid_map[attr_val])
                elements.append({
                    'type': 'p',
                    'text': text,
                    'images': images
                })
            elif elem.tag.endswith('}tbl'):
                # In extracted_curl_structure.json, tables were either not parsed or parsed differently, 
                # but to be comprehensive and handle text inside tables, we can extract text from table cells 
                # as paragraphs to keep structure simple or represent table rows. 
                # Let's see: how did curl.docx handle tables? Did it have tables? 
                # Let's check. If the template contains tables, we can process table cells as paragraphs 
                # or represent them. Since the user said 'refer extracted_curl_structure.json to create remaining tools structure json', 
                # let's extract each cell's text or rows. To preserve table content, we can convert each cell's paragraphs.
                # Actually, traversing the cells and processing paragraphs inside them is standard.
                for cell in elem.iter():
                    if cell.tag.endswith('}tc'):
                        # Process paragraphs inside table cells
                        for child in cell:
                            if child.tag.endswith('}p'):
                                text = "".join(node.text for node in child.iter() if node.tag.endswith('}t') and node.text).strip()
                                images = []
                                for node in child.iter():
                                    if node.tag.endswith('}blip'):
                                        for attr_name, attr_val in node.attrib.items():
                                            if attr_name.endswith('embed') and attr_val in rid_map:
                                                images.append(rid_map[attr_val])
                                if text or images:
                                    elements.append({
                                        'type': 'p',
                                        'text': text,
                                        'images': images
                                    })
            else:
                for child in elem:
                    if not (elem.tag.endswith('}p') or elem.tag.endswith('}tbl')):
                        process_element(child)

        process_element(root)

        with open(output_json, 'w', encoding='utf-8') as f:
            json.dump(elements, f, indent=2, ensure_ascii=False)

for f in files:
    parse_and_dump_docx(f)

print("All JSON structures extracted successfully!")
