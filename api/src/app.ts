import express from 'express';
import { generate } from 'randomstring';
import NodeCache from 'node-cache';
import validator from 'validator';
import cors from 'cors';

import { Url } from './models/url';

const app: express.Application = express();
const cache = new NodeCache();
const PORT = 4000;
const NUMBER_OF_RANDOM_CHARACTERS = 8;

app.use(express.json());
app.use(cors());

// TODO: Check for longer url (koenlippe.nl/dev f.e.)
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
    if (!validator.isURL(req.body.url)) {
      throw new Error('Url validation failed');
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
    res.send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
