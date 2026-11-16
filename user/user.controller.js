const userService = require("./user.service");
const { sendError } = require("../config/http");

const userController = {
    create: async (req, res) => {
        try {
            const user = await userService.create(req.body);
            res.status(201).json(user);
        } catch (error) {
            sendError(res, error);
        }
    },
    update: async (req, res) => {
        try {
            res.json(await userService.update(req.params.id, req.body));
        } catch (error) {
            sendError(res, error);
        }
    },
    setActive: async (req, res) => {
        try {
            res.json(await userService.setActive(req.params.id, req.body.active));
        } catch (error) {
            sendError(res, error);
        }
    },
    findById: async (req, res) => {
        try {
            const user = await userService.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            sendError(res, error);
        }
    },
    findByEmail: async (req, res) => {
        try {
            const user = await userService.findByEmail(req.params.email);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            sendError(res, error);
        }
    },
    findAll: async (req, res) => {
        try {
            const users = await userService.findAll();
            res.json(users);
        } catch (error) {
            sendError(res, error);
        }
    }
};

module.exports = userController;
