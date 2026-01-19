/**
 * Parse natural language responses from Claude AI into structured suggestions
 */

/**
 * Determine severity from section headers and keywords
 */
function determineSeverity(text) {
  const upperText = text.toUpperCase();

  if (upperText.includes('MUST FIX') || upperText.includes('CRITICAL') || upperText.includes('HIGH PRIORITY')) {
    return 'high';
  }
  if (upperText.includes('SHOULD FIX') || upperText.includes('MEDIUM PRIORITY') || upperText.includes('IMPORTANT')) {
    return 'medium';
  }
  if (upperText.includes('CONSIDER') || upperText.includes('LOW PRIORITY') || upperText.includes('MINOR')) {
    return 'low';
  }

  return 'medium'; // default
}

/**
 * Extract suggestion type from context
 */
function extractType(text) {
  const lowerText = text.toLowerCase();

  if (lowerText.includes('factual') || lowerText.includes('incorrect') || lowerText.includes('wrong')) {
    return 'factual';
  }
  if (lowerText.includes('grammar') || lowerText.includes('spelling') || lowerText.includes('typo')) {
    return 'grammar';
  }
  if (lowerText.includes('clarity') || lowerText.includes('confusing') || lowerText.includes('unclear')) {
    return 'clarity';
  }
  if (lowerText.includes('style') || lowerText.includes('tone')) {
    return 'style';
  }

  return 'other';
}

/**
 * Parse a single suggestion line
 * Formats supported:
 * - "Wrong price - Change "$29" to "$59" because pricing table shows $59"
 * - "Change "$29" to "$59" - Wrong price (pricing table shows $59)"
 * - "$29" should be "$59" (pricing table shows $59)"
 */
function parseSuggestionLine(line, sectionSeverity) {
  const suggestion = {
    original: '',
    suggested: '',
    reason: '',
    severity: sectionSeverity,
    type: 'other'
  };

  // Pattern 1: Change "X" to "Y" because/- reason
  const pattern1 = /change\s+["']([^"']+)["']\s+to\s+["']([^"']+)["']\s*(?:because|[-–—])\s*(.+)/i;
  const match1 = line.match(pattern1);
  if (match1) {
    suggestion.original = match1[1].trim();
    suggestion.suggested = match1[2].trim();
    suggestion.reason = match1[3].trim();
    suggestion.type = extractType(line);
    return suggestion;
  }

  // Pattern 2: "X" to "Y" - reason
  const pattern2 = /["']([^"']+)["']\s+to\s+["']([^"']+)["']\s*[-–—]\s*(.+)/i;
  const match2 = line.match(pattern2);
  if (match2) {
    suggestion.original = match2[1].trim();
    suggestion.suggested = match2[2].trim();
    suggestion.reason = match2[3].trim();
    suggestion.type = extractType(line);
    return suggestion;
  }

  // Pattern 3: "X" should be "Y" (reason)
  const pattern3 = /["']([^"']+)["']\s+should\s+be\s+["']([^"']+)["']\s*(?:\((.+)\))?/i;
  const match3 = line.match(pattern3);
  if (match3) {
    suggestion.original = match3[1].trim();
    suggestion.suggested = match3[2].trim();
    suggestion.reason = match3[3]?.trim() || '';
    suggestion.type = extractType(line);
    return suggestion;
  }

  // Pattern 4: Description - "X" -> "Y"
  const pattern4 = /(.+?)\s*[-–—]\s*["']([^"']+)["']\s*(?:->|→|to)\s*["']([^"']+)["']/i;
  const match4 = line.match(pattern4);
  if (match4) {
    suggestion.reason = match4[1].trim();
    suggestion.original = match4[2].trim();
    suggestion.suggested = match4[3].trim();
    suggestion.type = extractType(line);
    return suggestion;
  }

  // Pattern 5: Just extract quoted text if present
  const quotedTexts = line.match(/["']([^"']+)["']/g);
  if (quotedTexts && quotedTexts.length >= 2) {
    suggestion.original = quotedTexts[0].replace(/["']/g, '').trim();
    suggestion.suggested = quotedTexts[1].replace(/["']/g, '').trim();
    suggestion.reason = line.replace(/["'][^"']+["']/g, '').trim();
    suggestion.type = extractType(line);
    return suggestion;
  }

  return null;
}

/**
 * Parse Claude's natural language response into structured suggestions
 */
export function parseClaudeResponse(responseText) {
  if (!responseText || typeof responseText !== 'string') {
    return [];
  }

  const suggestions = [];
  const lines = responseText.split('\n');
  let currentSeverity = 'medium';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) continue;

    // Check for section headers
    const headerSeverity = determineSeverity(line);
    if (line.match(/^(MUST FIX|SHOULD FIX|CONSIDER|HIGH PRIORITY|MEDIUM PRIORITY|LOW PRIORITY)/i)) {
      currentSeverity = headerSeverity;
      continue;
    }

    // Skip lines that are just numbers or bullets
    if (line.match(/^[\d\.\-\*\)]+$/)) continue;

    // Remove leading numbers, bullets, etc.
    const cleanedLine = line.replace(/^[\d\.\-\*\)]+\s*/, '');

    if (cleanedLine.length < 5) continue; // Skip very short lines

    const suggestion = parseSuggestionLine(cleanedLine, currentSeverity);

    if (suggestion && suggestion.original && suggestion.suggested) {
      suggestions.push({
        id: `suggestion-${Date.now()}-${i}`,
        ...suggestion
      });
    }
  }

  return suggestions;
}

/**
 * Validate parsed suggestions
 */
export function validateSuggestions(suggestions) {
  return suggestions.filter(s =>
    s.original &&
    s.suggested &&
    s.original !== s.suggested &&
    s.original.length > 0 &&
    s.suggested.length > 0
  );
}

/**
 * Format suggestions for display
 */
export function formatSuggestionForDisplay(suggestion) {
  const severityColors = {
    high: 'text-red-600',
    medium: 'text-orange-600',
    low: 'text-blue-600'
  };

  const severityLabels = {
    high: 'High Priority',
    medium: 'Medium Priority',
    low: 'Low Priority'
  };

  return {
    ...suggestion,
    severityColor: severityColors[suggestion.severity] || severityColors.medium,
    severityLabel: severityLabels[suggestion.severity] || severityLabels.medium
  };
}
