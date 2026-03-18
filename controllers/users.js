const Users = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserPermission = require("../models/user_permission");
const Permission = require("../models/permission");
const { Op } = require("sequelize");

const ADMIN_ROLES = new Set(["owner", "unit_head", "process_head"]);

function ensureAdmin(req, res) {
  if (!req.user || !ADMIN_ROLES.has(req.user.role)) {
    res.status(403).json({ success: false, message: "Access denied" });
    return false;
  }
  return true;
}

function normalizeRoleAndRoleId(payload = {}) {
  const roleToId = {
    owner: 1,
    unit_head: 2,
    sales_coordinator: 3,
    team_lead: 4,
    agent: 5,
    process_head: 6,
  };
  const idToRole = Object.fromEntries(
    Object.entries(roleToId).map(([k, v]) => [String(v), k]),
  );

  const out = { ...payload };
  if (out.role && !out.role_id && roleToId[out.role])
    out.role_id = roleToId[out.role];
  if (out.role_id && !out.role && idToRole[String(out.role_id)])
    out.role = idToRole[String(out.role_id)];

  return out;
}

exports.getAll = async (req, res) => {
  const users = await Users.findAll({ attributes: { exclude: ["password"] } });
  res.json(users);
};

exports.getById = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;

    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const user = await Users.findByPk(id, {
      attributes: { exclude: ["password"] },
      raw: true,
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const usermanager = await Users.findByPk(user.manager_id, {
      attributes: ["id", "name"],
      raw: true,
    });

    if (usermanager) {
      user.manager = usermanager;
    }

    return res.status(200).json({
      success: true,
      message: "User fetched",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email)
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  if (!password)
    return res
      .status(400)
      .json({ success: false, message: "Password is required" });

  try {
    // Check user exists
    const user = await Users.findOne({
      where: { email },
      // include: [
      // 	{
      // 		model: UserPermission,
      // 		attributes: ["id", "permission_id"],
      // 		include: [
      // 			{
      // 				model: Permission,
      // 				attributes: [
      // 					"id",
      // 					"name",
      // 					"display_name",
      // 					"allowed_permissions",
      // 					"added_type",
      // 				],
      // 			},
      // 		],
      // 	},
      // ],
      attributes: [
        "id",
        "password",
        "email",
        "mobile",
        "name",
        "gender",
        "status",
        "role",
        "role_id",
        "manager_id",
      ],
    });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    // Block login if user is deactivated/disabled
    if (user.status === "deactive" || user.login === "disable") {
      return res.status(403).json({
        success: false,
        message: "User is deactivated",
      });
    }

    // Match password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const data = JSON.parse(JSON.stringify(user));
    delete data.password;

    // best-effort last login update (don't block login if it fails)
    Users.update({ last_login: new Date() }, { where: { id: user.id } }).catch(
      () => {},
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getAllAgentsListing = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let offset = (page - 1) * limit;

    const user_id = req.user.id;

    const findMyProfile = await Users.findByPk(user_id);

    if (!findMyProfile) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const params = {};

    if (findMyProfile.role == "team_lead") {
      params.manager_id = user_id;
    } else if (findMyProfile.role == "agent") {
      params.id = user_id;
    }

    const { count, rows } = await Users.findAndCountAll({
      where: params,
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Agents fetched",
      data: rows,
      meta: {
        totalItems: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let offset = (page - 1) * limit;

    const { search, role, status, manager_id } = req.query;

    const where = {};
    if (role) where.role = role;
    if (status) where.status = status;
    if (manager_id) where.manager_id = manager_id;

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { mobile: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Users.findAndCountAll({
      where,
      limit,
      offset,
      order: [["created_at", "DESC"]],
      attributes: { exclude: ["password"] },
      raw: true,
    });

    const managerData = await Users.findAll({
      where: { id: { [Op.in]: rows.map((row) => row.manager_id) } },
      attributes: ["id", "name"],
      raw: true,
    });

    rows.forEach((row) => {
      row.manager = managerData.find(
        (manager) => manager.id === row.manager_id,
      );
    });

    return res.status(200).json({
      success: true,
      message: "Users fetched",
      data: rows,
      meta: {
        totalItems: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.getTeamLeaders = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let offset = (page - 1) * limit;

    const { search, status, manager_id } = req.query;

    const where = { role: "team_lead" };
    if (status) where.status = status;
    if (manager_id) where.manager_id = manager_id;

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { mobile: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Users.findAndCountAll({
      where,
      limit,
      offset,
      order: [["created_at", "DESC"]],
      attributes: { exclude: ["password"] },
    });

    return res.status(200).json({
      success: true,
      message: "Team leaders fetched",
      data: rows,
      meta: {
        totalItems: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;

    const payload = normalizeRoleAndRoleId(req.body);

    if (payload.email) {
      const existing = await Users.findOne({ where: { email: payload.email } });
      if (existing) {
        return res
          .status(409)
          .json({ success: false, message: "Email already exists" });
      }
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const newUser = await Users.create({
      ...payload,
      password: hashedPassword,
      status: payload.status || "active",
      login: payload.login || "enable",
      created_at: new Date(),
      updated_at: new Date(),
    });

    const data = JSON.parse(JSON.stringify(newUser));
    delete data.password;

    return res.status(201).json({
      success: true,
      message: "User created",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;

    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });

    const user = await Users.findByPk(id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const payload = normalizeRoleAndRoleId(req.body);

    if (payload.email && payload.email !== user.email) {
      const existing = await Users.findOne({ where: { email: payload.email } });
      if (existing) {
        return res
          .status(409)
          .json({ success: false, message: "Email already exists" });
      }
    }

    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }

    await Users.update(
      { ...payload, updated_at: new Date() },
      { where: { id } },
    );

    const updated = await Users.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    return res.status(200).json({
      success: true,
      message: "User updated",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.activateUser = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;

    const { id } = req.params;
    const user = await Users.findByPk(id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    await Users.update(
      { status: "active", login: "enable", updated_at: new Date() },
      { where: { id } },
    );

    const updated = await Users.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    return res.status(200).json({
      success: true,
      message: "User activated",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.deactivateUser = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;

    const { id } = req.params;
    const user = await Users.findByPk(id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    await Users.update(
      { status: "deactive", login: "disable", updated_at: new Date() },
      { where: { id } },
    );

    const updated = await Users.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    return res.status(200).json({
      success: true,
      message: "User deactivated",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;

    const { id } = req.params;
    const { status } = req.body;

    const user = await Users.findByPk(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const login = status === "active" ? "enable" : "disable";

    await Users.update(
      { status, login, updated_at: new Date() },
      { where: { id } },
    );

    const updated = await Users.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    return res.status(200).json({
      success: true,
      message: "User status updated",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
