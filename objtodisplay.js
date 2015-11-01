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
    getBestHandler : function (element, handlers) {
        'use strict';
        var bestHandler, mostSpecific = 0;
        bestHandler = handlers[0];
        mostSpecific = 0;
        handlers.forEach(function (handler) {
            var currentSpecificity = handler.desirablenessOf(element);
            if (currentSpecificity >= mostSpecific) {
                bestHandler = handler;
                mostSpecific = currentSpecificity;
            }
        });
        return bestHandler;
    },
    fillElement : function (element, object, extraOptions) {
        'use strict';
        var cn = 0, children, potentialFillFrom, propertyValue, defaultMappingFunction, defaultTextHandler, defaultHTMLHandler, defaultNestingHandler;
        defaultMappingFunction = function (baseObject, requestedProperty) {
            return baseObject[requestedProperty];
        };
        defaultTextHandler = {
            desirablenessOf : function (element) {
                if (element.dataset.displayType === undefined) {
                    return 1;
                }
                if (element.dataset.displayType.toLowerCase() === "text") {
                    return 10;
                }
                return 1;
            },
            handle : function (element, data) {
                element.textContent = data;
            }
        };
        defaultHTMLHandler = {
            desirablenessOf : function (element) {
                if (element.dataset.displayType === undefined) {
                    return 0;
                }
                if (element.dataset.displayType.toLowerCase() === "html") {
                    
                    return 10;
                }
                return 0;
            },
            handle : function (element, data) {
                element.innerHTML = data;
            }
        };
        defaultNestingHandler = {
            desirablenessOf : function (element) {
                if (element.dataset.displayType === undefined) {
                    return 0;
                }
                if (element.dataset.displayType.toLowerCase() === "nested_object") {
                    return 10;
                }
                return 0;
            },
            handle : function (element, data) {
                objectToDisplay.fillElement(element, data);
            }
        };
        if (extraOptions === undefined) {
            extraOptions = {
                objectMappingFunction : defaultMappingFunction,
                ignoreMissing : true,
                handlers : [],
                useDefaultHandlers : true
            };
        }
        if (extraOptions.objectMappingFunction === undefined) {
            extraOptions.objectMappingFunction = defaultMappingFunction;
        }
        if (extraOptions.ignoreMissing === undefined) {
            extraOptions.ignoreMissing = true;
        }
        if (extraOptions.useDefaultHandlers === undefined) {
            extraOptions.useDefaultHandlers = true;
        }
        if (extraOptions.handlers === undefined) {
            extraOptions.handlers = [];
        }
        if (extraOptions.useDefaultHandlers === true) {
            extraOptions.handlers.push(defaultTextHandler);
            extraOptions.handlers.push(defaultHTMLHandler);
            extraOptions.handlers.push(defaultNestingHandler);
        }
        if (extraOptions.handlers.length === 0) {
            throw new Error("No handlers are defined.");
        }
        children = element.children;
        //children needs to be live updating, so isn't converted to an array
        for (cn = 0; cn < children.length; cn += 1) {
            potentialFillFrom = children[cn].dataset.display;
            if (potentialFillFrom !== undefined) {
                propertyValue = extraOptions.objectMappingFunction(object, potentialFillFrom);
                if (propertyValue === undefined) {
                    if (!extraOptions.ignoreMissing) {
                        throw new Error("Property \"" + potentialFillFrom + "\" was not found!");
                    }
                    //Otherwise do nothing.
                } else {
                    this.getBestHandler(children[cn], extraOptions.handlers).handle(children[cn], propertyValue);
                }
            }
            this.fillElement(children[cn], object, {
                handlers : extraOptions.handlers,
                objectMappingFunction : extraOptions.objectMappingFunction,
                ignoreMissing : extraOptions.ignoreMissing,
                //Done use defaults, if the caller wanted them they will have already been added
                useDefaultHandlers : false
            });
        }
    }
};
