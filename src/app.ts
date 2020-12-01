import SpoontacularParser from './SpoontacularParser';

const mock = SpoontacularParser.createMock().parser;
mock.replaceInstructions();
const parsed = mock.getParsedHtml();
console.log(parsed);
