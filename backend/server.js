
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './models/routers/userRouter.js';
import productRouter from './models/routers/productRouter.js';
import orderRouter from '../backend/models/routers/orderRouter.js';
import dotenv from 'dotenv';
import path from 'path';
import uploadRouter from './models/routers/uploadRouter.js';
const __dirname = path.resolve();
//encripting the id, name, email into the token with json.
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/amazon-clone', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})

app.use('/api/uploads', uploadRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.get('/api/config/paypal', (req, res) => {
res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});
const _dirname = path.resolve(); //returns the current folder and concatenated with uploads
app.use('/uploads', express.static(path.join(_dirname, '/uploads')))
app.use(express.static(path.join(__dirname, '/frontend/build')))
app.get('*', (req, res) => 
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
)

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});