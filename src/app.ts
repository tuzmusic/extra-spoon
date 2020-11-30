import SpoontacularParser from './SpoontacularParser';

const mock = SpoontacularParser.createMock().parser;
mock.replaceInstructions();
const parsed = mock.getParsedHtml();
console.log(parsed);

const ldj = parsed('script[type="application/ld+json"]');
const first = ldj.get(0);
const second = ldj.get(1);
console.log(first, second);
