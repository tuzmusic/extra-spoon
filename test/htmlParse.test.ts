import arrayContaining = jasmine.arrayContaining;
import { parseStep } from '../src/app';

const checkParsedArray = (step: string, expected: string[]) => {
  const result = parseStep(step)
  expect(result).toEqual(arrayContaining(expected));
  expect(result).toHaveLength(expected.length)
}

describe('HTML Parsing', () => {
  describe('Parsing a list item', () => {
    it('Parses two sentences into two steps', () => {
      const step = `<li>Do a first thing in this step. Do a second thing in this step.</li>`
      const expected = [
        '<li>Do a first thing in this step.</li>',
        '<li>Do a second thing in this step.</li>'
      ]
      checkParsedArray(step, expected)
    });
    
    it('Parses more than two sentences into two steps', () => {
      const step = `<li>Do a first thing in this step. Do a second thing in this step. And now do a third thing.</li>`
      const expected = [
        '<li>Do a first thing in this step.</li>',
        '<li>Do a second thing in this step.</li>',
        '<li>And now do a third thing.</li>',
      ]
      checkParsedArray(step, expected)
    });
    
    it('Ignores the final sentence in a step, even if it ends with an extra space; and trims trailing spaces', () => {
      const step = `<li>Do a first thing in this step.      This step that is followed by a space.    </li>`
      const expected = [
        '<li>Do a first thing in this step.</li>',
        '<li>This step that is followed by a space.</li>'
      ]
      checkParsedArray(step, expected)
    });
    
    it('Leaves a single-sentence step alone', () => {
      const step = `<li>Just one sentence here.</li>`
      const expected = [
        '<li>Just one sentence here.</li>'
      ]
      checkParsedArray(step, expected)
    });
    
    it('Can handle periods that aren\'t at the end of a sentence (like for abbrevs)', () => {
      const step = `<li>Add 1 tsp. flour and 2 tsp. salt. Add 3 tbsp. oil.</li>`
      const expected = [
        '<li>Add 1 tsp. flour and 2 tsp. salt.</li>',
        '<li>Add 3 tbsp. oil.</li>'
      ]
      checkParsedArray(step, expected)
    });
    
  });
});
