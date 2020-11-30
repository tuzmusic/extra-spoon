import express, { Request } from 'express';

import cors from 'cors';
import SpoontacularParser from './SpoontacularParser';

const app = express();
app.use(cors());

app.get('/', async (req: Request<{}, {}, {}, { url: string }>, res) => {
  const { url } = req.query;
  console.warn('Parsing recipe at URL', url);
  const parser = await SpoontacularParser.create(url);
  parser.replaceInstructions();
  res.send(parser.getHtml());
});

console.log('\n****** extra-spoon server is running! ******\n');
console.log('In a browser, visit localhost:8081/?url=URL_OF_YOUR_RECIPE');
console.log('For example: http://localhost:8081/?url=http://www.melskitchencafe.com/the-best-fudgy-brownies/');
console.log('You\'ll get a version of the page with the instructions split by sentence.');
// TODO: simple html changes don't actually get to AnyList. We'll have to change the json!
//  console.log('You can feed this page to AnyList or whatever recipe app you\'d like.');
console.log('\nHappy cooking! :)\n');

app.listen(process.env.PORT || 8081);