/*
Object To Display
- A library for filling out the DOM from object data.

Copyright (c) 2015 Trevor Manley

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
var objectToDisplay = objectToDisplay || {
    handlers : [
        {
            name : "DefaultTextHandler",
            desirablenessOf : function (element) {
                'use strict';
                if (element.dataset.displayType === undefined) {
                    return 1;
                }
                if (element.dataset.displayType.toLowerCase() === "text") {
                    return 10;
                }
                return 1;
            },
            handle : function (element, data) {
                'use strict';
                element.textContent = data;
            }
        },
        {
            name : "DefaultHTMLHandler",
            desirablenessOf : function (element) {
                'use strict';
                if (element.dataset.displayType === undefined) {
                    return 0;
                }
                if (element.dataset.displayType.toLowerCase() === "html") {
                    
                    return 10;
                }
                return 0;
            },
            handle : function (element, data) {
                'use strict';
                element.innerHTML = data;
            }
        },
        {
            name : "DefaultNestingHandler",
            desirablenessOf : function (element) {
                'use strict';
                if (element.dataset.displayType === undefined) {
                    return 0;
                }
                if (element.dataset.displayType.toLowerCase() === "nested_object") {
                    return 10;
                }
                return 0;
            },
            handle : function (element, data) {
                'use strict';
                objectToDisplay.fillElement(element, data);
            }
        }
    ],
    getBestHandler : function (element) {
        'use strict';
        var bestHandler, mostSpecific = 0;
        bestHandler = this.handlers[0];
        mostSpecific = 0;
        this.handlers.forEach(function (handler) {
            var currentSpecificity = handler.desirablenessOf(element);
            if (currentSpecificity >= mostSpecific) {
                bestHandler = handler;
                mostSpecific = currentSpecificity;
            }
        });
        return bestHandler;
    },
    fillElement : function (element, object, ignoreMissing, objectMappingFunction) {
        'use strict';
        var cn = 0, children, potentialFillFrom, propertyValue;
        if (objectMappingFunction === undefined) {
            objectMappingFunction = function (baseObject, requestedProperty) {
                return baseObject[requestedProperty];
            };
        }
        if (ignoreMissing === undefined) {
            ignoreMissing = true;
        }
        children = element.children;
        //children needs to be live updating, so isn't converted to an array
        for (cn = 0; cn < children.length; cn += 1) {
            potentialFillFrom = children[cn].dataset.display;
            if (potentialFillFrom !== undefined) {
                propertyValue = objectMappingFunction(object, potentialFillFrom);
                if (propertyValue === undefined) {
                    if (!ignoreMissing) {
                        throw new Error("Property \"" + potentialFillFrom + "\" was not found!");
                    }
                    //Otherwise do nothing.
                } else {
                    this.getBestHandler(children[cn]).handle(children[cn], propertyValue);
                }
            }
            this.fillElement(children[cn], object, ignoreMissing, objectMappingFunction);
        }
    }
};
