'use strict';
var core_test_object = {
    myHTML  : "<a href='http://example.com'>Things and Stuff</a>",
    text    : "<a href='http://example.com'>This should just be text and not an element</a>",
    myOtherObj : {
        innerObject1 : "WOO 1 Object",
        innerObject2 : "tcejbO 2 OOW"
    },
    whatwasthatbuttonsupposedtosay : "Test",
    doiknow : true,
    buttonnamingoptions : ["Thingy", "Tap", "Press", "Click", "Hit", "Smack", "Push", "Just use the button"],
    somecustomdata : { data: "this is custom data", title : "This should be bold"}
};
objectToDisplay.handlers.push({
    desirablenessOf : function (el) {
        if (el.tagName === "INPUT") {
            if (el.type === "button") {
                return 5;
            } else if (el.type === "checkbox") {
                return 5;
            }
        }
    },
    handle : function (el, d) {
        if (el.type === "button") {
            el.value = d;
        } else if (el.type === "checkbox") {
            el.checked = d;
        }
    }
});
objectToDisplay.handlers.push({
    desirablenessOf : function (el) {
        if (el.tagName === "SELECT") {
            return 25;
        }
    },
    handle : function (el, d) {
        d.forEach(function (e) {
            var o = document.createElement("option");
            o.value = e;
            el.appendChild(o);
        });
    }
});
objectToDisplay.handlers.push({
    desirablenessOf : function (el) {
        if (el.dataset.displayType === "simpleCustom") {
            return 10;
        }
    },
    handle : function (el, d) {
        var b = document.createElement("B");
        b.textContent = d.title;
        el.textContent = d.data;
        el.insertBefore(b, el.firstChild);
    }
});
QUnit.test("CORE: Text", function (assert) {
    objectToDisplay.fillElement(document.getElementById("container"), core_test_object);
    assert.equal(document.getElementById("textTest").children.length, 0);
    assert.equal(document.getElementById("textTest").textContent, "<a href='http://example.com'>This should just be text and not an element</a>");
});
QUnit.test("CORE: HTML", function (assert) {
    objectToDisplay.fillElement(document.getElementById("container"), core_test_object);
    assert.equal(document.getElementById("htmlTest").children.length, 1);
    assert.equal(document.getElementById("htmlTest").children[0].href, "http://example.com/");
});
QUnit.test("CORE: Nested", function (assert) {
    objectToDisplay.fillElement(document.getElementById("container"), core_test_object);
    assert.equal(document.getElementById("n_e_e1").textContent, "WOO 1 Object");
    assert.equal(document.getElementById("n_e_e2").textContent, "tcejbO 2 OOW");
});
QUnit.test("CORE: Custom Handler Element(input[type=button])", function (assert) {
    objectToDisplay.fillElement(document.getElementById("container"), core_test_object);
    assert.equal(document.querySelector('input[data-display="whatwasthatbuttonsupposedtosay"]').value, "Test");
});
QUnit.test("CORE: Custom Handler Element(input[type=checkbox])", function (assert) {
    objectToDisplay.fillElement(document.getElementById("container"), core_test_object);
    assert.equal(document.querySelector('input[data-display="doiknow"]').checked, true);
});
QUnit.test("CORE: Custom Handler Element(select)", function (assert) {
    objectToDisplay.fillElement(document.getElementById("container"), core_test_object);
    assert.equal(document.querySelector('select[data-display="buttonnamingoptions"]').children.length, 8);
});
QUnit.test("CORE: Custom Handler Type(simpleCustom)", function (assert) {
    objectToDisplay.fillElement(document.getElementById("container"), core_test_object);
    assert.equal(document.querySelector('span[data-display-type="simpleCustom"]').children.length, 1);
    assert.equal(document.querySelector('span[data-display-type="simpleCustom"]').children[0].textContent, "This should be bold");
    assert.equal(document.querySelector('span[data-display-type="simpleCustom"]').innerHTML, "<b>This should be bold</b>this is custom data");
});
QUnit.test("IGNORE: (OFF) Element Not Found", function (assert) {
    assert.throws(function () {
        objectToDisplay.fillElement(document.getElementById("container"), core_test_object, false);
    }, new Error("Property \"thisismissing\" was not found!"), "Element not found throws if not ignored");
});
QUnit.test("ObjectMappingFunction: Set", function (assert) {
    objectToDisplay.fillElement(document.getElementById("container"), core_test_object, true, function (obj, req) {
        if (req === "thisdoesntactualmapautomatically") {
            return obj.doiknow;
        } else {
            return undefined;
        }
    });
    assert.equal(document.getElementById("htmlTest").textContent, "");
    assert.equal(document.querySelector('span[data-display="thisdoesntactualmapautomatically"]').textContent, "true");
});