import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import router from './routes/index.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use(router);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
