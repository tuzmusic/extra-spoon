# `extra-spoon`
*Various added features for the Spoonacular recipes API*

---

## Instructions
<!-- In the markdown, numbering each as 1 allows us to not worry about actual ordering. The numbers will display correctly. -->
1. Create an account at RapidAPI.com (you can log in with Github) and get a RapidAPI key.
1. Create a `.env` file at the root of the project and add your api key:
    ```
    # .env
    RAPID_API_KEY=your-rapid-api-key
    ``` 
1. Run the server
    ```
    $ node ./dist/server.js
    ```

1. In a browser, visit http://localhost:8081/?url=YOUR_RECIPE_URL

   > For example: http://localhost:8081/?url=http://www.melskitchencafe.com/the-best-fudgy-brownies/

1. The server returns a version of the page with the instructions split by sentence.

For example, this:

1. Crack eggs. Mix eggs.
2. Cook eggs.

Becomes this:

1. Crack eggs.
2. Mix eggs.
3. Cook eggs.

To use this newly split-up recipe in your favorite recipe app, visit https://extra-spoon.herokuapp.com/ and provide the
url parameter as above. Note that it doesn't appear that you can do this when running the local server, because AnyList
visits the full url you send to it, and it of course can't access your local host.

## Verified sites

Site | Works | Doesn't Work
--- | --- | --- |
https://www.melskitchencafe.com/the-best-fudgy-brownies/ | X |
https://cooking.nytimes.com/recipes/1020596-vegetarian-mushroom-wellington | X
https://www.gimmesomeoven.com/best-chicken-enchiladas-ever/#tasty-recipes-59596 | X

## About

Spoonacular's `GET /recipes/extract` endpoint is a great resource for parsing an online recipe. I've been working on a
recipe reader app myself, but until that's done I love AnyList, whose Chrome extension makes it super easy to import a
recipe from a website in just two clicks. I suspect that they use the Spoonacular API under the hood.

One thing I'd like to add to the API is a way to make recipe instructions more granular. In a written recipe, a single
numbered step might include many many actions, and when you have an app that focuses on the current step, this feature's
utility is greatly reduced if you then have to focus yourself on a step within the step!

We accomplish this by getting the instructions, splitting them up myself, and replacing them in the two places they
appear on the page:

1. In the text list shown to the user (`<li>` tags)
2. In the script tag that gives all the info about the recipe. we simply replace the value of the `recipeInstructions`
   key with our own object, containing the steps.

I suspect that the second part of that is the only one that's actually important for forwarding the changes on to our
parsing app (e.g., AnyList).

We then simply return the html, which is rendered in the browser, and can then be fed to the AnyList chrome extension,
or what have you.

## Tasks

- [X] ~~Split recipe steps by sentences~~
- [X] ~~Output a resource that can be fed back into the Spoonacular API to be reparsed. This probably means posting an
  HTML page.~~
- [ ] Take Spoonacular out of the equation all together (at least for simply splitting steps). Since we get the
  instructions from the page source, we don't need to get it from Spoonacular.
- [ ] Post the new HTML pages online somewhere when they're created, so that new url can be sent to AnyList instead of
  our local url, so that the full app can run locally.
- [ ] Create a modified Chrome extension that feeds a website through our middleware and then submits the result to the
  AnyList extension.
- [ ] Consider further splits
    - All commas
    - "and"
    - ", then"
- [ ] UI for interacting with the recipe for custom splitting and anything else
