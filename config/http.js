const httpError = (status, message) => Object.assign(new Error(message), { status });

const sendError = (res, error) => {
    let status = error.status || 400;
    let message = error.message;
    if (error.name === 'SequelizeUniqueConstraintError') {
        status = 409;
        message = error.errors?.[0]?.message || message;
    }
    res.status(status).json({ error: message });
};

module.exports = { httpError, sendError };
