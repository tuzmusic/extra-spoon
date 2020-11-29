import arrayContaining = jasmine.arrayContaining;
import { parseStep } from '../src/app';
import SpoontacularParser from '../src/SpoontacularParser';
import ParserHelper from '../src/ParserHelper';

const checkParsedArray = (step: string, expected: string[]) => {
  const result = parseStep(step);
  expect(result).toEqual(arrayContaining(expected));
  expect(result).toHaveLength(expected.length);
};

describe('HTML Parsing', () => {
  const { parser, html, originalJson } = SpoontacularParser.createMock();
  
  describe('Finding the list items in the page', () => {
    let result: cheerio.Cheerio;
    beforeAll(() => result = ParserHelper.replaceSteps(html, originalJson));
  
    it('Returns the original steps as an array of the correct length', () => {
      expect(result).toHaveLength(4);
    });
  
    /*
        it('Contains the correct steps, basically', () => {
          expect(result[0].startsWith('Position a rack'))
          expect(result[1].startsWith('Combine the butter'))
          expect(result[2].startsWith('Stir in the vanilla'))
          expect(result[3].startsWith('Bake until a toothpick'))
          
          expect(result[0].endsWith('cooking spray and set aside.'))
          expect(result[1].endsWith('the other ingredients are added.'))
          expect(result[2].endsWith('Spread evenly in the lined pan.'))
          expect(result[3].endsWith('Cut into squares and serve.'))
        });
    */
  });
  
  describe('Parsing a list item', () => {
    it('Parses two sentences into two steps', () => {
      const step = `<li>Do a first thing in this step. Do a second thing in this step.</li>`;
      const expected = [
        '<li>Do a first thing in this step.</li>',
        '<li>Do a second thing in this step.</li>'
      ];
      checkParsedArray(step, expected);
    });
    
    it('Parses more than two sentences into two steps', () => {
      const step = `<li>Do a first thing in this step. Do a second thing in this step. And now do a third thing.</li>`;
      const expected = [
        '<li>Do a first thing in this step.</li>',
        '<li>Do a second thing in this step.</li>',
        '<li>And now do a third thing.</li>',
      ];
      checkParsedArray(step, expected);
    });
    
    it('Ignores the final sentence in a step, even if it ends with an extra space; and trims trailing spaces', () => {
      const step = `<li>Do a first thing in this step.      This step that is followed by a space.    </li>`;
      const expected = [
        '<li>Do a first thing in this step.</li>',
        '<li>This step that is followed by a space.</li>'
      ];
      checkParsedArray(step, expected);
    });
    
    it('Leaves a single-sentence step alone', () => {
      const step = `<li>Just one sentence here.</li>`;
      const expected = [
        '<li>Just one sentence here.</li>'
      ];
      checkParsedArray(step, expected);
    });
    
    it('Can handle periods that aren\'t at the end of a sentence (like for abbrevs)', () => {
      const step = `<li>Add 1 tsp. flour and 2 tsp. salt. Add 3 tbsp. oil.</li>`;
      const expected = [
        '<li>Add 1 tsp. flour and 2 tsp. salt.</li>',
        '<li>Add 3 tbsp. oil.</li>'
      ];
      checkParsedArray(step, expected);
    });
    
  });
  
});
