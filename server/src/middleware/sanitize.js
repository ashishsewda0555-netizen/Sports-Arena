/**
 * Input sanitization middleware.
 * Recursively strips dangerous HTML/script content from request body,
 * query parameters, and URL parameters to prevent XSS attacks.
 *
 * Note: Rich-text HTML fields (like longDescription, bioFull, answer)
 * are intentionally preserved because they use a controlled rich-text
 * editor on the admin dashboard. The sanitization targets common
 * XSS vectors (script tags, event handlers, javascript: URIs) while
 * allowing safe HTML structure.
 */

// Patterns that indicate XSS attack vectors
const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,   // <script>...</script>
  /javascript\s*:/gi,                                        // javascript: URIs
  /on\w+\s*=\s*["'][^"']*["']/gi,                           // Event handlers like onclick="..."
  /on\w+\s*=\s*[^\s>]+/gi,                                  // Event handlers without quotes
  /expression\s*\(/gi,                                       // CSS expression()
  /url\s*\(\s*['"]?\s*javascript:/gi,                        // CSS url(javascript:...)
  /vbscript\s*:/gi,                                          // vbscript: URIs
  /data\s*:\s*text\/html/gi,                                 // data:text/html URIs
];

/**
 * Sanitize a single string value by removing dangerous patterns.
 * @param {string} value
 * @returns {string}
 */
function sanitizeString(value) {
  if (typeof value !== 'string') return value;

  let sanitized = value;
  for (const pattern of DANGEROUS_PATTERNS) {
    sanitized = sanitized.replace(pattern, '');
  }

  return sanitized.trim();
}

/**
 * Recursively sanitize all string values in an object or array.
 * @param {*} data
 * @returns {*}
 */
function sanitizeDeep(data) {
  if (typeof data === 'string') {
    return sanitizeString(data);
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeDeep);
  }

  if (data !== null && typeof data === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeDeep(value);
    }
    return sanitized;
  }

  return data;
}

/**
 * Express middleware that sanitizes req.body, req.query, and req.params.
 */
export function sanitizeInput(req, _res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeDeep(req.body);
  }

  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeDeep(req.query);
  }

  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeDeep(req.params);
  }

  next();
}
