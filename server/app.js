const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morganMiddleware = require('./middleware/morganLogger');
const errorHandler = require('./middleware/errorHandler');

const reviewRoutes = require('./routes/reviews');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const technologyRoutes = require('./routes/technologies');
const queryRoutes = require('./routes/queries');
const resumeRoutes = require('./routes/resume');
const experienceRoutes = require('./routes/experiences');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

const app = express();

// HTTP Request Logger
if (process.env.NODE_ENV !== 'test') {
    app.use(morganMiddleware);
}

// Security middleware
app.use(helmet());

// Cookie parser
app.use(cookieParser());

// CORS configuration
app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['x-cache-version', 'x-server-cache', 'set-cookie'],
    })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/technologies', technologyRoutes);
app.use('/api/queries', queryRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
    });
});

// Centralized Global Error Handler Middleware
app.use(errorHandler);

module.exports = app;
