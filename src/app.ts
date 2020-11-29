import cheerio from 'cheerio';
import axios, { AxiosRequestConfig } from 'axios';
import { apiKey } from '../secrets';

/**
 * Converts a single step into an ARRAY of steps, split by sentences.
 * @param str: The string of the step, including the outer `<li>` tags.
 */
export const parseStep = (str: string): string[] => {
  // split by sentence-ending punctuation, that are followed by capital letters after a space.
  // this should ignore mid-sentence abbreviations (which are not followed by capital letters).
  return str.replace(/([.?!])\s*(?=[A-Z])/g, '$1|').split('|')
    .map(s => {
      // remove trailing spaces inside and outside the closing tags
      s = s.replace(/.\s* <\/li>/g, '.</li>').trim();
      
      // pad beginnings/endings with missing tags
      if (!s.startsWith('<li>')) s = '<li>' + s;
      if (!s.endsWith('</li>')) s += '</li>';
      return s;
    });
};

export const handleHtml = (html: string): string => {
  const $ = cheerio.load(html);
  
  return html;
};

/**
 * Get the recipe steps as cheerio elements
 * @param html
 */
export async function getOriginalSteps(html: string): Promise<string[]> {
  const steps: string[] = [];
  
  // parse with original spoonacular API
  const options: AxiosRequestConfig = {
    method: 'GET',
    url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/extract',
    params: { url: 'http://www.melskitchencafe.com/the-best-fudgy-brownies/' },
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
    }
  };
  
  const { data } = await axios.request(options);
  // find each of the steps
  const $ = cheerio.load(data);
  
  return steps;
}

const getHtml = async (url: string): Promise<string> => {
  const { data } = await axios(url);
  return data;
};

const url = 'https://www.melskitchencafe.com/the-best-fudgy-brownies/';
getHtml(url).then(html => handleHtml(html));