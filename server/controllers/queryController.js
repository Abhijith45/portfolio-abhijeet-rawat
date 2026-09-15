const queryService = require('../services/queryService');
const { validationResult } = require('express-validator');

class QueryController {
    async submit(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }

            const query = await queryService.submitQuery(req.body);
            res.status(201).json({
                success: true,
                message: 'Thank you for reaching out. I will get back to you soon!',
                data: query,
            });
        } catch (err) {
            next(err);
        }
    }

    async getAll(req, res, next) {
        try {
            const result = await queryService.getAll(req.query);
            res.json(result);
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            const query = await queryService.updateQuery(req.params.id, req.body);
            res.json({ success: true, data: query });
        } catch (err) {
            const status = err.message.toLowerCase().includes('not found') ? 404 : 400;
            res.status(status).json({ success: false, message: err.message });
        }
    }

    async delete(req, res, next) {
        try {
            const result = await queryService.deleteQuery(req.params.id);
            res.json(result);
        } catch (err) {
            const status = err.message.toLowerCase().includes('not found') ? 404 : 500;
            res.status(status).json({ success: false, message: err.message });
        }
    }
}

module.exports = new QueryController();
