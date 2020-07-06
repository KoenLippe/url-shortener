import express from 'express';
import path from 'path';
import validator from 'validator';
import { generate } from 'randomstring';
import dotenv from 'dotenv';
import monk from 'monk';

import { Url } from './models/url';
import CustomError from './models/CustomError';

const app: express.Application = express();
const PORT = process.env.PORT || 5002;
const NUMBER_OF_RANDOM_CHARACTERS = 8;
dotenv.config();

const db = monk(process.env.MONGO_DB_URL || 'ERROR');
const urls = db.get('url');

app.use(express.json());
app.use(express.static('./public'));

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.get('/:id', async (req, res) => {
  const { id } = req.params;
  const urlObject: Url | undefined = await urls.findOne({ short: id });

  if (!urlObject) {
    res.status(404).send(`Short link with ${id} does not exist`);
  } else {
    res.redirect(301, urlObject.url);
  }
});

app.post('/api/url', async (req, res) => {
  try {
    if (!validator.isURL(req.body.url, { require_protocol: true })) {
      throw new CustomError(
        'Please enter a valid url f.e. -> https://koenlippe.nl',
        422
      );
    }

    if (validator.isURL(req.body.short)) {
      throw new CustomError('The short cannot be a URL', 422);
    }

    const urlObject: Url = {
      url: req.body.url,
      short: req.body.short,
    };

    if (!req.body.short) {
      urlObject.short = generate(NUMBER_OF_RANDOM_CHARACTERS).toLowerCase();
    }

    if (await urls.findOne({ short: urlObject.short })) {
      throw new CustomError(
        `Short url (${urlObject.short}) already exists`,
        409
      );
    }

    const created: Url = await urls.insert(urlObject);

    res.status(200).json(created);
  } catch (error) {
    res.status(error.statusCode);
    res.json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
