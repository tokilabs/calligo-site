"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var dev = {
    history: [],
    record: function (action, data) {
        window.dev.history.push({
            action: action,
            data: data,
        });
    },
    undo: function () {
        var lastAction = window.dev.history.pop();
        if ((lastAction === null || lastAction === void 0 ? void 0 : lastAction.action) === 'created') {
            lastAction.data.remove();
        }
    },
    watch: function () {
        var app = window['app'];
        var logo = window['logo'];
        var history = window.dev.history;
        console.dir({ app: app, logo: logo, history: history });
    },
};
window['dev'] = dev;
var $ = function (selector) {
    return document.querySelector(selector);
};
var $$ = function (selector) {
    return document.querySelectorAll(selector);
};
function copyCss(from, to, props) {
    var fromEl = $(from);
    var toEl = $(to);
    if (!fromEl) {
        console.error("Element ".concat(from, " not found."));
        return;
    }
    if (!toEl) {
        console.error("Element ".concat(to, " not found."));
        return;
    }
    var fromStyle = window.getComputedStyle(fromEl);
    props.forEach(function (prop) {
        toEl.style[prop] = fromStyle[prop];
    });
}
var navLinkClass = ((_a = $('nav a:last-child')) === null || _a === void 0 ? void 0 : _a.className) || '';
var navLinkInnerClass = ((_b = $('nav a:last-child > span')) === null || _b === void 0 ? void 0 : _b.className) || '';
function NavLink(url, text) {
    return "\n    <a href=\"".concat(url, "\" class=\"").concat(navLinkClass, " nav-link\">\n      <span class='").concat(navLinkInnerClass, "'>\n        <span>").concat(text, "</span>\n      </span>\n    </a>");
}
function htmlToFragment(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.cloneNode(true);
}
function el(elementHtml) {
    var _a;
    var template = document.createElement('template');
    template.innerHTML = elementHtml;
    return (_a = template.content.firstElementChild) === null || _a === void 0 ? void 0 : _a.cloneNode(true);
}
var positionAliases = {
    before: 'beforebegin',
    after: 'afterend',
    start: 'afterbegin',
    end: 'beforeend',
};
function at(pos) {
    return function (node) {
        return function (inserted) {
            findEl(node).insertAdjacentElement(pos, inserted);
        };
    };
}
var before = at(positionAliases['before']);
var after = at(positionAliases['after']);
var start = at(positionAliases['start']);
var end = at(positionAliases['end']);
function findEl(el) {
    if (el instanceof Element) {
        return el;
    }
    var found = $(el);
    if (found instanceof Element) {
        return found;
    }
    throw new Error("Element ".concat(el, " not found or is not an HTMLElement"));
}
function insert(node, where) {
    if (!node || !(node instanceof Node)) {
        throw new Error('You must pass a valid Node to insert as the first argument.');
    }
    where(findEl(node));
}
function addNavLink(url, text, insertFn) {
    var nav = $('nav');
    if (!nav) {
        throw new Error('Navigation element not found');
    }
    var newLink = el(NavLink(url, text));
    if (!newLink) {
        throw new Error('Unable to create new link element');
    }
    if (typeof insertFn === 'function') {
        insertFn(newLink);
    }
    else {
        nav.appendChild(newLink);
    }
    dev.record('created', newLink);
    return newLink;
}
document.onload = function () {
    var leftNav = el('<div id="left-nav"></div>');
    if (!leftNav) {
        throw new Error('Unable to create left navigation element');
    }
    var logo = $('nav a[href="/"]');
    if (!logo) {
        throw new Error('Logo element not found');
    }
    insert(leftNav, after(logo));
    copyCss('nav form', '#left-nav', ['borderLeft']);
    addNavLink('https://www.calligo.com.br/manifesto', 'Nosso Propósito', start($('#left-nav')));
};
