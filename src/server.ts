import express, { Request } from 'express';

import cors from 'cors';
import SpoontacularParser from './SpoontacularParser';

const app = express();
app.use(cors());

app.get('/', async (req: Request<{}, {}, {}, { url: string }>, res) => {
  const { url } = req.query;
  const parser = await SpoontacularParser.create(url);
  parser.replaceInstructions();
  res.send(parser.getHtml());
});

app.listen('8081');