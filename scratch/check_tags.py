import re
import sys

def check_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return

    # Extract template part
    match = re.search(r'template:\s*`([^`]*)`', content)
    if not match:
        print(f"No template found in {filepath}")
        return
        
    template = match.group(1)
    
    # Strip HTML comments
    template = re.sub(r'<!--.*?-->', '', template, flags=re.DOTALL)
    
    # Very basic tag parser (ignoring self-closing tags like input, img, br, hr)
    self_closing = ['input', 'img', 'br', 'hr', 'meta', 'link', 'col']
    
    # Find all opening and closing tags
    tags = re.finditer(r'</?([a-zA-Z0-9\-]+)[^>]*>', template)
    
    stack = []
    
    for match in tags:
        full_tag = match.group(0)
        tag_name = match.group(1).lower()
        
        if tag_name in self_closing:
            continue
            
        if full_tag.startswith('</'):
            if not stack:
                print(f"[{filepath}] Error: Unexpected closing tag </{tag_name}> around offset {match.start()}")
                return
            last_tag = stack.pop()
            if last_tag != tag_name:
                print(f"[{filepath}] Error: Tag mismatch. Expected </{last_tag}>, found </{tag_name}> around offset {match.start()}")
                return
        else:
            # Check if it ends with /> (self-closing syntax)
            if not full_tag.endswith('/>'):
                stack.append(tag_name)
                
    if stack:
        print(f"[{filepath}] Error: Unclosed tags remaining: {stack}")
    else:
        print(f"[{filepath}] SUCCESS: All tags perfectly balanced!")

check_file(r"c:\Users\GCMS\Documents\GitHub\lims\src\app\features\results\sops\sop-01\sop-01-entry.component.ts")
check_file(r"c:\Users\GCMS\Documents\GitHub\lims\src\app\features\results\sops\sop-default-type2\sop-default-type2-entry.component.ts")
