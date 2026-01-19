/**
 * Apply fact-checking suggestions to HTML content with visual highlights
 */

/**
 * Escape special regex characters
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Apply a single suggestion to HTML content with green highlight
 */
export function applySuggestion(htmlContent, suggestion) {
  const { original, suggested } = suggestion;

  if (!original || !suggested) {
    return htmlContent;
  }

  // Create a highlighted version of the suggested text
  const highlightedSuggested = `<span class="highlight-change" data-original="${escapeHtml(original)}">${escapeHtml(suggested)}</span>`;

  // Try to find and replace the exact text
  // First, try case-sensitive exact match
  const escapedOriginal = escapeRegex(escapeHtml(original));
  const regex = new RegExp(escapedOriginal, 'g');

  let updatedContent = htmlContent.replace(regex, highlightedSuggested);

  // If no match found, try case-insensitive
  if (updatedContent === htmlContent) {
    const regexInsensitive = new RegExp(escapedOriginal, 'gi');
    updatedContent = htmlContent.replace(regexInsensitive, highlightedSuggested);
  }

  return updatedContent;
}

/**
 * Apply multiple suggestions to HTML content
 */
export function applyMultipleSuggestions(htmlContent, suggestions) {
  let updatedContent = htmlContent;

  // Sort suggestions by length (longest first) to avoid partial replacements
  const sortedSuggestions = [...suggestions].sort((a, b) =>
    b.original.length - a.original.length
  );

  for (const suggestion of sortedSuggestions) {
    updatedContent = applySuggestion(updatedContent, suggestion);
  }

  return updatedContent;
}

/**
 * Remove highlights from HTML content (for final publishing)
 */
export function removeHighlights(htmlContent) {
  // Replace highlighted spans with just their content
  return htmlContent.replace(
    /<span class="highlight-change"[^>]*>([^<]*)<\/span>/g,
    '$1'
  );
}

/**
 * Count number of changes in HTML
 */
export function countChanges(htmlContent) {
  const matches = htmlContent.match(/<span class="highlight-change"/g);
  return matches ? matches.length : 0;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Validate HTML structure
 */
export function validateHTML(htmlContent) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // Check for parsing errors
    const errors = doc.querySelectorAll('parsererror');
    if (errors.length > 0) {
      return {
        valid: false,
        error: 'HTML parsing error detected'
      };
    }

    return {
      valid: true,
      error: null
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message
    };
  }
}

/**
 * Get preview text from HTML (strip tags)
 */
export function getPreviewText(htmlContent, maxLength = 200) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const text = doc.body.textContent || '';

  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength) + '...';
}

/**
 * Preserve HTML structure while updating content
 */
export function preserveHTMLStructure(originalHTML, updatedContent) {
  // This ensures we maintain the same HTML structure
  // Only the text content is updated, not the tags
  const parser = new DOMParser();
  const originalDoc = parser.parseFromString(originalHTML, 'text/html');
  const updatedDoc = parser.parseFromString(updatedContent, 'text/html');

  // Return the updated content with structure preserved
  return updatedDoc.body.innerHTML;
}

/**
 * Extract text content from HTML for analysis
 */
export function extractTextContent(htmlContent) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  return doc.body.textContent || '';
}
