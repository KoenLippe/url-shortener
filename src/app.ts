import express from 'express';
import NodeCache from 'node-cache';
import cors from 'cors';
import path from 'path';

import { Url } from './models/url';
import validator from 'validator';
import { generate } from 'randomstring';

const app: express.Application = express();
const cache = new NodeCache();
const PORT = 5002;
const NUMBER_OF_RANDOM_CHARACTERS = 8;

app.use(express.json());
app.use(cors());
app.use(express.static('./public'));

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.get('/:id', (req, res) => {
  const { id } = req.params;
  const urlObject: Url | undefined = cache.get(id);

  if (!urlObject) {
    res.status(404).send(`Short link with ${id} does not exist`);
  } else {
    res.redirect(301, urlObject.url);
  }
});

app.post('/api/url', (req, res) => {
  try {
    if (!validator.isURL(req.body.url, { require_protocol: true })) {
      throw new Error('Please enter a valid url f.e. -> https://koenlippe.nl');
    }

    if (validator.isURL(req.body.short)) {
      throw new Error('The short cannot be a URL');
    }

    const urlObject: Url = {
      url: req.body.url,
      short: req.body.short,
    };

    if (!req.body.short) {
      urlObject.short = generate(NUMBER_OF_RANDOM_CHARACTERS).toLowerCase();
    }

    if (cache.has(urlObject.short)) {
      throw new Error(`Short url (${urlObject.short}) already exists`);
    }

    cache.set(urlObject.short, urlObject);

    res.status(200).json(urlObject);
  } catch (error) {
    res.status(500);
    res.json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
