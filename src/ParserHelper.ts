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
  static replaceSteps(html: string, recipe: RecipeJson): {
    stepsContainer: cheerio.Cheerio; // useful for testing or whatever
    newHtml: string;
  } {
    // Spoonacular actually does some splitting of the steps itself.
    // In our initial test recipe (brownies) the split isn't perfect enough,
    // so we'll do our own splits.
    const textSteps = this.splitIntoSentences(recipe.instructions);
  
    // Find the HTML element that contains the steps.
    // We'll replace its contents with our split steps.
    const jsonSteps = recipe.analyzedInstructions[0].steps;
    const firstStepText = jsonSteps[0].step;
    const words = firstStepText.split(' ');
    // TODO: we're using the first word, and contains.
    //  This could return an incorrect element (and it only returns one element, BTW).
    //  We should check a few words into the step once we find an element.
    //  Note that there might be some issues with special characters, which
    //  is why we don't search for the full text of the step in the first place.
    const parsedHtml = cheerio.load(html);
    const firstStep = parsedHtml(`li:contains("${ words[0] }")`);
    const stepsContainer = firstStep.parent();
  
    stepsContainer.empty();
    textSteps.forEach(step => stepsContainer.append(`<li>${ step }</li>`));
  
    return { stepsContainer, newHtml: parsedHtml.html() };
  }
}