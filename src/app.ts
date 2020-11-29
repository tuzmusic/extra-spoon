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
      s = s.replace(/.\s* <\/li>/g, '.</li>').trim()
      
      // pad beginnings/endings with missing tags
      if (!s.startsWith('<li>')) s = '<li>' + s
      if (!s.endsWith('</li>')) s += '</li>'
      return s
    })
}