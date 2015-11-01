# objtodisplay
Object To Display Javascript Library

A simple and lightweight library for filling in elements.

Pure Javascript; no dependancies.

Basic Example
-----
### Sample HTML Snippet
```
<article id="article">
  <h1 data-display="title"></h1>
  <p data-display="text" data-display-type="html"></p>
  <footer>
    <span data-display="tags" data-display-type="tagList"></span>
    <div data-display="authorBio"></div>
  </footer>
</article>
```
### JS Object
```
var article = {
  title : "Methods to Display Data from JSON Responses [Number #10 Will Blow Your Mind]",
  text : "There are many ways to display data on a web page using Javascript. Some options are <ul><li>Object To Display</li><li>Handlebars</li><li>Angular</li><li>React</li><li>Ember</li></ul> ..."
  tagList : [{href : "tags/js", text : "Javascript"},{href : "tags/libs", text : "Libraries"}],
  authorBio : "Person on the internet: Spends lots of time on the internet watching funny cat videos, browsing Reddit, looking a web design blogs, and writing web applications that no-one uses."
};
```

### Calling Object to Display
Note that the tag list won't be filled out in this example
```
var articleToFill = document.getElementById("article");
objectToDisplay.fillElement(articleToFill, article);
```
### Adding Custom Handlers
To add custom handlers (such as the one needed to fill the tagList above), create an array and add objects that contain both the `desirablenessOf` and `handle` functions as defined below. Then use the the third argument to fillElement with `{handlers: yourHandlerArray}`

`Number` desirablenessOf(`Element` element):
  Determines the importance of the element for this handle. The default handlers return 1 for text if no display type is set or 10 when the display type is set to `text`, `html`, or `nested_object`.

`void` handle(`Element` element, `Object` data):
  Called when this handle is picked as the most desirable.
  
Creating a custom handler for the tagList
```
var customHandlers = [];
var tagListHandler = {
  desirablenessOf : function (element) {
    if(element.dataset.displayType === "tagList"){
      return 10;
    }
  },
  handle : function (element, data) {
    //Note: checking to make sure data is an Array, Map, or Set might be a good idea here
    data.forEach(function (tag) {
      var link = document.createElement("A");
      link.href = tag.href;
      link.textContent = tag.text;
      element.appendChild(link);
    });
  }
};
```
Running the example with the custom handler
```
var articleToFill = document.getElementById("article");
objectToDisplay.fillElement(articleToFill, article, { handlers : customHandlers });
```
### Not Using the Default Handlers
If the default `text`, `html`, and `nested_object` handlers are not desired they can be turned off by setting the `useDefaultHandlers` property of `fillElement`'s third argument to `false`. However, there must be at least one handler or `fillElement` will throw a `No handlers are defined.` error.

Example:
```
var articleToFill = document.getElementById("article");
objectToDisplay.fillElement(articleToFill, article, { handlers : customHandlers, useDefaultHandlers : false });
```

### Getting Exceptions for Missing Properties
By default Object to Display will ignore requests for properties that aren't in the object passed to it. This behavior can be changed by setting the `ignoreMissing` property of `fillElement`'s third argument to `false`. Setting this to `false` has known issues with `nested_object` or other handlers that deal with sub-objects.

Example:
With adjusted HTML
```
<article id="article">
  <h1 data-display="title"></h1>
  <p data-display="text" data-display-type="html"></p>
  <footer>
    <span data-display="lastUpdate"></span>
    <span data-display="tags" data-display-type="tagList"></span>
    <div data-display="authorBio"></div>
  </footer>
</article>
```
Object to Display call
```
var articleToFill = document.getElementById("article");
objectToDisplay.fillElement(articleToFill, article, { ignoreMissing : false });
```
In this case `fillElement` will throw a `Property "lastUpdate" was not found!` exception. 

### Dealing With Differences Between the data-display Value and Source Object Properties
In some cases the `data-display` value may not match the name of the property in the source object. This can be addressed by using the `objectMappingFunction` property of `fillElement`'s third argument. The `objectMappingFunction` is a function with a definition of:

`Object` objectMappingFunction(`Object` baseObject, `String` requestedProperty):
Returns the value from property of `baseObject` that contains the data requested by `requestedProperty`

Example:
With adjusted HTML
```
<article id="article">
  <h1 data-display="title"></h1>
  <p data-display="text" data-display-type="html"></p>
  <footer>
    <span data-display="tags" data-display-type="tagList"></span>
    <div data-display="author-bio"></div>
  </footer>
</article>
```
Defining the custom Object Mapping Function
```
var objectMap = function(baseObject, requestedProperty){
  if(requestedProperty === "author-bio"){
    return baseObject.authorBio;
  } else {
    //It is recommended to fallback to the defaults
    return baseObject[requestedProperty];
  }
}
```
Object to Display call
```
var articleToFill = document.getElementById("article");
objectToDisplay.fillElement(articleToFill, article, { objectMappingFunction : objectMap });
```
### Advanced Example, a page with many articles
HTML Snippet
```
<div id="sections">
  <section data-display="tech-articles">
  </section>
  <section data-display="food-articles">
  </section>
</div>
```
Object Definition
```
var sections = {
  techArticles : [{
    title : ...,
    text : ...,
    author : ...,
    authorBio : ...,
    tags : [{href: ..., text:...},{...}]
  },
  { ... },
  ...
  ],
  foodArticles : [ ... ]
}
```
Object to Display call
```
var sectionMapper = function (obj, req) {
  //Could be done much easier by converting from - to camel
  if(req === "tech-articles") {
    return obj.techArticles;
  } else if (req === "food-articles") {
    return obj.foodArticles;
  }
};
var articleMapper = function (obj, req) {
  if(req === "author-bio") {
    return obj.authorBio;
  } else {
    //It is recommended to fallback to the defaults
    return obj[req];
  }
};
var articleHandlers = [{
  desirablenessOf : function (el) {
    if(el.dataset.displayType === "tagList"){
      return 10;
    }
  },
  handle : function (el, d) {
    //Note: checking to make sure data is an Array, Map, or Set might be a good idea here
    d.forEach(function (tag) {
      var link = document.createElement("A");
      link.href = tag.href;
      link.textContent = tag.text;
      el.appendChild(link);
    });
  }
}];
var sectionHandler = [{
  desirablenessOf : function (el) {
    if(el.tagName === "SECTION"){
      return 5;
    }
  },
  handle : function (el, d) {
    d.forEach(function (artData) {
      var art = ConvertToElement('<article><h1 data-display="title"></h1><p data-display="text" data-display-type="html"></p><footer><span data-display="tags" data-display-type="tagList"></span><div data-display="author-bio"></div></footer></article>');
      objectToDisplay.fillElement(art, artData, {objectMappingFunction : articleMapper, handlers : articleHandlers});
      el.appendChild(art);
    });
  }
}];
objectToDisplay.fillElement(document.getElementById("sections"), sections, {useDefaultHandlers : false, handlers : sectionHandler, objectMappingFunction : sectionMapper});
```

Cross Browser Concerns
----------------------
Object to Display uses the following newer features:
* Dataset [caniuse](http://caniuse.com/#search=dataset)
* forEach [caniuse](http://caniuse.com/#search=forEach)


Known Issues
------------
* Properties of nested objects are overridden by the display of the base object.
* Nested objects will cause fillElement to throw a missing property exception. This only occurs if ignoreMissing is set to false.
