const Role = require("../models/Role");

// Get all roles
exports.getAllRoles = async (req, res) => {
	try {
		const roles = await Role.findAll({
			order: [["name", "ASC"]],
		});
		res.status(200).json(roles);
	} catch (error) {
		console.error("Get roles error:", error);
		res.status(500).json({
			message: "Error fetching roles",
			error: error.message,
		});
	}
};

// Get role by ID
exports.getRoleById = async (req, res) => {
	const { id } = req.params;

	try {
		const role = await Role.findByPk(id);
		if (!role) {
			return res.status(404).json({ message: "Role not found" });
		}
		res.status(200).json(role);
	} catch (error) {
		console.error("Get role error:", error);
		res.status(500).json({
			message: "Error fetching role",
			error: error.message,
		});
	}
};

// Create new role
exports.createRole = async (req, res) => {
	const { name, description, permissions } = req.body;

	try {
		const role = await Role.create({
			name,
			description,
			permissions: permissions || {},
		});

		res.status(201).json({
			message: "Role created successfully",
			role,
		});
	} catch (error) {
		console.error("Create role error:", error);
		res.status(500).json({
			message: "Error creating role",
			error: error.message,
		});
	}
};

// Update role
exports.updateRole = async (req, res) => {
	const { id } = req.params;
	const { name, description, permissions } = req.body;

	try {
		const role = await Role.findByPk(id);
		if (!role) {
			return res.status(404).json({ message: "Role not found" });
		}

		await role.update({
			name: name || role.name,
			description: description || role.description,
			permissions: permissions || role.permissions,
		});

		res.status(200).json({
			message: "Role updated successfully",
			role,
		});
	} catch (error) {
		console.error("Update role error:", error);
		res.status(500).json({
			message: "Error updating role",
			error: error.message,
		});
	}
};

// Delete role
exports.deleteRole = async (req, res) => {
	const { id } = req.params;

	try {
		const role = await Role.findByPk(id);
		if (!role) {
			return res.status(404).json({ message: "Role not found" });
		}

		await role.destroy();
		res.status(200).json({ message: "Role deleted successfully" });
	} catch (error) {
		console.error("Delete role error:", error);
		res.status(500).json({
			message: "Error deleting role",
			error: error.message,
		});
	}
};
