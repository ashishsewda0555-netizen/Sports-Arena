/**
 * Parse pagination parameters from query string.
 * Enforces defaults (page=1, limit=20) and max limit of 100.
 */
export function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

/**
 * Build standardized paginated response envelope.
 */
export function paginatedResponse(data, total, page, limit) {
  return {
    data,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
