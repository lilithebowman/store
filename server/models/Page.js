const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Page = sequelize.define(
	"Page",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					args: true,
					msg: "Title cannot be empty",
				},
				len: {
					args: [1, 200],
					msg: "Title must be between 1 and 200 characters",
				},
			},
		},
		slug: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				notEmpty: {
					args: true,
					msg: "Slug cannot be empty",
				},
				isSlug(value) {
					if (!/^[a-z0-9-]+$/.test(value)) {
						throw new Error(
							"Slug must contain only lowercase letters, numbers, and hyphens",
						);
					}
				},
			},
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		components: {
			type: DataTypes.JSON,
			allowNull: true,
			defaultValue: null,
		},
		metaDescription: {
			type: DataTypes.STRING(300),
			allowNull: true,
			validate: {
				len: {
					args: [0, 300],
					msg: "Meta description cannot exceed 300 characters",
				},
			},
		},
		status: {
			type: DataTypes.ENUM("draft", "published", "archived"),
			defaultValue: "draft",
			allowNull: false,
		},
		authorId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: "Users",
				key: "id",
			},
		},
		publishedAt: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		timestamps: true,
		hooks: {
			beforeSave: (page) => {
				// Generate slug from title if not provided
				if (!page.slug && page.title) {
					page.slug = page.title
						.toLowerCase()
						.replace(/[^a-z0-9\s-]/g, "") // Remove special characters
						.replace(/\s+/g, "-") // Replace spaces with hyphens
						.replace(/-+/g, "-") // Replace multiple hyphens with single
						.trim();
				}

				// Set publishedAt when status changes to published
				if (page.status === "published" && !page.publishedAt) {
					page.publishedAt = new Date();
				}
			},
		},
	},
);

// Define associations
Page.associate = (models) => {
	Page.belongsTo(models.User, {
		foreignKey: "authorId",
		as: "author",
	});
};

module.exports = Page;
