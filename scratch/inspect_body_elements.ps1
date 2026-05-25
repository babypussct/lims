$xmlPath = "c:\Users\GCMS\Documents\GitHub\lims\FILEBIEUMAUGOC\filebieumau4_extracted\word\document.xml"
$xmlContent = Get-Content -Path $xmlPath -Raw -Encoding UTF8

# Find w:body content
$bodyMatch = [regex]::Match($xmlContent, '<w:body>([\s\S]*?)</w:body>')
if (-not $bodyMatch.Success) {
    Write-Host "No w:body found!"
    exit 1
}
$bodyContent = $bodyMatch.Groups[1].Value

# Let's parse all top level elements (w:p, w:tbl, w:sectPr) using stack-based or regex approach
# A top level element starts with <w:p, <w:tbl, or <w:sectPr
# We can find all elements by looking for matches
$matches = [regex]::Matches($bodyContent, '<(w:p|w:tbl|w:sectPr)(\b[^>]*)?(/>|>)')
Write-Host "Found $($matches.Count) potential element boundaries"

# Let's write a robust parser in PowerShell that loops through and matches nesting depth
$elements = @()
$i = 0
$len = $bodyContent.Length

while ($i -lt $len) {
    $nextTag = $bodyContent.IndexOf('<', $i)
    if ($nextTag -eq -1) { break }
    $i = $nextTag
    
    $sub = $bodyContent.Substring($i)
    
    # Self-closing top level tags
    $scMatch = [regex]::Match($sub, '^<(w:p|w:tbl|w:sectPr)(\b[^>]*)?\s*/>')
    if ($scMatch.Success) {
        $elements += [PSCustomObject]@{
            Index = $elements.Count
            Tag = $scMatch.Groups[1].Value
            Xml = $scMatch.Value
        }
        $i += $scMatch.Value.Length
        continue
    }
    
    # Opening top level tags
    $opMatch = [regex]::Match($sub, '^<(w:p|w:tbl|w:sectPr)(\b[^>]*)?>')
    if ($opMatch.Success) {
        $tagName = $opMatch.Groups[1].Value
        $startIdx = $i
        $i += $opMatch.Value.Length
        
        $depth = 1
        while ($i -lt $len -and $depth -gt 0) {
            $lt = $bodyContent.IndexOf('<', $i)
            if ($lt -eq -1) { break }
            $i = $lt
            
            $rest = $bodyContent.Substring($i)
            
            # Nested self closing tag of same type
            $scNested = [regex]::Match($rest, "^<$tagName(\b[^>]*)?\s*/>")
            if ($scNested.Success) {
                $i += $scNested.Value.Length
                continue
            }
            
            # Closing tag of same type
            $closeNested = [regex]::Match($rest, "^</$tagName>")
            if ($closeNested.Success) {
                $depth--
                $i += $closeNested.Value.Length
                continue
            }
            
            # Opening nested tag of same type
            $openNested = [regex]::Match($rest, "^<$tagName(\b[^>]*)?>")
            if ($openNested.Success) {
                $depth++
                $i += $openNested.Value.Length
                continue
            }
            
            $i++
        }
        
        $elements += [PSCustomObject]@{
            Index = $elements.Count
            Tag = $tagName
            Xml = $bodyContent.Substring($startIdx, $i - $startIdx)
        }
    } else {
        $gt = $bodyContent.IndexOf('>', $i)
        if ($gt -eq -1) { $i = $len } else { $i = $gt + 1 }
    }
}

Write-Host "Total parsed top-level child elements in w:body: $($elements.Count)"

# Print elements summary
for ($idx = 0; $idx -lt $elements.Count; $idx++) {
    $el = $elements[$idx]
    # Extract text from w:t
    $tMatches = [regex]::Matches($el.Xml, '<w:t[^>]*>([^<]*)</w:t>')
    $txt = ($tMatches | ForEach-Object { $_.Groups[1].Value }) -join ""
    $txtTrim = $txt.Trim()
    
    if ($txtTrim.Length -gt 80) {
        $txtTrim = $txtTrim.Substring(0, 80) + "..."
    }
    
    Write-Host "Element ${idx} [Tag: $($el.Tag)]: $txtTrim"
}
