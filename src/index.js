const mongoose = require('mongoose');
const express = require('express');
const app = express();
const { isBoom, boomify } = require('@hapi/boom');

app.use(express.json());
app.use('/api', require('./routes'));

app.use((err, _req, res, _next) => {
    if ( process.env.NODE_ENV !== 'production' )
        console.error(err);
    if (!isBoom(err)) {
        err = boomify(err);
    }
    res.locals.payload = err.output.payload;
    return res.status(err.output.statusCode).json(err.output.payload);
});

(async () => {
    await mongoose.connect('mongodb://localhost:27017/usersdb', { useUnifiedTopology: true, useNewUrlParser: true });
    app.listen(3000, () => {
        console.log('app ready port 3000');
    });
})();
