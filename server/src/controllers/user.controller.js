import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';

/**
 * GET /api/v1/admin/users — List all staff accounts (Admin Only)
 */
export async function listUsers(req, res, next) {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
    const skip = (page - 1) * limit;

    const total = await User.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const users = await User.find()
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      data: users,
      page,
      limit,
      total,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/admin/users — Create a new staff account (Admin Only)
 */
export async function createUser(req, res, next) {
  try {
    const { name, email, password, role, isActive } = req.body;

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw ApiError.conflict('Email is already registered');
    }

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({
      name,
      email: normalizedEmail,
      passwordHash,
      role,
      isActive,
    });

    res.status(201).json({
      data: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/v1/admin/users/:id — Update a staff account details or status (Admin Only)
 */
export async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const { name, email, role, isActive } = req.body;

    const user = await User.findById(id);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    // Safety checks: Prevent a user from deactivating themselves or changing their own role
    if (req.user._id === id) {
      if (role && role !== req.user.role) {
        throw ApiError.badRequest('You cannot change your own role');
      }
      if (isActive !== undefined && !isActive) {
        throw ApiError.badRequest('You cannot deactivate your own account');
      }
    }

    if (name) user.name = name;
    if (email) {
      const normalizedEmail = email.toLowerCase();
      if (normalizedEmail !== user.email) {
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
          throw ApiError.conflict('Email is already in use');
        }
        user.email = normalizedEmail;
      }
    }
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    res.json({
      data: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
}
