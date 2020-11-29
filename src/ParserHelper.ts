import { RecipeJson } from './recipe.types';
import cheerio from 'cheerio';

export default class ParserHelper {
  static splitIntoSentences(str: string): string[] {
    return str.replace(/([.?!])\s*(?=[A-Z])/g, '$1|').split('|');
  }
  
  /**
   * Converts a single step into an ARRAY of steps, split by sentences.
   * @param str: The string of the step, including the outer `<li>` tags.
   */
  static parseStringStep(str: string): string[] {
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
  }
  
  /**
   * Replace the html steps with newly split steps.
   * @param html
   * @param recipe
   * @return The list's parent element, containing the new steps.
   */
  static replaceSteps(html: string, recipe: RecipeJson): cheerio.Cheerio {
    // Spoonacular actually does some splitting of the steps itself.
    // In our initial test recipe (brownies) the split isn't perfect enough.
    // So we'll do our own splits.
    const textSteps = this.splitIntoSentences(recipe.instructions);
    
    // Find the HTML element that contains the steps.
    // We'll replace its contents with our split steps.
    const jsonSteps = recipe.analyzedInstructions[0].steps;
    const firstStepText = jsonSteps[0].step;
    const words = firstStepText.split(' ');
    // TODO: we're using the first word, and contains.
    //  In case multiple li's contain that word, we should
    //  add a word until there's only one result.
    const firstStep = cheerio.load(html)(`li:contains("${ words[0] }")`);
    const stepsContainer = firstStep.parent();
    
    stepsContainer.empty();
    textSteps.forEach(step => stepsContainer.append(`<li>${ step }</li>`));
    
    return stepsContainer;
  }
}