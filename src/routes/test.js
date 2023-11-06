import { Router } from 'express';
const router = Router();

// Controlador para la solicitud GET a /v1/test
router.get('/v1/test', (req, res) => {
    const data = {
        "contacto1": {
            "name": "Test",
            "pass": "word"
        },
        "contacto2": {
            "name": "Test",
            "pass": "word"
        }
    };
    res.json({ data });
});

// Controlador para la solicitud POST a /v1/test
router.post('/v1/test', (req, res) => {
    console.log(req.body);
    res.send('👌👍');
});

export default  router;
