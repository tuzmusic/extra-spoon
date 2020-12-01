import SpoontacularParser from '../src/SpoontacularParser';

describe('JSON parsing', () => {
  let parser: SpoontacularParser;
  
  describe('ParserHelper.replaceJsonSteps', () => {
    parser = SpoontacularParser.createMock().parser;
    parser.replaceInstructions();
    
    // note: we've copied this code from the replaceJsonInstructions function, so that we're just searching
    // the script tag, meaning that if the test fails it will only print the script tag instead of the entire
    // html.
    
    // get any script tags
    const scriptTags = parser.getParsedHtml()('script[type="application/ld+json"]');
    // find the right one
    const scriptTag = scriptTags.filter((i, tag) => {
      const json = JSON.parse(tag.firstChild.data);
      return json['@type'] === 'Recipe';
    });
    
    const html = scriptTag.html();
    
    it('Replaces the steps', () => {
      // sanity check for line breaks
      expect(html).toContain('"recipeInstructions":[{"@type"');
      expect(html).not.toContain(
        '"text":"Combine the butter, sugar, cocoa, and salt in a medium microwave-safe bowl. Microwave'
      );
      expect(html).toContain(
        '"text":"Combine the butter, sugar, cocoa, and salt in a medium microwave-safe bowl."'
      );
      expect(html).toContain(
        '"text":"Microwave for one minute intervals, stirring in between, until the butter is melted and the mixture is smooth."'
      );
    });
  });
});

/*
*
*
*
* */