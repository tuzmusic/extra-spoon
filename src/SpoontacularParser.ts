import axios, { AxiosRequestConfig } from 'axios';
import fs from 'fs';
import brownies from '../test/fixtures/brownies';
import { RecipeJson } from './recipe.types';
import * as cheerio from 'cheerio';
import ParserHelper from './ParserHelper';

export default class SpoontacularParser {
  private originalJson: RecipeJson;
  private parsedHtml: cheerio.Root;
  
  private _html: string;
  
  private get html() { return this._html;}
  
  private set html(h: string) {
    this._html = h;
    this.parsedHtml = cheerio.load(h);
  }
  
  /**
   * For testing.
   * Creates a parser object populated with mock data.
   * For convenience, returns the html and json directly.
   */
  static createMock(): {
    parser: SpoontacularParser;
    html: string;
    originalJson: RecipeJson;
    parsedHtml: cheerio.Root;
  } {
    const parser = new SpoontacularParser();
    parser.html = fs.readFileSync('./test/fixtures/brownies.html', 'utf8');
    parser.originalJson = brownies;
    const { html, originalJson, parsedHtml } = parser;
    return { parser, html, originalJson, parsedHtml };
  }
  
  /**
   * Gets the html and the original Spoonacular result
   * @param url
   * @return a parser object populated with said information
   */
  static async create(url: string): Promise<SpoontacularParser> {
    const parser = new SpoontacularParser();
    
    // get html
    const { data: html } = await axios(url);
    parser.html = html;
    
    // get spoonacular parsing
    const options: AxiosRequestConfig = {
      method: 'GET',
      url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/extract',
      params: { url },
      headers: {
        'x-rapidapi-key': process.env.RAPID_API_KEY,
        'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
      }
    };
  
    const { data } = await axios.request(options);
    parser.originalJson = data;
  
    return parser;
  }
  
  public replaceInstructions() {
    this.html = ParserHelper.replaceHtmlSteps(this.html, this.originalJson).newHtml;
    this.html = ParserHelper.replaceJsonSteps(this.html, this.originalJson).newHtml;
  }
  
  public getHtml() { return this.html; }
  
  public getOriginalJson() { return this.originalJson; }
  
  public getParsedHtml() { return this.parsedHtml; }
  
}