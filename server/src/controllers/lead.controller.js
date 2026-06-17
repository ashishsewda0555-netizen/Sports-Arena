import Lead from '../models/Lead.js';
import Sport from '../models/Sport.js';
import ApiError from '../utils/ApiError.js';
import { parsePagination, paginatedResponse } from '../utils/pagination.js';
import { sendLeadNotification } from '../utils/email.js';

/**
 * POST /api/v1/public/contact — Submit contact form (public, rate-limited)
 */
export async function submitContactForm(req, res, next) {
  try {
    const { name, phone, sportOfInterest, message } = req.body;

    // Capture IP for spam analysis
    const ipAddress =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress;

    const lead = await Lead.create({
      name,
      phone,
      sportOfInterest: sportOfInterest || null,
      message,
      ipAddress,
    });

    // Send email notification (non-blocking)
    let sportName = null;
    if (sportOfInterest) {
      const sport = await Sport.findById(sportOfInterest).select('name').lean();
      sportName = sport?.name;
    }
    sendLeadNotification(lead, sportName).catch((err) =>
      console.error('Email notification failed:', err)
    );

    res.status(201).json({
      data: { id: lead._id.toString(), status: lead.status },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/admin/leads — List all leads (paginated)
 */
export async function listAdminLeads(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('sportOfInterest', 'name slug')
        .lean(),
      Lead.countDocuments(filter),
    ]);

    res.json(paginatedResponse(leads, total, page, limit));
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/admin/leads/:id — Get single lead
 */
export async function getAdminLead(req, res, next) {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('sportOfInterest', 'name slug')
      .lean();

    if (!lead) {
      throw ApiError.notFound('Lead not found');
    }

    res.json({ data: lead });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/v1/admin/leads/:id — Update lead status
 */
export async function updateLeadStatus(req, res, next) {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: { status: req.body.status } },
      { new: true, runValidators: true }
    )
      .populate('sportOfInterest', 'name slug')
      .lean();

    if (!lead) {
      throw ApiError.notFound('Lead not found');
    }

    res.json({ data: lead });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/admin/leads/:id — Delete a lead
 */
export async function deleteLead(req, res, next) {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      throw ApiError.notFound('Lead not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
