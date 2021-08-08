const router = require('express').Router();
const userController = require('../controllers/UserController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/register', async (req, res, next) => {
    try {
        const data = await userController.register(req.body);
        res.send(data);
    } catch (e) {
        next(e);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const data = await userController.login(req.body);
        res.send(data);
    } catch (e) {
        next(e);
    }
});

router.post('/refresh', async (req, res, next)=>{
    try {
        const data = await userController.refresh(req.headers['x-refresh-token']);
        res.send(data);
    } catch (e) {
        next(e);
    }
});

router.get('/onlyAuth', authMiddleware, async (_req, res, next)=>{
    try {
        res.send('welcome');
    } catch (e) {
        next(e);
    }
});

router.post('/clearAllSessions', authMiddleware, async (req, res, next)=>{
    try {
        const data = await userController.clearAllSessions(req.headers['x-access-token']);
        res.send(data);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
