# objtodisplay
Object To Display Javascript Library

Usage
-----
#### In HTML
```
  <p data-display="information"></p>
  <span data-display="html" data-display-type="html"></span>
```
#### In JavaScript
```
var obj = { information : "Information", html : "<a href='#'>Link</a>"};
objectToDisplay.fillElement(document.getElementById('element'), obj);
```

###Signature
`objectToDisplay.fillElement(element, object, [ignoreMissing = true] , [propertyMappingFunction]);`


The ignoreMissing flag determines if fillElement should not throw an error when it is unable to find a requested property.

The propertyMappingFunction is used to map from the data-display value to the property in the object it has a signature of `object propertyMappingFunction(object baseObject, string requestedPropertyName)`. It returns the value of the requested property.

Handlers
--------
Object to Display uses a handler system to determine how to properly display an object.
There are three default handlers
* text - Default or when data-display-type="text"
* html - Used when data-display-type="html"
* nested_object - Used when data-display-type="nested_object"

### Adding Custom Handlers
Custom handlers can be added by `push`ing to the handlers array. e.g. `objectToDisplay.handlers.push(myhandler);`
Handlers are objects that contain the following methods:
* `desirablenessOf`
  Desirableness of determine how important this handler should be in handling an element.
  `Number desirablenessOf(Element element)`
  The defaults return 10 if the `data-display-type` is set otherwise the text handler returns 1.
* `handle`
  Handle, the function that modifies the DOM. Handle is passed the current element being processed and the value for the property set by `data-display`.
  `void handle(Element element, object data)`

Cross Browser Concerns
----------------------
Object to Display uses the following newer features:
* Dataset [caniuse](http://caniuse.com/#search=dataset)
* forEach [caniuse](http://caniuse.com/#search=forEach)


Known Issues
------------
* Properties of nested objects are overridden by the display of the base object.
