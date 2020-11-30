# `extra-spoon`
*Various added features for the Spoonacular recipes API*

---

## Instructions

1. Run the server
    ```
    $ node ./dist/server.js
    ```
   
   TODO: add instructions for supplying and API key in a `secrets.ts` file. (i.e., running the server locally won't actually work because I've gitignored the api key. Try the deployed version at `https://extra-spoon.herokuapp.com/?url=YOUR_URL` to see it in action.)
2. In a browser, visit localhost:8081/?url=URL_OF_YOUR_RECIPE;
   
   For example: http://localhost:8081/?url=http://www.melskitchencafe.com/the-best-fudgy-brownies/
3. The server a version of the page with the instructions split by sentence.

This splits the steps when they appear in the HTML, and has been tested on...exactly one page.

On that page, at least, the recipe is represented as a JSON object within a script tag in the HTML, and it appears that *that* is where AnyList parses from! This begs much further investigation!  


## About

Spoonacular's `GET /recipes/extract` endpoint is a great resource for parsing an online recipe. I've been working on a recipe reader app myself, but until that's done I love AnyList, whose Chrome extension makes it super easy to import a recipe from a website in just two clicks. I suspect that they use the Spoonacular API under the hood.

One thing I'd like to add to the API is a way to make recipe instructions more granular. In a written recipe, a single numbered step might include many many actions, and when you have an app that focuses on the current step, this feature's utility is greatly reduced if you then have to focus yourself on a step within the step!

So that is the main task.

Once that task, and any others, are complete, there needs to be a way to get back where we started, so that our new recipe is fed back to our destination:

recipe website --> spoontacular --> anylist

## Tasks
- [X] Split recipe steps by sentences 
- [X] Output a resource that can be fed back into the Spoonacular API to be reparsed. This probably means posting an HTML page.
- [ ] Create a modified Chrome extension that feeds a website through our middleware and then submits the result to the AnyList extension. 
- [ ] Consider further splits
    - All commas
    - "and"
    - ", then"

### How might this be accomplished?
We could do all the work in HTML. We could pull down the page, and then do our find-replace directly. 
1. Find the recipe steps (`div#steps`)
2. Assuming that the steps are in a list (probably `<ol>`) we could iterate through each `li`, like so:
3. Replace `. ` with `.</li> <li>` (except when already followed by `</li>`). This would create a list item for each sentence. 
    - We might consider other sentence-ending punctuation, but it seems unlikely. And if a ! or ? was there, it's probably more commentary than the end of an actual step.
4. Post the resulting HTML somewhere.

Or we could do all the work with the parsed data.
1. Take the `instructions` array returned by the Spoonacular API
2. Use the splitting strategies above to insert new steps into the array
3. Reconstruct the new object into an HTML page that would be read by Spoonacular, and post the page somewhere.

Initially, the first approach seems wisest, because we have to end up with HTML anyway (though I'd be surprised if there's not a better final step that doesn't require reconstructing the HTML; but would it get us to the final AnyList input?).

But there may be other things we want to do. For instance, my in-progress app (or, rather, its even more in-progress backend) also takes the timers from the Spoonacular output (which AnyList ignores). However! If we're just feeding it back to HTML, we're not actually adding any information that Spoonacular doesn't already get (in the case of timers) -- that is, we're not changing the actual HTML.

Maybe we'll go with the HTML route first anyway. Just for fun, I guess.     