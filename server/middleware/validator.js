const Joi = require('joi');

const validateUser = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid('admin', 'lecturer', 'student'),
        department: Joi.string(),
        studentId: Joi.string()
    });
    return schema.validate(data);
};

const validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });
    return schema.validate(data);
};

const validateAttendance = (data) => {
    const schema = Joi.object({
        course: Joi.string().required(),
        student: Joi.string().required(),
        status: Joi.string().valid('present', 'absent', 'late').required(),
        remarks: Joi.string().allow(''),
        date: Joi.date()
    });
    return schema.validate(data);
};

module.exports = {
    validateUser,
    validateLogin,
    validateAttendance
};
