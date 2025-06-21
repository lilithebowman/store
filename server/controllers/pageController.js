const Page = require('../models/Page');
const User = require('../models/User');

// Get all pages
exports.getAllPages = async (req, res) => {
    try {
        const pages = await Page.findAll({
            include: [{
                model: User,
                as: 'author',
                attributes: ['id', 'username', 'email']
            }],
            order: [['updatedAt', 'DESC']]
        });
        res.status(200).json(pages);
    } catch (error) {
        console.error('Get pages error:', error);
        res.status(500).json({ message: 'Error fetching pages', error: error.message });
    }
};

// Get published pages (public endpoint)
exports.getPublishedPages = async (req, res) => {
    try {
        const pages = await Page.findAll({
            where: { status: 'published' },
            include: [{
                model: User,
                as: 'author',
                attributes: ['id', 'username']
            }],
            order: [['publishedAt', 'DESC']]
        });
        res.status(200).json(pages);
    } catch (error) {
        console.error('Get published pages error:', error);
        res.status(500).json({ message: 'Error fetching published pages', error: error.message });
    }
};

// Get page by ID
exports.getPageById = async (req, res) => {
    const { id } = req.params;

    try {
        const page = await Page.findByPk(id, {
            include: [{
                model: User,
                as: 'author',
                attributes: ['id', 'username', 'email']
            }]
        });

        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }

        res.status(200).json(page);
    } catch (error) {
        console.error('Get page error:', error);
        res.status(500).json({ message: 'Error fetching page', error: error.message });
    }
};

// Get page by slug (public endpoint)
exports.getPageBySlug = async (req, res) => {
    const { slug } = req.params;

    try {
        const page = await Page.findOne({
            where: { slug: slug, status: 'published' },
            include: [{
                model: User,
                as: 'author',
                attributes: ['id', 'username']
            }]
        });

        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }

        res.status(200).json(page);
    } catch (error) {
        console.error('Get page by slug error:', error);
        res.status(500).json({ message: 'Error fetching page', error: error.message });
    }
};

// Create new page
exports.createPage = async (req, res) => {
    const { title, slug, content, metaDescription, status = 'draft' } = req.body;

    try {
        const page = await Page.create({
            title,
            slug,
            content,
            metaDescription,
            status,
            authorId: req.user.id
        });

        // Fetch the page with author info
        const createdPage = await Page.findByPk(page.id, {
            include: [{
                model: User,
                as: 'author',
                attributes: ['id', 'username', 'email']
            }]
        });

        res.status(201).json({
            message: 'Page created successfully',
            page: createdPage
        });
    } catch (error) {
        console.error('Create page error:', error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                message: 'Validation error',
                errors: error.errors.map(e => e.message)
            });
        }
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                message: 'A page with this slug already exists'
            });
        }
        res.status(500).json({ message: 'Error creating page', error: error.message });
    }
};

// Update page
exports.updatePage = async (req, res) => {
    const { id } = req.params;
    const { title, slug, content, metaDescription, status } = req.body;

    try {
        const page = await Page.findByPk(id);
        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }

        await page.update({
            title: title || page.title,
            slug: slug || page.slug,
            content: content !== undefined ? content : page.content,
            metaDescription: metaDescription !== undefined ? metaDescription : page.metaDescription,
            status: status || page.status
        });

        // Fetch updated page with author info
        const updatedPage = await Page.findByPk(id, {
            include: [{
                model: User,
                as: 'author',
                attributes: ['id', 'username', 'email']
            }]
        });

        res.status(200).json({
            message: 'Page updated successfully',
            page: updatedPage
        });
    } catch (error) {
        console.error('Update page error:', error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                message: 'Validation error',
                errors: error.errors.map(e => e.message)
            });
        }
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                message: 'A page with this slug already exists'
            });
        }
        res.status(500).json({ message: 'Error updating page', error: error.message });
    }
};

// Delete page
exports.deletePage = async (req, res) => {
    const { id } = req.params;

    try {
        const page = await Page.findByPk(id);
        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }

        await page.destroy();
        res.status(200).json({ message: 'Page deleted successfully' });
    } catch (error) {
        console.error('Delete page error:', error);
        res.status(500).json({ message: 'Error deleting page', error: error.message });
    }
};
