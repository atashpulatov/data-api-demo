/* eslint-disable */

/**
 * History API's pushState & replaceState are nullified by Office.js
 * https://github.com/OfficeDev/office-js/issues/429
 *
 * In mshtml (IWebBrowser2) used in Windows Excel Desktop both methods are not working.
 * In order to replace them we need to delete them from the window scope and apply a polyfill.
 * On the Excel side we detect Excel Desktop and IE 11 before loading the script.
 */
if (window.history.__proto__.replaceState)
  delete window.history.__proto__.replaceState;
if (window.history.__proto__.pushState)
  delete window.history.__proto__.pushState;
if (window.history.replaceState) delete window.history.replaceState;
if (window.history.pushState) delete window.history.pushState;

/*!
 * History API JavaScript Library v4.2.10
 *
 * Support: IE8+, FF3+, Opera 9+, Safari, Chrome and other
 *
 * Copyright 2011-2018, Dmitrii Pakhtinov ( spb.piksel@gmail.com )
 *
 * http://spb-piksel.ru/
 *
 * MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Update: 2018-04-15 13:54
 */
(function (m) {
  if ("function" === typeof define && define.amd) {
    if ("undefined" !== typeof requirejs) {
      var s = requirejs,
        j = "[history" + new Date().getTime() + "]",
        y = s.onError;
      m.toString = function () {
        return j;
      };
      s.onError = function (m) {
        -1 === m.message.indexOf(j) && y.call(s, m);
      };
    }
    define([], m);
  }
  if ("object" === typeof exports && "undefined" !== typeof module)
    module.exports = m();
  else return m();
})(function () {
  var h = !0,
    i = null,
    p = !1;
  function m(a, b) {
    var c = d.history !== q;
    c && (d.history = q);
    a.apply(q, b);
    c && (d.history = k);
  }
  function s() {}
  function j(a, b, c) {
    if (a != i && "" !== a && !b) {
      var b = j(),
        f = g.getElementsByTagName("base")[0];
      !c &&
        f &&
        f.getAttribute("href") &&
        ((f.href = f.href), (b = j(f.href, i, h)));
      c = b.d;
      f = b.h;
      a = "" + a;
      a = /^(?:\w+\:)?\/\//.test(a)
        ? 0 === a.indexOf("/")
          ? f + a
          : a
        : f +
          "//" +
          b.g +
          (0 === a.indexOf("/")
            ? a
            : 0 === a.indexOf("?")
              ? c + a
              : 0 === a.indexOf("#")
                ? c + b.e + a
                : c.replace(/[^\/]+$/g, "") + a);
    } else if (((a = b ? a : e.href), !o || c))
      (a = a.replace(/^[^#]*/, "") || "#"),
        (a =
          e.protocol.replace(/:.*$|$/, ":") +
          "//" +
          e.host +
          l.basepath +
          a.replace(RegExp("^#[/]?(?:" + l.type + ")?"), ""));
    O.href = a;
    var a =
        /(?:([a-zA-Z0-9\-]+\:))?(?:\/\/(?:[^@]*@)?([^\/:\?#]+)(?::([0-9]+))?)?([^\?#]*)(?:(\?[^#]+)|\?)?(?:(#.*))?/.exec(
          O.href,
        ),
      b = a[2] + (a[3] ? ":" + a[3] : ""),
      c = a[4] || "/",
      f = a[5] || "",
      d = "#" === a[6] ? "" : a[6] || "",
      k = c + f + d,
      m = c.replace(RegExp("^" + l.basepath, "i"), l.type) + f;
    return {
      b: a[1] + "//" + b + k,
      h: a[1],
      g: b,
      i: a[2],
      k: a[3] || "",
      d: c,
      e: f,
      a: d,
      c: k,
      j: m,
      f: m + d,
    };
  }
  function y(a) {
    return a &&
      d &&
      d.EventTarget &&
      "function" === typeof d.EventTarget.prototype.addEventListener &&
      "function" === typeof a.bind
      ? a.bind(d)
      : a;
  }
  function $() {
    var a;
    try {
      (a = d.sessionStorage), a.setItem(C + "t", "1"), a.removeItem(C + "t");
    } catch (b) {
      a = {
        getItem: function (a) {
          a = g.cookie.split(a + "=");
          return (1 < a.length && a.pop().split(";").shift()) || "null";
        },
        setItem: function (a) {
          var b = {};
          if ((b[e.href] = k.state)) g.cookie = a + "=" + t.stringify(b);
        },
      };
    }
    try {
      r = t.parse(a.getItem(C)) || {};
    } catch (c) {
      r = {};
    }
    u(
      v + "unload",
      function () {
        a.setItem(C, t.stringify(r));
      },
      p,
    );
  }
  function D(a, b, c, f) {
    var e = 0;
    c || ((c = { set: s }), (e = 1));
    var g = !c.set,
      j = !c.get,
      k = {
        configurable: h,
        set: function () {
          g = 1;
        },
        get: function () {
          j = 1;
        },
      };
    try {
      z(a, b, k), (a[b] = a[b]), z(a, b, c);
    } catch (l) {}
    if (!g || !j)
      if (
        (a.__defineGetter__ &&
          (a.__defineGetter__(b, k.get),
          a.__defineSetter__(b, k.set),
          (a[b] = a[b]),
          c.get && a.__defineGetter__(b, c.get),
          c.set && a.__defineSetter__(b, c.set)),
        !g || !j)
      ) {
        if (e) return p;
        if (a === d) {
          try {
            var m = a[b];
            a[b] = i;
          } catch (o) {}
          if ("execScript" in d)
            d.execScript("Public " + b, "VBScript"),
              d.execScript("var " + b + ";", "JavaScript");
          else
            try {
              z(a, b, { value: s });
            } catch (r) {
              "onpopstate" === b &&
                (u(
                  "popstate",
                  (c = function () {
                    I("popstate", c, p);
                    var b = a.onpopstate;
                    a.onpopstate = i;
                    setTimeout(function () {
                      a.onpopstate = b;
                    }, 1);
                  }),
                  p,
                ),
                (P = 0));
            }
          a[b] = m;
        } else
          try {
            try {
              var n = J.create(a);
              z(J.getPrototypeOf(n) === a ? n : a, b, c);
              for (var q in a)
                "function" === typeof a[q] && (n[q] = a[q].bind(a));
              try {
                f.call(n, n, a);
              } catch (t) {}
              a = n;
            } catch (v) {
              z(a.constructor.prototype, b, c);
            }
          } catch (w) {
            return p;
          }
      }
    return a;
  }
  function aa(a, b, c) {
    c = c || {};
    a = a === Q ? e : a;
    c.set =
      c.set ||
      function (c) {
        a[b] = c;
      };
    c.get =
      c.get ||
      function () {
        return a[b];
      };
    return c;
  }
  function ba(a, b, c) {
    a in w
      ? w[a].push(b)
      : 3 < arguments.length
        ? u(a, b, c, arguments[3])
        : u(a, b, c);
  }
  function ca(a, b, c) {
    var d = w[a];
    if (d)
      for (a = d.length; a--; ) {
        if (d[a] === b) {
          d.splice(a, 1);
          break;
        }
      }
    else I(a, b, c);
  }
  function E(a, b) {
    var c = ("" + ("string" === typeof a ? a : a.type)).replace(/^on/, ""),
      f = w[c];
    if (f) {
      b = "string" === typeof a ? b : a;
      if (b.target == i)
        for (
          var e = ["target", "currentTarget", "srcElement", "type"];
          (a = e.pop());

        )
          b = D(b, a, {
            get:
              "type" === a
                ? function () {
                    return c;
                  }
                : function () {
                    return d;
                  },
          });
      P && (("popstate" === c ? d.onpopstate : d.onhashchange) || s).call(d, b);
      for (var e = 0, g = f.length; e < g; e++) f[e].call(d, b);
      return h;
    }
    return da(a, b);
  }
  function R() {
    var a = g.createEvent ? g.createEvent("Event") : g.createEventObject();
    a.initEvent ? a.initEvent("popstate", p, p) : (a.type = "popstate");
    a.state = k.state;
    E(a);
  }
  function A(a, b, c, d) {
    o
      ? (B = e.href)
      : (0 === n && (n = 2),
        (b = j(b, 2 === n && -1 !== ("" + b).indexOf("#"))),
        b.c !== j().c && ((B = d), c ? e.replace("#" + b.f) : (e.hash = b.f)));
    !F && a && (r[e.href] = a);
    G = p;
  }
  function S(a) {
    var b = B;
    B = e.href;
    if (b) {
      T !== e.href && R();
      var a = a || d.event,
        b = j(b, h),
        c = j();
      a.oldURL || ((a.oldURL = b.b), (a.newURL = c.b));
      b.a !== c.a && E(a);
    }
  }
  function U(a) {
    setTimeout(function () {
      u(
        "popstate",
        function (a) {
          T = e.href;
          F ||
            (a = D(a, "state", {
              get: function () {
                return k.state;
              },
            }));
          E(a);
        },
        p,
      );
    }, 0);
    !o && a !== h && "location" in k && (V(H.hash), G && ((G = p), R()));
  }
  function ea(a) {
    var a = a || d.event,
      b;
    a: {
      for (b = a.target || a.srcElement; b; ) {
        if ("A" === b.nodeName) break a;
        b = b.parentNode;
      }
      b = void 0;
    }
    var c = "defaultPrevented" in a ? a.defaultPrevented : a.returnValue === p;
    b &&
      "A" === b.nodeName &&
      !c &&
      ((c = j()),
      (b = j(b.getAttribute("href", 2))),
      c.b.split("#").shift() === b.b.split("#").shift() &&
        b.a &&
        (c.a !== b.a && (H.hash = b.a),
        V(b.a),
        a.preventDefault ? a.preventDefault() : (a.returnValue = p)));
  }
  function V(a) {
    var b = g.getElementById((a = (a || "").replace(/^#/, "")));
    b &&
      b.id === a &&
      "A" === b.nodeName &&
      ((a = b.getBoundingClientRect()),
      d.scrollTo(
        K.scrollLeft || 0,
        a.top + (K.scrollTop || 0) - (K.clientTop || 0),
      ));
  }
  var d = ("object" === typeof window ? window : this) || {};
  if (!d.history || "emulate" in d.history) return d.history;
  var g = d.document,
    K = g.documentElement,
    J = d.Object,
    t = d.JSON,
    e = d.location,
    q = d.history,
    k = q,
    L = q.pushState,
    W = q.replaceState,
    o = (function () {
      var a = d.navigator.userAgent;
      return (-1 !== a.indexOf("Android 2.") ||
        -1 !== a.indexOf("Android 4.0")) &&
        -1 !== a.indexOf("Mobile Safari") &&
        -1 === a.indexOf("Chrome") &&
        -1 === a.indexOf("Windows Phone")
        ? p
        : !!L;
    })(),
    F = "state" in q,
    z = J.defineProperty,
    H = D({}, "t") ? {} : g.createElement("a"),
    v = "",
    M = d.addEventListener ? "addEventListener" : (v = "on") && "attachEvent",
    X = d.removeEventListener ? "removeEventListener" : "detachEvent",
    Y = d.dispatchEvent ? "dispatchEvent" : "fireEvent",
    u = y(d[M]),
    I = y(d[X]),
    da = y(d[Y]),
    l = { basepath: "/", redirect: 0, type: "/", init: 0 },
    C = "__historyAPI__",
    O = g.createElement("a"),
    B = e.href,
    T = "",
    P = 1,
    G = p,
    n = 0,
    r = {},
    w = {},
    x = g.title,
    N,
    fa = { onhashchange: i, onpopstate: i },
    Z = {
      setup: function (a, b, c) {
        l.basepath = ("" + (a == i ? l.basepath : a)).replace(
          /(?:^|\/)[^\/]*$/,
          "/",
        );
        l.type = b == i ? l.type : b;
        l.redirect = c == i ? l.redirect : !!c;
      },
      redirect: function (a, b) {
        k.setup(b, a);
        b = l.basepath;
        if (d.top == d.self) {
          var c = j(i, p, h).c,
            f = e.pathname + e.search;
          o
            ? ((f = f.replace(/([^\/])$/, "$1/")),
              c != b && RegExp("^" + b + "$", "i").test(f) && e.replace(c))
            : f != b &&
              ((f = f.replace(/([^\/])\?/, "$1/?")),
              RegExp("^" + b, "i").test(f) &&
                e.replace(
                  b + "#" + f.replace(RegExp("^" + b, "i"), l.type) + e.hash,
                ));
        }
      },
      pushState: function (a, b, c) {
        var d = g.title;
        x != i && (g.title = x);
        L && m(L, arguments);
        A(a, c);
        g.title = d;
        x = b;
      },
      replaceState: function (a, b, c) {
        var d = g.title;
        x != i && (g.title = x);
        delete r[e.href];
        W && m(W, arguments);
        A(a, c, h);
        g.title = d;
        x = b;
      },
      location: {
        set: function (a) {
          0 === n && (n = 1);
          d.location = a;
        },
        get: function () {
          0 === n && (n = 1);
          return H;
        },
      },
      state: {
        get: function () {
          return "object" === typeof r[e.href]
            ? t.parse(t.stringify(r[e.href]))
            : "undefined" !== typeof r[e.href]
              ? r[e.href]
              : i;
        },
      },
    },
    Q = {
      assign: function (a) {
        !o && 0 === ("" + a).indexOf("#") ? A(i, a) : e.assign(a);
      },
      reload: function (a) {
        e.reload(a);
      },
      replace: function (a) {
        !o && 0 === ("" + a).indexOf("#") ? A(i, a, h) : e.replace(a);
      },
      toString: function () {
        return this.href;
      },
      origin: {
        get: function () {
          return void 0 !== N
            ? N
            : !e.origin
              ? e.protocol + "//" + e.hostname + (e.port ? ":" + e.port : "")
              : e.origin;
        },
        set: function (a) {
          N = a;
        },
      },
      href: o
        ? i
        : {
            get: function () {
              return j().b;
            },
          },
      protocol: i,
      host: i,
      hostname: i,
      port: i,
      pathname: o
        ? i
        : {
            get: function () {
              return j().d;
            },
          },
      search: o
        ? i
        : {
            get: function () {
              return j().e;
            },
          },
      hash: o
        ? i
        : {
            set: function (a) {
              A(i, ("" + a).replace(/^(#|)/, "#"), p, B);
            },
            get: function () {
              return j().a;
            },
          },
    };
  if (
    (function () {
      var a = g.getElementsByTagName("script"),
        a = (a[a.length - 1] || {}).src || "";
      (-1 !== a.indexOf("?") ? a.split("?").pop() : "").replace(
        /(\w+)(?:=([^&]*))?/g,
        function (a, b, c) {
          l[b] = (c || "").replace(/^(0|false)$/, "");
        },
      );
      u(v + "hashchange", S, p);
      var b = [Q, H, fa, d, Z, k];
      F && delete Z.state;
      for (var c = 0; c < b.length; c += 2)
        for (var e in b[c])
          if (b[c].hasOwnProperty(e))
            if ("object" !== typeof b[c][e]) b[c + 1][e] = b[c][e];
            else {
              a = aa(b[c], e, b[c][e]);
              if (
                !D(b[c + 1], e, a, function (a, e) {
                  if (e === k) d.history = k = b[c + 1] = a;
                })
              )
                return I(v + "hashchange", S, p), p;
              b[c + 1] === d && (w[e] = w[e.substr(2)] = []);
            }
      k.setup();
      l.redirect && k.redirect();
      l.init && (n = 1);
      !F && t && $();
      if (!o) g[M](v + "click", ea, p);
      "complete" === g.readyState
        ? U(h)
        : (!o && j().c !== l.basepath && (G = h), u(v + "load", U, p));
      return h;
    })()
  )
    return (k.emulate = !o), (d[M] = ba), (d[X] = ca), (d[Y] = E), k;
});
