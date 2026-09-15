const queryRepository = require('../repositories/queryRepository');
const emailUtil = require('../utils/email');
const xss = require('xss');

class QueryService {
    async submitQuery(body) {
        const { name, email, message, subject } = body;
        const resolvedSubject = subject?.trim() || 'Enquiry Mail';
        const query = await queryRepository.create({
            name: xss(name.trim()),
            email: xss(email.trim()),
            message: xss(message.trim()),
            subject: xss(resolvedSubject),
        });

        // Dispatch notification email (fire-and-forget — intentionally not awaited)
        emailUtil.sendInquiryNotification({
            name: query.name,
            email: query.email,
            subject: query.subject,
            message: query.message,
        }).catch((e) => {
            console.error('[Email] Inquiry notification failed:', e.message);
        });

        return query;
    }

    async getAll(queryParams = {}) {
        const page = parseInt(queryParams.page, 10) || 1;
        const limit = parseInt(queryParams.limit, 10) || 20;
        const skip = (page - 1) * limit;

        const [queries, total] = await Promise.all([
            queryRepository.find({}, { sort: { createdAt: -1 }, skip, limit }),
            queryRepository.count(),
        ]);

        return {
            success: true,
            data: queries,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    async updateQuery(id, body) {
        const { read, replied } = body;
        const updateData = {};
        if (read !== undefined) updateData.read = Boolean(read);
        if (replied !== undefined) updateData.replied = Boolean(replied);

        const query = await queryRepository.updateById(id, updateData);
        if (!query) {
            throw new Error('Query not found');
        }
        return query;
    }

    async deleteQuery(id) {
        const query = await queryRepository.deleteById(id);
        if (!query) {
            throw new Error('Query not found');
        }
        return { success: true, message: 'Message deleted successfully' };
    }
}

module.exports = new QueryService();
