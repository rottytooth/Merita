/*
 * PEG.js 0.10.0
 *
 * http://pegjs.org/
 *
 * Copyright (c) 2010-2016 David Majda
 * Licensed under the MIT license.
 */ !function(u) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = u();
    else if ("function" == typeof define && define.amd) define([], u);
    else {
        var e;
        e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, e.peg = u();
    }
}(function() {
    var define, module, exports;
    return (function u(e, t, r) {
        function n(s, i) {
            if (!t[s]) {
                if (!e[s]) {
                    var a = "function" == typeof require && undefined;
                    if (!i && a) return a(s, !0);
                    if (o) return o(s, !0);
                    var c = new Error("Cannot find module '" + s + "'");
                    throw c.code = "MODULE_NOT_FOUND", c;
                }
                var p = t[s] = {
                    exports: {}
                };
                e[s][0].call(p.exports, function(u) {
                    var t = e[s][1][u];
                    return n(t ? t : u);
                }, p, p.exports, u, e, t, r);
            }
            return t[s].exports;
        }
        for(var o = "function" == typeof require && undefined, s = 0; s < r.length; s++)n(r[s]);
        return n;
    })({
        1: [
            function(u, e, t) {
                "use strict";
                var r = u("../utils/arrays"), n = u("./visitor"), o = {
                    findRule: function(u, e) {
                        return r.find(u.rules, function(u) {
                            return u.name === e;
                        });
                    },
                    indexOfRule: function(u, e) {
                        return r.indexOf(u.rules, function(u) {
                            return u.name === e;
                        });
                    },
                    alwaysConsumesOnSuccess: function(u, e) {
                        function t() {
                            return !0;
                        }
                        function s() {
                            return !1;
                        }
                        function i(u) {
                            return a(u.expression);
                        }
                        var a = n.build({
                            rule: i,
                            named: i,
                            choice: function(u) {
                                return r.every(u.alternatives, a);
                            },
                            action: i,
                            sequence: function(u) {
                                return r.some(u.elements, a);
                            },
                            labeled: i,
                            text: i,
                            simple_and: s,
                            simple_not: s,
                            optional: s,
                            zero_or_more: s,
                            one_or_more: i,
                            group: i,
                            semantic_and: s,
                            semantic_not: s,
                            rule_ref: function(e) {
                                return a(o.findRule(u, e.name));
                            },
                            literal: function(u) {
                                return "" !== u.value;
                            },
                            class: t,
                            any: t
                        });
                        return a(e);
                    }
                };
                e.exports = o;
            },
            {
                "../utils/arrays": 17,
                "./visitor": 13
            }
        ],
        2: [
            function(require, module, exports) {
                "use strict";
                var arrays = require("../utils/arrays"), objects = require("../utils/objects"), compiler = {
                    visitor: require("./visitor"),
                    passes: {
                        check: {
                            reportUndefinedRules: require("./passes/report-undefined-rules"),
                            reportDuplicateRules: require("./passes/report-duplicate-rules"),
                            reportDuplicateLabels: require("./passes/report-duplicate-labels"),
                            reportInfiniteRecursion: require("./passes/report-infinite-recursion"),
                            reportInfiniteRepetition: require("./passes/report-infinite-repetition")
                        },
                        transform: {
                            removeProxyRules: require("./passes/remove-proxy-rules")
                        },
                        generate: {
                            generateBytecode: require("./passes/generate-bytecode"),
                            generateJS: require("./passes/generate-js")
                        }
                    },
                    compile: function(ast, passes, options) {
                        options = void 0 !== options ? options : {};
                        var stage;
                        options = objects.clone(options), objects.defaults(options, {
                            allowedStartRules: [
                                ast.rules[0].name
                            ],
                            cache: !1,
                            dependencies: {},
                            exportVar: null,
                            format: "bare",
                            optimize: "speed",
                            output: "parser",
                            trace: !1
                        });
                        for(stage in passes)passes.hasOwnProperty(stage) && arrays.each(passes[stage], function(u) {
                            u(ast, options);
                        });
                        switch(options.output){
                            case "parser":
                                return eval(ast.code);
                            case "source":
                                return ast.code;
                        }
                    }
                };
                module.exports = compiler;
            },
            {
                "../utils/arrays": 17,
                "../utils/objects": 19,
                "./passes/generate-bytecode": 5,
                "./passes/generate-js": 6,
                "./passes/remove-proxy-rules": 7,
                "./passes/report-duplicate-labels": 8,
                "./passes/report-duplicate-rules": 9,
                "./passes/report-infinite-recursion": 10,
                "./passes/report-infinite-repetition": 11,
                "./passes/report-undefined-rules": 12,
                "./visitor": 13
            }
        ],
        3: [
            function(u, e, t) {
                "use strict";
                function r(u) {
                    return u.charCodeAt(0).toString(16).toUpperCase();
                }
                var n = {
                    stringEscape: function(u) {
                        return u.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\0/g, "\\0").replace(/\x08/g, "\\b").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(u) {
                            return "\\x0" + r(u);
                        }).replace(/[\x10-\x1F\x7F-\xFF]/g, function(u) {
                            return "\\x" + r(u);
                        }).replace(/[\u0100-\u0FFF]/g, function(u) {
                            return "\\u0" + r(u);
                        }).replace(/[\u1000-\uFFFF]/g, function(u) {
                            return "\\u" + r(u);
                        });
                    },
                    regexpClassEscape: function(u) {
                        return u.replace(/\\/g, "\\\\").replace(/\//g, "\\/").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\v/g, "\\x0B").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(u) {
                            return "\\x0" + r(u);
                        }).replace(/[\x10-\x1F\x7F-\xFF]/g, function(u) {
                            return "\\x" + r(u);
                        }).replace(/[\u0100-\u0FFF]/g, function(u) {
                            return "\\u0" + r(u);
                        }).replace(/[\u1000-\uFFFF]/g, function(u) {
                            return "\\u" + r(u);
                        });
                    }
                };
                e.exports = n;
            },
            {}
        ],
        4: [
            function(u, e, t) {
                "use strict";
                var r = {
                    PUSH: 0,
                    PUSH_UNDEFINED: 1,
                    PUSH_NULL: 2,
                    PUSH_FAILED: 3,
                    PUSH_EMPTY_ARRAY: 4,
                    PUSH_CURR_POS: 5,
                    POP: 6,
                    POP_CURR_POS: 7,
                    POP_N: 8,
                    NIP: 9,
                    APPEND: 10,
                    WRAP: 11,
                    TEXT: 12,
                    IF: 13,
                    IF_ERROR: 14,
                    IF_NOT_ERROR: 15,
                    WHILE_NOT_ERROR: 16,
                    MATCH_ANY: 17,
                    MATCH_STRING: 18,
                    MATCH_STRING_IC: 19,
                    MATCH_REGEXP: 20,
                    ACCEPT_N: 21,
                    ACCEPT_STRING: 22,
                    FAIL: 23,
                    LOAD_SAVED_POS: 24,
                    UPDATE_SAVED_POS: 25,
                    CALL: 26,
                    RULE: 27,
                    SILENT_FAILS_ON: 28,
                    SILENT_FAILS_OFF: 29
                };
                e.exports = r;
            },
            {}
        ],
        5: [
            function(u, e, t) {
                "use strict";
                function r(u) {
                    function e(u) {
                        var e = n.indexOf(F, u);
                        return e === -1 ? F.push(u) - 1 : e;
                    }
                    function t(u, t) {
                        return e("function(" + u.join(", ") + ") {" + t + "}");
                    }
                    function r() {
                        return Array.prototype.concat.apply([], arguments);
                    }
                    function p(u, e, t) {
                        return u.concat([
                            e.length,
                            t.length
                        ], e, t);
                    }
                    function A(u, e) {
                        return u.concat([
                            e.length
                        ], e);
                    }
                    function l(u, e, t, r) {
                        var s = n.map(o.values(t), function(u) {
                            return r - u;
                        });
                        return [
                            a.CALL,
                            u,
                            e,
                            s.length
                        ].concat(s);
                    }
                    function E(u, e, t) {
                        return r([
                            a.PUSH_CURR_POS
                        ], [
                            a.SILENT_FAILS_ON
                        ], d(u, {
                            sp: t.sp + 1,
                            env: o.clone(t.env),
                            action: null
                        }), [
                            a.SILENT_FAILS_OFF
                        ], p([
                            e ? a.IF_ERROR : a.IF_NOT_ERROR
                        ], r([
                            a.POP
                        ], [
                            e ? a.POP : a.POP_CURR_POS
                        ], [
                            a.PUSH_UNDEFINED
                        ]), r([
                            a.POP
                        ], [
                            e ? a.POP_CURR_POS : a.POP
                        ], [
                            a.PUSH_FAILED
                        ])));
                    }
                    function C(u, e, n) {
                        var s = t(o.keys(n.env), u);
                        return r([
                            a.UPDATE_SAVED_POS
                        ], l(s, 0, n.env, n.sp), p([
                            a.IF
                        ], r([
                            a.POP
                        ], e ? [
                            a.PUSH_FAILED
                        ] : [
                            a.PUSH_UNDEFINED
                        ]), r([
                            a.POP
                        ], e ? [
                            a.PUSH_UNDEFINED
                        ] : [
                            a.PUSH_FAILED
                        ])));
                    }
                    function f(u) {
                        return A([
                            a.WHILE_NOT_ERROR
                        ], r([
                            a.APPEND
                        ], u));
                    }
                    var F = [], d = i.build({
                        grammar: function(u) {
                            n.each(u.rules, d), u.consts = F;
                        },
                        rule: function(u) {
                            u.bytecode = d(u.expression, {
                                sp: -1,
                                env: {},
                                action: null
                            });
                        },
                        named: function(u, t) {
                            var n = e('peg$otherExpectation("' + c.stringEscape(u.name) + '")');
                            return r([
                                a.SILENT_FAILS_ON
                            ], d(u.expression, t), [
                                a.SILENT_FAILS_OFF
                            ], p([
                                a.IF_ERROR
                            ], [
                                a.FAIL,
                                n
                            ], []));
                        },
                        choice: function(u, e) {
                            function t(u, e) {
                                return r(d(u[0], {
                                    sp: e.sp,
                                    env: o.clone(e.env),
                                    action: null
                                }), u.length > 1 ? p([
                                    a.IF_ERROR
                                ], r([
                                    a.POP
                                ], t(u.slice(1), e)), []) : []);
                            }
                            return t(u.alternatives, e);
                        },
                        action: function(u, e) {
                            var n = o.clone(e.env), s = "sequence" !== u.expression.type || 0 === u.expression.elements.length, i = d(u.expression, {
                                sp: e.sp + (s ? 1 : 0),
                                env: n,
                                action: u
                            }), c = t(o.keys(n), u.code);
                            return s ? r([
                                a.PUSH_CURR_POS
                            ], i, p([
                                a.IF_NOT_ERROR
                            ], r([
                                a.LOAD_SAVED_POS,
                                1
                            ], l(c, 1, n, e.sp + 2)), []), [
                                a.NIP
                            ]) : i;
                        },
                        sequence: function(u, e) {
                            function n(e, s) {
                                var i, c;
                                return e.length > 0 ? (i = u.elements.length - e.slice(1).length, r(d(e[0], {
                                    sp: s.sp,
                                    env: s.env,
                                    action: null
                                }), p([
                                    a.IF_NOT_ERROR
                                ], n(e.slice(1), {
                                    sp: s.sp + 1,
                                    env: s.env,
                                    action: s.action
                                }), r(i > 1 ? [
                                    a.POP_N,
                                    i
                                ] : [
                                    a.POP
                                ], [
                                    a.POP_CURR_POS
                                ], [
                                    a.PUSH_FAILED
                                ])))) : s.action ? (c = t(o.keys(s.env), s.action.code), r([
                                    a.LOAD_SAVED_POS,
                                    u.elements.length
                                ], l(c, u.elements.length, s.env, s.sp), [
                                    a.NIP
                                ])) : r([
                                    a.WRAP,
                                    u.elements.length
                                ], [
                                    a.NIP
                                ]);
                            }
                            return r([
                                a.PUSH_CURR_POS
                            ], n(u.elements, {
                                sp: e.sp + 1,
                                env: e.env,
                                action: e.action
                            }));
                        },
                        labeled: function(u, e) {
                            var t = o.clone(e.env);
                            return e.env[u.label] = e.sp + 1, d(u.expression, {
                                sp: e.sp,
                                env: t,
                                action: null
                            });
                        },
                        text: function(u, e) {
                            return r([
                                a.PUSH_CURR_POS
                            ], d(u.expression, {
                                sp: e.sp + 1,
                                env: o.clone(e.env),
                                action: null
                            }), p([
                                a.IF_NOT_ERROR
                            ], r([
                                a.POP
                            ], [
                                a.TEXT
                            ]), [
                                a.NIP
                            ]));
                        },
                        simple_and: function(u, e) {
                            return E(u.expression, !1, e);
                        },
                        simple_not: function(u, e) {
                            return E(u.expression, !0, e);
                        },
                        optional: function(u, e) {
                            return r(d(u.expression, {
                                sp: e.sp,
                                env: o.clone(e.env),
                                action: null
                            }), p([
                                a.IF_ERROR
                            ], r([
                                a.POP
                            ], [
                                a.PUSH_NULL
                            ]), []));
                        },
                        zero_or_more: function(u, e) {
                            var t = d(u.expression, {
                                sp: e.sp + 1,
                                env: o.clone(e.env),
                                action: null
                            });
                            return r([
                                a.PUSH_EMPTY_ARRAY
                            ], t, f(t), [
                                a.POP
                            ]);
                        },
                        one_or_more: function(u, e) {
                            var t = d(u.expression, {
                                sp: e.sp + 1,
                                env: o.clone(e.env),
                                action: null
                            });
                            return r([
                                a.PUSH_EMPTY_ARRAY
                            ], t, p([
                                a.IF_NOT_ERROR
                            ], r(f(t), [
                                a.POP
                            ]), r([
                                a.POP
                            ], [
                                a.POP
                            ], [
                                a.PUSH_FAILED
                            ])));
                        },
                        group: function(u, e) {
                            return d(u.expression, {
                                sp: e.sp,
                                env: o.clone(e.env),
                                action: null
                            });
                        },
                        semantic_and: function(u, e) {
                            return C(u.code, !1, e);
                        },
                        semantic_not: function(u, e) {
                            return C(u.code, !0, e);
                        },
                        rule_ref: function(e) {
                            return [
                                a.RULE,
                                s.indexOfRule(u, e.name)
                            ];
                        },
                        literal: function(u) {
                            var t, r;
                            return u.value.length > 0 ? (t = e('"' + c.stringEscape(u.ignoreCase ? u.value.toLowerCase() : u.value) + '"'), r = e('peg$literalExpectation("' + c.stringEscape(u.value) + '", ' + u.ignoreCase + ")"), p(u.ignoreCase ? [
                                a.MATCH_STRING_IC,
                                t
                            ] : [
                                a.MATCH_STRING,
                                t
                            ], u.ignoreCase ? [
                                a.ACCEPT_N,
                                u.value.length
                            ] : [
                                a.ACCEPT_STRING,
                                t
                            ], [
                                a.FAIL,
                                r
                            ])) : (t = e('""'), [
                                a.PUSH,
                                t
                            ]);
                        },
                        class: function(u) {
                            var t, r, o, s;
                            return t = u.parts.length > 0 ? "/^[" + (u.inverted ? "^" : "") + n.map(u.parts, function(u) {
                                return u instanceof Array ? c.regexpClassEscape(u[0]) + "-" + c.regexpClassEscape(u[1]) : c.regexpClassEscape(u);
                            }).join("") + "]/" + (u.ignoreCase ? "i" : "") : u.inverted ? "/^[\\S\\s]/" : "/^(?!)/", r = "[" + n.map(u.parts, function(u) {
                                return u instanceof Array ? '["' + c.stringEscape(u[0]) + '", "' + c.stringEscape(u[1]) + '"]' : '"' + c.stringEscape(u) + '"';
                            }).join(", ") + "]", o = e(t), s = e("peg$classExpectation(" + r + ", " + u.inverted + ", " + u.ignoreCase + ")"), p([
                                a.MATCH_REGEXP,
                                o
                            ], [
                                a.ACCEPT_N,
                                1
                            ], [
                                a.FAIL,
                                s
                            ]);
                        },
                        any: function() {
                            var u = e("peg$anyExpectation()");
                            return p([
                                a.MATCH_ANY
                            ], [
                                a.ACCEPT_N,
                                1
                            ], [
                                a.FAIL,
                                u
                            ]);
                        }
                    });
                    d(u);
                }
                var n = u("../../utils/arrays"), o = u("../../utils/objects"), s = u("../asts"), i = u("../visitor"), a = u("../opcodes"), c = u("../js");
                e.exports = r;
            },
            {
                "../../utils/arrays": 17,
                "../../utils/objects": 19,
                "../asts": 1,
                "../js": 3,
                "../opcodes": 4,
                "../visitor": 13
            }
        ],
        6: [
            function(require, module, exports) {
                "use strict";
                function generateJS(ast, options) {
                    function indent2(u) {
                        return u.replace(/^(.+)$/gm, "  $1");
                    }
                    function indent6(u) {
                        return u.replace(/^(.+)$/gm, "      $1");
                    }
                    function indent10(u) {
                        return u.replace(/^(.+)$/gm, "          $1");
                    }
                    function generateTables() {
                        return "size" === options.optimize ? [
                            "peg$consts = [",
                            indent2(ast.consts.join(",\n")),
                            "],",
                            "",
                            "peg$bytecode = [",
                            indent2(arrays.map(ast.rules, function(u) {
                                return 'peg$decode("' + js.stringEscape(arrays.map(u.bytecode, function(u) {
                                    return String.fromCharCode(u + 32);
                                }).join("")) + '")';
                            }).join(",\n")),
                            "],"
                        ].join("\n") : arrays.map(ast.consts, function(u, e) {
                            return "peg$c" + e + " = " + u + ",";
                        }).join("\n");
                    }
                    function generateRuleHeader(u, e) {
                        var t = [];
                        return t.push(""), options.trace && t.push([
                            "peg$tracer.trace({",
                            '  type:     "rule.enter",',
                            "  rule:     " + u + ",",
                            "  location: peg$computeLocation(startPos, startPos)",
                            "});",
                            ""
                        ].join("\n")), options.cache && (t.push([
                            "var key    = peg$currPos * " + ast.rules.length + " + " + e + ",",
                            "    cached = peg$resultsCache[key];",
                            "",
                            "if (cached) {",
                            "  peg$currPos = cached.nextPos;",
                            ""
                        ].join("\n")), options.trace && t.push([
                            "if (cached.result !== peg$FAILED) {",
                            "  peg$tracer.trace({",
                            '    type:   "rule.match",',
                            "    rule:   " + u + ",",
                            "    result: cached.result,",
                            "    location: peg$computeLocation(startPos, peg$currPos)",
                            "  });",
                            "} else {",
                            "  peg$tracer.trace({",
                            '    type: "rule.fail",',
                            "    rule: " + u + ",",
                            "    location: peg$computeLocation(startPos, startPos)",
                            "  });",
                            "}",
                            ""
                        ].join("\n")), t.push([
                            "  return cached.result;",
                            "}",
                            ""
                        ].join("\n"))), t.join("\n");
                    }
                    function generateRuleFooter(u, e) {
                        var t = [];
                        return options.cache && t.push([
                            "",
                            "peg$resultsCache[key] = { nextPos: peg$currPos, result: " + e + " };"
                        ].join("\n")), options.trace && t.push([
                            "",
                            "if (" + e + " !== peg$FAILED) {",
                            "  peg$tracer.trace({",
                            '    type:   "rule.match",',
                            "    rule:   " + u + ",",
                            "    result: " + e + ",",
                            "    location: peg$computeLocation(startPos, peg$currPos)",
                            "  });",
                            "} else {",
                            "  peg$tracer.trace({",
                            '    type: "rule.fail",',
                            "    rule: " + u + ",",
                            "    location: peg$computeLocation(startPos, startPos)",
                            "  });",
                            "}"
                        ].join("\n")), t.push([
                            "",
                            "return " + e + ";"
                        ].join("\n")), t.join("\n");
                    }
                    function generateInterpreter() {
                        function u(u, e) {
                            var t = e + 3, r = "bc[ip + " + (t - 2) + "]", n = "bc[ip + " + (t - 1) + "]";
                            return [
                                "ends.push(end);",
                                "ips.push(ip + " + t + " + " + r + " + " + n + ");",
                                "",
                                "if (" + u + ") {",
                                "  end = ip + " + t + " + " + r + ";",
                                "  ip += " + t + ";",
                                "} else {",
                                "  end = ip + " + t + " + " + r + " + " + n + ";",
                                "  ip += " + t + " + " + r + ";",
                                "}",
                                "",
                                "break;"
                            ].join("\n");
                        }
                        function e(u) {
                            var e = 2, t = "bc[ip + " + (e - 1) + "]";
                            return [
                                "if (" + u + ") {",
                                "  ends.push(end);",
                                "  ips.push(ip);",
                                "",
                                "  end = ip + " + e + " + " + t + ";",
                                "  ip += " + e + ";",
                                "} else {",
                                "  ip += " + e + " + " + t + ";",
                                "}",
                                "",
                                "break;"
                            ].join("\n");
                        }
                        function t() {
                            var u = 4, e = "bc[ip + " + (u - 1) + "]";
                            return [
                                "params = bc.slice(ip + " + u + ", ip + " + u + " + " + e + ");",
                                "for (i = 0; i < " + e + "; i++) {",
                                "  params[i] = stack[stack.length - 1 - params[i]];",
                                "}",
                                "",
                                "stack.splice(",
                                "  stack.length - bc[ip + 2],",
                                "  bc[ip + 2],",
                                "  peg$consts[bc[ip + 1]].apply(null, params)",
                                ");",
                                "",
                                "ip += " + u + " + " + e + ";",
                                "break;"
                            ].join("\n");
                        }
                        var r = [];
                        return r.push([
                            "function peg$decode(s) {",
                            "  var bc = new Array(s.length), i;",
                            "",
                            "  for (i = 0; i < s.length; i++) {",
                            "    bc[i] = s.charCodeAt(i) - 32;",
                            "  }",
                            "",
                            "  return bc;",
                            "}",
                            "",
                            "function peg$parseRule(index) {"
                        ].join("\n")), options.trace ? r.push([
                            "  var bc       = peg$bytecode[index],",
                            "      ip       = 0,",
                            "      ips      = [],",
                            "      end      = bc.length,",
                            "      ends     = [],",
                            "      stack    = [],",
                            "      startPos = peg$currPos,",
                            "      params, i;"
                        ].join("\n")) : r.push([
                            "  var bc    = peg$bytecode[index],",
                            "      ip    = 0,",
                            "      ips   = [],",
                            "      end   = bc.length,",
                            "      ends  = [],",
                            "      stack = [],",
                            "      params, i;"
                        ].join("\n")), r.push(indent2(generateRuleHeader("peg$ruleNames[index]", "index"))), r.push([
                            "  while (true) {",
                            "    while (ip < end) {",
                            "      switch (bc[ip]) {",
                            "        case " + op.PUSH + ":",
                            "          stack.push(peg$consts[bc[ip + 1]]);",
                            "          ip += 2;",
                            "          break;",
                            "",
                            "        case " + op.PUSH_UNDEFINED + ":",
                            "          stack.push(void 0);",
                            "          ip++;",
                            "          break;",
                            "",
                            "        case " + op.PUSH_NULL + ":",
                            "          stack.push(null);",
                            "          ip++;",
                            "          break;",
                            "",
                            "        case " + op.PUSH_FAILED + ":",
                            "          stack.push(peg$FAILED);",
                            "          ip++;",
                            "          break;",
                            "",
                            "        case " + op.PUSH_EMPTY_ARRAY + ":",
                            "          stack.push([]);",
                            "          ip++;",
                            "          break;",
                            "",
                            "        case " + op.PUSH_CURR_POS + ":",
                            "          stack.push(peg$currPos);",
                            "          ip++;",
                            "          break;",
                            "",
                            "        case " + op.POP + ":",
                            "          stack.pop();",
                            "          ip++;",
                            "          break;",
                            "",
                            "        case " + op.POP_CURR_POS + ":",
                            "          peg$currPos = stack.pop();",
                            "          ip++;",
                            "          break;",
                            "",
                            "        case " + op.POP_N + ":",
                            "          stack.length -= bc[ip + 1];",
                            "          ip += 2;",
                            "          break;",
                            "",
                            "        case " + op.NIP + ":",
                            "          stack.splice(-2, 1);",
                            "          ip++;",
                            "          break;",
                            "",
                            "        case " + op.APPEND + ":",
                            "          stack[stack.length - 2].push(stack.pop());",
                            "          ip++;",
                            "          break;",
                            "",
                            "        case " + op.WRAP + ":",
                            "          stack.push(stack.splice(stack.length - bc[ip + 1], bc[ip + 1]));",
                            "          ip += 2;",
                            "          break;",
                            "",
                            "        case " + op.TEXT + ":",
                            "          stack.push(input.substring(stack.pop(), peg$currPos));",
                            "          ip++;",
                            "          break;",
                            "",
                            "        case " + op.IF + ":",
                            indent10(u("stack[stack.length - 1]", 0)),
                            "",
                            "        case " + op.IF_ERROR + ":",
                            indent10(u("stack[stack.length - 1] === peg$FAILED", 0)),
                            "",
                            "        case " + op.IF_NOT_ERROR + ":",
                            indent10(u("stack[stack.length - 1] !== peg$FAILED", 0)),
                            "",
                            "        case " + op.WHILE_NOT_ERROR + ":",
                            indent10(e("stack[stack.length - 1] !== peg$FAILED")),
                            "",
                            "        case " + op.MATCH_ANY + ":",
                            indent10(u("input.length > peg$currPos", 0)),
                            "",
                            "        case " + op.MATCH_STRING + ":",
                            indent10(u("input.substr(peg$currPos, peg$consts[bc[ip + 1]].length) === peg$consts[bc[ip + 1]]", 1)),
                            "",
                            "        case " + op.MATCH_STRING_IC + ":",
                            indent10(u("input.substr(peg$currPos, peg$consts[bc[ip + 1]].length).toLowerCase() === peg$consts[bc[ip + 1]]", 1)),
                            "",
                            "        case " + op.MATCH_REGEXP + ":",
                            indent10(u("peg$consts[bc[ip + 1]].test(input.charAt(peg$currPos))", 1)),
                            "",
                            "        case " + op.ACCEPT_N + ":",
                            "          stack.push(input.substr(peg$currPos, bc[ip + 1]));",
                            "          peg$currPos += bc[ip + 1];",
                            "          ip += 2;",
                            "          break;",
                            "",
                            "        case " + op.ACCEPT_STRING + ":",
                            "          stack.push(peg$consts[bc[ip + 1]]);",
                            "          peg$currPos += peg$consts[bc[ip + 1]].length;",
                            "          ip += 2;",
                            "          break;",
                            "",
                            "        case " + op.FAIL + ":",
                            "          stack.push(peg$FAILED);",
                            "          if (peg$silentFails === 0) {",
                            "            peg$fail(peg$consts[bc[ip + 1]]);",
                            "          }",
                            "          ip += 2;",
                            "          break;",
                            "",
                            "        case " + op.LOAD_SAVED_POS + ":",
                            "          peg$savedPos = stack[stack.length - 1 - bc[ip + 1]];",
                            "          ip += 2;",
                            "          break;",
                            "",
                            "        case " + op.UPDATE_SAVED_POS + ":",
                            "          peg$savedPos = peg$currPos;",
                            "          ip++;",
                            "          break;",
                            "",
                            "        case " + op.CALL + ":",
                            indent10(t()),
                            "",
                            "        case " + op.RULE + ":",
                            "          stack.push(peg$parseRule(bc[ip + 1]));",
                            "          ip += 2;",
                            "          break;",
                            "",
                            "        case " + op.SILENT_FAILS_ON + ":",
                            "          peg$silentFails++;",
                            "          ip++;",
                            "          break;",
                            "",
                            "        case " + op.SILENT_FAILS_OFF + ":",
                            "          peg$silentFails--;",
                            "          ip++;",
                            "          break;",
                            "",
                            "        default:",
                            '          throw new Error("Invalid opcode: " + bc[ip] + ".");',
                            "      }",
                            "    }",
                            "",
                            "    if (ends.length > 0) {",
                            "      end = ends.pop();",
                            "      ip = ips.pop();",
                            "    } else {",
                            "      break;",
                            "    }",
                            "  }"
                        ].join("\n")), r.push(indent2(generateRuleFooter("peg$ruleNames[index]", "stack[0]"))), r.push("}"), r.join("\n");
                    }
                    function generateRuleFunction(rule) {
                        function c(u) {
                            return "peg$c" + u;
                        }
                        function s(u) {
                            return "s" + u;
                        }
                        function compile(bc) {
                            function compileCondition(u, e) {
                                var t, r, n, o, s = e + 3, i = bc[ip + s - 2], a = bc[ip + s - 1], c = stack.sp;
                                if (ip += s, t = compile(bc.slice(ip, ip + i)), n = stack.sp, ip += i, a > 0 && (stack.sp = c, r = compile(bc.slice(ip, ip + a)), o = stack.sp, ip += a, n !== o)) throw new Error("Branches of a condition must move the stack pointer in the same way.");
                                parts.push("if (" + u + ") {"), parts.push(indent2(t)), a > 0 && (parts.push("} else {"), parts.push(indent2(r))), parts.push("}");
                            }
                            function compileLoop(u) {
                                var e, t, r = 2, n = bc[ip + r - 1], o = stack.sp;
                                if (ip += r, e = compile(bc.slice(ip, ip + n)), t = stack.sp, ip += n, t !== o) throw new Error("Body of a loop can't move the stack pointer.");
                                parts.push("while (" + u + ") {"), parts.push(indent2(e)), parts.push("}");
                            }
                            function compileCall() {
                                var u = 4, e = bc[ip + u - 1], t = c(bc[ip + 1]) + "(" + arrays.map(bc.slice(ip + u, ip + u + e), function(u) {
                                    return stack.index(u);
                                }).join(", ") + ")";
                                stack.pop(bc[ip + 2]), parts.push(stack.push(t)), ip += u + e;
                            }
                            for(var ip = 0, end = bc.length, parts = [], value; ip < end;)switch(bc[ip]){
                                case op.PUSH:
                                    parts.push(stack.push(c(bc[ip + 1]))), ip += 2;
                                    break;
                                case op.PUSH_CURR_POS:
                                    parts.push(stack.push("peg$currPos")), ip++;
                                    break;
                                case op.PUSH_UNDEFINED:
                                    parts.push(stack.push("void 0")), ip++;
                                    break;
                                case op.PUSH_NULL:
                                    parts.push(stack.push("null")), ip++;
                                    break;
                                case op.PUSH_FAILED:
                                    parts.push(stack.push("peg$FAILED")), ip++;
                                    break;
                                case op.PUSH_EMPTY_ARRAY:
                                    parts.push(stack.push("[]")), ip++;
                                    break;
                                case op.POP:
                                    stack.pop(), ip++;
                                    break;
                                case op.POP_CURR_POS:
                                    parts.push("peg$currPos = " + stack.pop() + ";"), ip++;
                                    break;
                                case op.POP_N:
                                    stack.pop(bc[ip + 1]), ip += 2;
                                    break;
                                case op.NIP:
                                    value = stack.pop(), stack.pop(), parts.push(stack.push(value)), ip++;
                                    break;
                                case op.APPEND:
                                    value = stack.pop(), parts.push(stack.top() + ".push(" + value + ");"), ip++;
                                    break;
                                case op.WRAP:
                                    parts.push(stack.push("[" + stack.pop(bc[ip + 1]).join(", ") + "]")), ip += 2;
                                    break;
                                case op.TEXT:
                                    parts.push(stack.push("input.substring(" + stack.pop() + ", peg$currPos)")), ip++;
                                    break;
                                case op.IF:
                                    compileCondition(stack.top(), 0);
                                    break;
                                case op.IF_ERROR:
                                    compileCondition(stack.top() + " === peg$FAILED", 0);
                                    break;
                                case op.IF_NOT_ERROR:
                                    compileCondition(stack.top() + " !== peg$FAILED", 0);
                                    break;
                                case op.WHILE_NOT_ERROR:
                                    compileLoop(stack.top() + " !== peg$FAILED", 0);
                                    break;
                                case op.MATCH_ANY:
                                    compileCondition("input.length > peg$currPos", 0);
                                    break;
                                case op.MATCH_STRING:
                                    compileCondition(eval(ast.consts[bc[ip + 1]]).length > 1 ? "input.substr(peg$currPos, " + eval(ast.consts[bc[ip + 1]]).length + ") === " + c(bc[ip + 1]) : "input.charCodeAt(peg$currPos) === " + eval(ast.consts[bc[ip + 1]]).charCodeAt(0), 1);
                                    break;
                                case op.MATCH_STRING_IC:
                                    compileCondition("input.substr(peg$currPos, " + eval(ast.consts[bc[ip + 1]]).length + ").toLowerCase() === " + c(bc[ip + 1]), 1);
                                    break;
                                case op.MATCH_REGEXP:
                                    compileCondition(c(bc[ip + 1]) + ".test(input.charAt(peg$currPos))", 1);
                                    break;
                                case op.ACCEPT_N:
                                    parts.push(stack.push(bc[ip + 1] > 1 ? "input.substr(peg$currPos, " + bc[ip + 1] + ")" : "input.charAt(peg$currPos)")), parts.push(bc[ip + 1] > 1 ? "peg$currPos += " + bc[ip + 1] + ";" : "peg$currPos++;"), ip += 2;
                                    break;
                                case op.ACCEPT_STRING:
                                    parts.push(stack.push(c(bc[ip + 1]))), parts.push(eval(ast.consts[bc[ip + 1]]).length > 1 ? "peg$currPos += " + eval(ast.consts[bc[ip + 1]]).length + ";" : "peg$currPos++;"), ip += 2;
                                    break;
                                case op.FAIL:
                                    parts.push(stack.push("peg$FAILED")), parts.push("if (peg$silentFails === 0) { peg$fail(" + c(bc[ip + 1]) + "); }"), ip += 2;
                                    break;
                                case op.LOAD_SAVED_POS:
                                    parts.push("peg$savedPos = " + stack.index(bc[ip + 1]) + ";"), ip += 2;
                                    break;
                                case op.UPDATE_SAVED_POS:
                                    parts.push("peg$savedPos = peg$currPos;"), ip++;
                                    break;
                                case op.CALL:
                                    compileCall();
                                    break;
                                case op.RULE:
                                    parts.push(stack.push("peg$parse" + ast.rules[bc[ip + 1]].name + "()")), ip += 2;
                                    break;
                                case op.SILENT_FAILS_ON:
                                    parts.push("peg$silentFails++;"), ip++;
                                    break;
                                case op.SILENT_FAILS_OFF:
                                    parts.push("peg$silentFails--;"), ip++;
                                    break;
                                default:
                                    throw new Error("Invalid opcode: " + bc[ip] + ".");
                            }
                            return parts.join("\n");
                        }
                        var parts = [], code, stack = {
                            sp: -1,
                            maxSp: -1,
                            push: function(u) {
                                var e = s(++this.sp) + " = " + u + ";";
                                return this.sp > this.maxSp && (this.maxSp = this.sp), e;
                            },
                            pop: function(u) {
                                var e;
                                return void 0 === u ? s(this.sp--) : (e = arrays.map(arrays.range(this.sp - u + 1, this.sp + 1), s), this.sp -= u, e);
                            },
                            top: function() {
                                return s(this.sp);
                            },
                            index: function(u) {
                                return s(this.sp - u);
                            }
                        };
                        return code = compile(rule.bytecode), parts.push("function peg$parse" + rule.name + "() {"), options.trace ? parts.push([
                            "  var " + arrays.map(arrays.range(0, stack.maxSp + 1), s).join(", ") + ",",
                            "      startPos = peg$currPos;"
                        ].join("\n")) : parts.push("  var " + arrays.map(arrays.range(0, stack.maxSp + 1), s).join(", ") + ";"), parts.push(indent2(generateRuleHeader('"' + js.stringEscape(rule.name) + '"', asts.indexOfRule(ast, rule.name)))), parts.push(indent2(code)), parts.push(indent2(generateRuleFooter('"' + js.stringEscape(rule.name) + '"', s(0)))), parts.push("}"), parts.join("\n");
                    }
                    function generateToplevel() {
                        var u, e, t, r, n, o = [];
                        return o.push([
                            "function peg$subclass(child, parent) {",
                            "  function ctor() { this.constructor = child; }",
                            "  ctor.prototype = parent.prototype;",
                            "  child.prototype = new ctor();",
                            "}",
                            "",
                            "function peg$SyntaxError(message, expected, found, location) {",
                            "  this.message  = message;",
                            "  this.expected = expected;",
                            "  this.found    = found;",
                            "  this.location = location;",
                            '  this.name     = "SyntaxError";',
                            "",
                            '  if (typeof Error.captureStackTrace === "function") {',
                            "    Error.captureStackTrace(this, peg$SyntaxError);",
                            "  }",
                            "}",
                            "",
                            "peg$subclass(peg$SyntaxError, Error);",
                            "",
                            "peg$SyntaxError.buildMessage = function(expected, found) {",
                            "  var DESCRIBE_EXPECTATION_FNS = {",
                            "        literal: function(expectation) {",
                            '          return "\\"" + literalEscape(expectation.text) + "\\"";',
                            "        },",
                            "",
                            '        "class": function(expectation) {',
                            '          var escapedParts = "",',
                            "              i;",
                            "",
                            "          for (i = 0; i < expectation.parts.length; i++) {",
                            "            escapedParts += expectation.parts[i] instanceof Array",
                            '              ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1])',
                            "              : classEscape(expectation.parts[i]);",
                            "          }",
                            "",
                            '          return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";',
                            "        },",
                            "",
                            "        any: function(expectation) {",
                            '          return "any character";',
                            "        },",
                            "",
                            "        end: function(expectation) {",
                            '          return "end of input";',
                            "        },",
                            "",
                            "        other: function(expectation) {",
                            "          return expectation.description;",
                            "        }",
                            "      };",
                            "",
                            "  function hex(ch) {",
                            "    return ch.charCodeAt(0).toString(16).toUpperCase();",
                            "  }",
                            "",
                            "  function literalEscape(s) {",
                            "    return s",
                            "      .replace(/\\\\/g, '\\\\\\\\')",
                            "      .replace(/\"/g,  '\\\\\"')",
                            "      .replace(/\\0/g, '\\\\0')",
                            "      .replace(/\\t/g, '\\\\t')",
                            "      .replace(/\\n/g, '\\\\n')",
                            "      .replace(/\\r/g, '\\\\r')",
                            "      .replace(/[\\x00-\\x0F]/g,          function(ch) { return '\\\\x0' + hex(ch); })",
                            "      .replace(/[\\x10-\\x1F\\x7F-\\x9F]/g, function(ch) { return '\\\\x'  + hex(ch); });",
                            "  }",
                            "",
                            "  function classEscape(s) {",
                            "    return s",
                            "      .replace(/\\\\/g, '\\\\\\\\')",
                            "      .replace(/\\]/g, '\\\\]')",
                            "      .replace(/\\^/g, '\\\\^')",
                            "      .replace(/-/g,  '\\\\-')",
                            "      .replace(/\\0/g, '\\\\0')",
                            "      .replace(/\\t/g, '\\\\t')",
                            "      .replace(/\\n/g, '\\\\n')",
                            "      .replace(/\\r/g, '\\\\r')",
                            "      .replace(/[\\x00-\\x0F]/g,          function(ch) { return '\\\\x0' + hex(ch); })",
                            "      .replace(/[\\x10-\\x1F\\x7F-\\x9F]/g, function(ch) { return '\\\\x'  + hex(ch); });",
                            "  }",
                            "",
                            "  function describeExpectation(expectation) {",
                            "    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);",
                            "  }",
                            "",
                            "  function describeExpected(expected) {",
                            "    var descriptions = new Array(expected.length),",
                            "        i, j;",
                            "",
                            "    for (i = 0; i < expected.length; i++) {",
                            "      descriptions[i] = describeExpectation(expected[i]);",
                            "    }",
                            "",
                            "    descriptions.sort();",
                            "",
                            "    if (descriptions.length > 0) {",
                            "      for (i = 1, j = 1; i < descriptions.length; i++) {",
                            "        if (descriptions[i - 1] !== descriptions[i]) {",
                            "          descriptions[j] = descriptions[i];",
                            "          j++;",
                            "        }",
                            "      }",
                            "      descriptions.length = j;",
                            "    }",
                            "",
                            "    switch (descriptions.length) {",
                            "      case 1:",
                            "        return descriptions[0];",
                            "",
                            "      case 2:",
                            '        return descriptions[0] + " or " + descriptions[1];',
                            "",
                            "      default:",
                            '        return descriptions.slice(0, -1).join(", ")',
                            '          + ", or "',
                            "          + descriptions[descriptions.length - 1];",
                            "    }",
                            "  }",
                            "",
                            "  function describeFound(found) {",
                            '    return found ? "\\"" + literalEscape(found) + "\\"" : "end of input";',
                            "  }",
                            "",
                            '  return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";',
                            "};",
                            ""
                        ].join("\n")), options.trace && o.push([
                            "function peg$DefaultTracer() {",
                            "  this.indentLevel = 0;",
                            "}",
                            "",
                            "peg$DefaultTracer.prototype.trace = function(event) {",
                            "  var that = this;",
                            "",
                            "  function log(event) {",
                            "    function repeat(string, n) {",
                            '       var result = "", i;',
                            "",
                            "       for (i = 0; i < n; i++) {",
                            "         result += string;",
                            "       }",
                            "",
                            "       return result;",
                            "    }",
                            "",
                            "    function pad(string, length) {",
                            '      return string + repeat(" ", length - string.length);',
                            "    }",
                            "",
                            '    if (typeof console === "object") {',
                            "      console.log(",
                            '        event.location.start.line + ":" + event.location.start.column + "-"',
                            '          + event.location.end.line + ":" + event.location.end.column + " "',
                            '          + pad(event.type, 10) + " "',
                            '          + repeat("  ", that.indentLevel) + event.rule',
                            "      );",
                            "    }",
                            "  }",
                            "",
                            "  switch (event.type) {",
                            '    case "rule.enter":',
                            "      log(event);",
                            "      this.indentLevel++;",
                            "      break;",
                            "",
                            '    case "rule.match":',
                            "      this.indentLevel--;",
                            "      log(event);",
                            "      break;",
                            "",
                            '    case "rule.fail":',
                            "      this.indentLevel--;",
                            "      log(event);",
                            "      break;",
                            "",
                            "    default:",
                            '      throw new Error("Invalid event type: " + event.type + ".");',
                            "  }",
                            "};",
                            ""
                        ].join("\n")), o.push([
                            "function peg$parse(input, options) {",
                            "  options = options !== void 0 ? options : {};",
                            "",
                            "  var peg$FAILED = {},",
                            ""
                        ].join("\n")), "size" === options.optimize ? (u = "{ " + arrays.map(options.allowedStartRules, function(u) {
                            return u + ": " + asts.indexOfRule(ast, u);
                        }).join(", ") + " }", e = asts.indexOfRule(ast, options.allowedStartRules[0]), o.push([
                            "      peg$startRuleIndices = " + u + ",",
                            "      peg$startRuleIndex   = " + e + ","
                        ].join("\n"))) : (t = "{ " + arrays.map(options.allowedStartRules, function(u) {
                            return u + ": peg$parse" + u;
                        }).join(", ") + " }", r = "peg$parse" + options.allowedStartRules[0], o.push([
                            "      peg$startRuleFunctions = " + t + ",",
                            "      peg$startRuleFunction  = " + r + ","
                        ].join("\n"))), o.push(""), o.push(indent6(generateTables())), o.push([
                            "",
                            "      peg$currPos          = 0,",
                            "      peg$savedPos         = 0,",
                            "      peg$posDetailsCache  = [{ line: 1, column: 1 }],",
                            "      peg$maxFailPos       = 0,",
                            "      peg$maxFailExpected  = [],",
                            "      peg$silentFails      = 0,",
                            ""
                        ].join("\n")), options.cache && o.push([
                            "      peg$resultsCache = {},",
                            ""
                        ].join("\n")), options.trace && ("size" === options.optimize && (n = "[" + arrays.map(ast.rules, function(u) {
                            return '"' + js.stringEscape(u.name) + '"';
                        }).join(", ") + "]", o.push([
                            "      peg$ruleNames = " + n + ",",
                            ""
                        ].join("\n"))), o.push([
                            '      peg$tracer = "tracer" in options ? options.tracer : new peg$DefaultTracer(),',
                            ""
                        ].join("\n"))), o.push([
                            "      peg$result;",
                            ""
                        ].join("\n")), "size" === options.optimize ? o.push([
                            '  if ("startRule" in options) {',
                            "    if (!(options.startRule in peg$startRuleIndices)) {",
                            '      throw new Error("Can\'t start parsing from rule \\"" + options.startRule + "\\".");',
                            "    }",
                            "",
                            "    peg$startRuleIndex = peg$startRuleIndices[options.startRule];",
                            "  }"
                        ].join("\n")) : o.push([
                            '  if ("startRule" in options) {',
                            "    if (!(options.startRule in peg$startRuleFunctions)) {",
                            '      throw new Error("Can\'t start parsing from rule \\"" + options.startRule + "\\".");',
                            "    }",
                            "",
                            "    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];",
                            "  }"
                        ].join("\n")), o.push([
                            "",
                            "  function text() {",
                            "    return input.substring(peg$savedPos, peg$currPos);",
                            "  }",
                            "",
                            "  function location() {",
                            "    return peg$computeLocation(peg$savedPos, peg$currPos);",
                            "  }",
                            "",
                            "  function expected(description, location) {",
                            "    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)",
                            "",
                            "    throw peg$buildStructuredError(",
                            "      [peg$otherExpectation(description)],",
                            "      input.substring(peg$savedPos, peg$currPos),",
                            "      location",
                            "    );",
                            "  }",
                            "",
                            "  function error(message, location) {",
                            "    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)",
                            "",
                            "    throw peg$buildSimpleError(message, location);",
                            "  }",
                            "",
                            "  function peg$literalExpectation(text, ignoreCase) {",
                            '    return { type: "literal", text: text, ignoreCase: ignoreCase };',
                            "  }",
                            "",
                            "  function peg$classExpectation(parts, inverted, ignoreCase) {",
                            '    return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };',
                            "  }",
                            "",
                            "  function peg$anyExpectation() {",
                            '    return { type: "any" };',
                            "  }",
                            "",
                            "  function peg$endExpectation() {",
                            '    return { type: "end" };',
                            "  }",
                            "",
                            "  function peg$otherExpectation(description) {",
                            '    return { type: "other", description: description };',
                            "  }",
                            "",
                            "  function peg$computePosDetails(pos) {",
                            "    var details = peg$posDetailsCache[pos], p;",
                            "",
                            "    if (details) {",
                            "      return details;",
                            "    } else {",
                            "      p = pos - 1;",
                            "      while (!peg$posDetailsCache[p]) {",
                            "        p--;",
                            "      }",
                            "",
                            "      details = peg$posDetailsCache[p];",
                            "      details = {",
                            "        line:   details.line,",
                            "        column: details.column",
                            "      };",
                            "",
                            "      while (p < pos) {",
                            "        if (input.charCodeAt(p) === 10) {",
                            "          details.line++;",
                            "          details.column = 1;",
                            "        } else {",
                            "          details.column++;",
                            "        }",
                            "",
                            "        p++;",
                            "      }",
                            "",
                            "      peg$posDetailsCache[pos] = details;",
                            "      return details;",
                            "    }",
                            "  }",
                            "",
                            "  function peg$computeLocation(startPos, endPos) {",
                            "    var startPosDetails = peg$computePosDetails(startPos),",
                            "        endPosDetails   = peg$computePosDetails(endPos);",
                            "",
                            "    return {",
                            "      start: {",
                            "        offset: startPos,",
                            "        line:   startPosDetails.line,",
                            "        column: startPosDetails.column",
                            "      },",
                            "      end: {",
                            "        offset: endPos,",
                            "        line:   endPosDetails.line,",
                            "        column: endPosDetails.column",
                            "      }",
                            "    };",
                            "  }",
                            "",
                            "  function peg$fail(expected) {",
                            "    if (peg$currPos < peg$maxFailPos) { return; }",
                            "",
                            "    if (peg$currPos > peg$maxFailPos) {",
                            "      peg$maxFailPos = peg$currPos;",
                            "      peg$maxFailExpected = [];",
                            "    }",
                            "",
                            "    peg$maxFailExpected.push(expected);",
                            "  }",
                            "",
                            "  function peg$buildSimpleError(message, location) {",
                            "    return new peg$SyntaxError(message, null, null, location);",
                            "  }",
                            "",
                            "  function peg$buildStructuredError(expected, found, location) {",
                            "    return new peg$SyntaxError(",
                            "      peg$SyntaxError.buildMessage(expected, found),",
                            "      expected,",
                            "      found,",
                            "      location",
                            "    );",
                            "  }",
                            ""
                        ].join("\n")), "size" === options.optimize ? (o.push(indent2(generateInterpreter())), o.push("")) : arrays.each(ast.rules, function(u) {
                            o.push(indent2(generateRuleFunction(u))), o.push("");
                        }), ast.initializer && (o.push(indent2(ast.initializer.code)), o.push("")), "size" === options.optimize ? o.push("  peg$result = peg$parseRule(peg$startRuleIndex);") : o.push("  peg$result = peg$startRuleFunction();"), o.push([
                            "",
                            "  if (peg$result !== peg$FAILED && peg$currPos === input.length) {",
                            "    return peg$result;",
                            "  } else {",
                            "    if (peg$result !== peg$FAILED && peg$currPos < input.length) {",
                            "      peg$fail(peg$endExpectation());",
                            "    }",
                            "",
                            "    throw peg$buildStructuredError(",
                            "      peg$maxFailExpected,",
                            "      peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,",
                            "      peg$maxFailPos < input.length",
                            "        ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)",
                            "        : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)",
                            "    );",
                            "  }",
                            "}"
                        ].join("\n")), o.join("\n");
                    }
                    function generateWrapper(u) {
                        function e() {
                            return [
                                "/*",
                                " * Generated by PEG.js 0.10.0.",
                                " *",
                                " * http://pegjs.org/",
                                " */"
                            ].join("\n");
                        }
                        function t() {
                            return options.trace ? [
                                "{",
                                "  SyntaxError:   peg$SyntaxError,",
                                "  DefaultTracer: peg$DefaultTracer,",
                                "  parse:         peg$parse",
                                "}"
                            ].join("\n") : [
                                "{",
                                "  SyntaxError: peg$SyntaxError,",
                                "  parse:       peg$parse",
                                "}"
                            ].join("\n");
                        }
                        var r = {
                            bare: function() {
                                return [
                                    e(),
                                    "(function() {",
                                    '  "use strict";',
                                    "",
                                    indent2(u),
                                    "",
                                    indent2("return " + t() + ";"),
                                    "})()"
                                ].join("\n");
                            },
                            commonjs: function() {
                                var r = [], n = objects.keys(options.dependencies), o = arrays.map(n, function(u) {
                                    return u + ' = require("' + js.stringEscape(options.dependencies[u]) + '")';
                                });
                                return r.push([
                                    e(),
                                    "",
                                    '"use strict";',
                                    ""
                                ].join("\n")), o.length > 0 && (r.push("var " + o.join(", ") + ";"), r.push("")), r.push([
                                    u,
                                    "",
                                    "module.exports = " + t() + ";",
                                    ""
                                ].join("\n")), r.join("\n");
                            },
                            amd: function() {
                                var r = objects.values(options.dependencies), n = objects.keys(options.dependencies), o = "[" + arrays.map(r, function(u) {
                                    return '"' + js.stringEscape(u) + '"';
                                }).join(", ") + "]", s = n.join(", ");
                                return [
                                    e(),
                                    "define(" + o + ", function(" + s + ") {",
                                    '  "use strict";',
                                    "",
                                    indent2(u),
                                    "",
                                    indent2("return " + t() + ";"),
                                    "});",
                                    ""
                                ].join("\n");
                            },
                            globals: function() {
                                return [
                                    e(),
                                    "(function(root) {",
                                    '  "use strict";',
                                    "",
                                    indent2(u),
                                    "",
                                    indent2("root." + options.exportVar + " = " + t() + ";"),
                                    "})(this);",
                                    ""
                                ].join("\n");
                            },
                            umd: function() {
                                var r = [], n = objects.values(options.dependencies), o = objects.keys(options.dependencies), s = "[" + arrays.map(n, function(u) {
                                    return '"' + js.stringEscape(u) + '"';
                                }).join(", ") + "]", i = arrays.map(n, function(u) {
                                    return 'require("' + js.stringEscape(u) + '")';
                                }).join(", "), a = o.join(", ");
                                return r.push([
                                    e(),
                                    "(function(root, factory) {",
                                    '  if (typeof define === "function" && define.amd) {',
                                    "    define(" + s + ", factory);",
                                    '  } else if (typeof module === "object" && module.exports) {',
                                    "    module.exports = factory(" + i + ");"
                                ].join("\n")), null !== options.exportVar && r.push([
                                    "  } else {",
                                    "    root." + options.exportVar + " = factory();"
                                ].join("\n")), r.push([
                                    "  }",
                                    "})(this, function(" + a + ") {",
                                    '  "use strict";',
                                    "",
                                    indent2(u),
                                    "",
                                    indent2("return " + t() + ";"),
                                    "});",
                                    ""
                                ].join("\n")), r.join("\n");
                            }
                        };
                        return r[options.format]();
                    }
                    ast.code = generateWrapper(generateToplevel());
                }
                var arrays = require("../../utils/arrays"), objects = require("../../utils/objects"), asts = require("../asts"), op = require("../opcodes"), js = require("../js");
                module.exports = generateJS;
            },
            {
                "../../utils/arrays": 17,
                "../../utils/objects": 19,
                "../asts": 1,
                "../js": 3,
                "../opcodes": 4
            }
        ],
        7: [
            function(u, e, t) {
                "use strict";
                function r(u, e) {
                    function t(u) {
                        return "rule" === u.type && "rule_ref" === u.expression.type;
                    }
                    function r(u, e, t) {
                        var r = o.build({
                            rule_ref: function(u) {
                                u.name === e && (u.name = t);
                            }
                        });
                        r(u);
                    }
                    var s = [];
                    n.each(u.rules, function(o, i) {
                        t(o) && (r(u, o.name, o.expression.name), n.contains(e.allowedStartRules, o.name) || s.push(i));
                    }), s.reverse(), n.each(s, function(e) {
                        u.rules.splice(e, 1);
                    });
                }
                var n = u("../../utils/arrays"), o = u("../visitor");
                e.exports = r;
            },
            {
                "../../utils/arrays": 17,
                "../visitor": 13
            }
        ],
        8: [
            function(u, e, t) {
                "use strict";
                function r(u) {
                    function e(u, e) {
                        t(u.expression, s.clone(e));
                    }
                    var t = i.build({
                        rule: function(u) {
                            t(u.expression, {});
                        },
                        choice: function(u, e) {
                            o.each(u.alternatives, function(u) {
                                t(u, s.clone(e));
                            });
                        },
                        action: e,
                        labeled: function(u, e) {
                            if (e.hasOwnProperty(u.label)) throw new n('Label "' + u.label + '" is already defined at line ' + e[u.label].start.line + ", column " + e[u.label].start.column + ".", u.location);
                            t(u.expression, e), e[u.label] = u.location;
                        },
                        text: e,
                        simple_and: e,
                        simple_not: e,
                        optional: e,
                        zero_or_more: e,
                        one_or_more: e,
                        group: e
                    });
                    t(u);
                }
                var n = u("../../grammar-error"), o = u("../../utils/arrays"), s = u("../../utils/objects"), i = u("../visitor");
                e.exports = r;
            },
            {
                "../../grammar-error": 14,
                "../../utils/arrays": 17,
                "../../utils/objects": 19,
                "../visitor": 13
            }
        ],
        9: [
            function(u, e, t) {
                "use strict";
                function r(u) {
                    var e = {}, t = o.build({
                        rule: function(u) {
                            if (e.hasOwnProperty(u.name)) throw new n('Rule "' + u.name + '" is already defined at line ' + e[u.name].start.line + ", column " + e[u.name].start.column + ".", u.location);
                            e[u.name] = u.location;
                        }
                    });
                    t(u);
                }
                var n = u("../../grammar-error"), o = u("../visitor");
                e.exports = r;
            },
            {
                "../../grammar-error": 14,
                "../visitor": 13
            }
        ],
        10: [
            function(u, e, t) {
                "use strict";
                function r(u) {
                    var e = [], t = i.build({
                        rule: function(u) {
                            e.push(u.name), t(u.expression), e.pop(u.name);
                        },
                        sequence: function(e) {
                            n.every(e.elements, function(e) {
                                return t(e), !s.alwaysConsumesOnSuccess(u, e);
                            });
                        },
                        rule_ref: function(r) {
                            if (n.contains(e, r.name)) throw e.push(r.name), new o("Possible infinite loop when parsing (left recursion: " + e.join(" -> ") + ").", r.location);
                            t(s.findRule(u, r.name));
                        }
                    });
                    t(u);
                }
                var n = u("../../utils/arrays"), o = u("../../grammar-error"), s = u("../asts"), i = u("../visitor");
                e.exports = r;
            },
            {
                "../../grammar-error": 14,
                "../../utils/arrays": 17,
                "../asts": 1,
                "../visitor": 13
            }
        ],
        11: [
            function(u, e, t) {
                "use strict";
                function r(u) {
                    var e = s.build({
                        zero_or_more: function(e) {
                            if (!o.alwaysConsumesOnSuccess(u, e.expression)) throw new n("Possible infinite loop when parsing (repetition used with an expression that may not consume any input).", e.location);
                        },
                        one_or_more: function(e) {
                            if (!o.alwaysConsumesOnSuccess(u, e.expression)) throw new n("Possible infinite loop when parsing (repetition used with an expression that may not consume any input).", e.location);
                        }
                    });
                    e(u);
                }
                var n = u("../../grammar-error"), o = u("../asts"), s = u("../visitor");
                e.exports = r;
            },
            {
                "../../grammar-error": 14,
                "../asts": 1,
                "../visitor": 13
            }
        ],
        12: [
            function(u, e, t) {
                "use strict";
                function r(u) {
                    var e = s.build({
                        rule_ref: function(e) {
                            if (!o.findRule(u, e.name)) throw new n('Rule "' + e.name + '" is not defined.', e.location);
                        }
                    });
                    e(u);
                }
                var n = u("../../grammar-error"), o = u("../asts"), s = u("../visitor");
                e.exports = r;
            },
            {
                "../../grammar-error": 14,
                "../asts": 1,
                "../visitor": 13
            }
        ],
        13: [
            function(u, e, t) {
                "use strict";
                var r = u("../utils/objects"), n = u("../utils/arrays"), o = {
                    build: function(u) {
                        function e(e) {
                            return u[e.type].apply(null, arguments);
                        }
                        function t() {}
                        function o(u) {
                            var t = Array.prototype.slice.call(arguments, 1);
                            e.apply(null, [
                                u.expression
                            ].concat(t));
                        }
                        function s(u) {
                            return function(t) {
                                var r = Array.prototype.slice.call(arguments, 1);
                                n.each(t[u], function(u) {
                                    e.apply(null, [
                                        u
                                    ].concat(r));
                                });
                            };
                        }
                        var i = {
                            grammar: function(u) {
                                var t = Array.prototype.slice.call(arguments, 1);
                                u.initializer && e.apply(null, [
                                    u.initializer
                                ].concat(t)), n.each(u.rules, function(u) {
                                    e.apply(null, [
                                        u
                                    ].concat(t));
                                });
                            },
                            initializer: t,
                            rule: o,
                            named: o,
                            choice: s("alternatives"),
                            action: o,
                            sequence: s("elements"),
                            labeled: o,
                            text: o,
                            simple_and: o,
                            simple_not: o,
                            optional: o,
                            zero_or_more: o,
                            one_or_more: o,
                            group: o,
                            semantic_and: t,
                            semantic_not: t,
                            rule_ref: t,
                            literal: t,
                            class: t,
                            any: t
                        };
                        return r.defaults(u, i), e;
                    }
                };
                e.exports = o;
            },
            {
                "../utils/arrays": 17,
                "../utils/objects": 19
            }
        ],
        14: [
            function(u, e, t) {
                "use strict";
                function r(u, e) {
                    this.name = "GrammarError", this.message = u, this.location = e, "function" == typeof Error.captureStackTrace && Error.captureStackTrace(this, r);
                }
                var n = u("./utils/classes");
                n.subclass(r, Error), e.exports = r;
            },
            {
                "./utils/classes": 18
            }
        ],
        15: [
            function(u, e, t) {
                "use strict";
                function r(u, e) {
                    function t() {
                        this.constructor = u;
                    }
                    t.prototype = e.prototype, u.prototype = new t;
                }
                function n(u, e, t, r) {
                    this.message = u, this.expected = e, this.found = t, this.location = r, this.name = "SyntaxError", "function" == typeof Error.captureStackTrace && Error.captureStackTrace(this, n);
                }
                function o(u, e) {
                    function t() {
                        return u.substring(Yo, Vo);
                    }
                    function r() {
                        return l(Yo, Vo);
                    }
                    function o(u, e) {
                        throw e = void 0 !== e ? e : l(Yo, Vo), C(u, e);
                    }
                    function s(u, e) {
                        return {
                            type: "literal",
                            text: u,
                            ignoreCase: e
                        };
                    }
                    function i(u, e, t) {
                        return {
                            type: "class",
                            parts: u,
                            inverted: e,
                            ignoreCase: t
                        };
                    }
                    function a() {
                        return {
                            type: "any"
                        };
                    }
                    function c() {
                        return {
                            type: "end"
                        };
                    }
                    function p(u) {
                        return {
                            type: "other",
                            description: u
                        };
                    }
                    function A(e) {
                        var t, r = Wo[e];
                        if (r) return r;
                        for(t = e - 1; !Wo[t];)t--;
                        for(r = Wo[t], r = {
                            line: r.line,
                            column: r.column
                        }; t < e;)10 === u.charCodeAt(t) ? (r.line++, r.column = 1) : r.column++, t++;
                        return Wo[e] = r, r;
                    }
                    function l(u, e) {
                        var t = A(u), r = A(e);
                        return {
                            start: {
                                offset: u,
                                line: t.line,
                                column: t.column
                            },
                            end: {
                                offset: e,
                                line: r.line,
                                column: r.column
                            }
                        };
                    }
                    function E(u) {
                        Vo < Xo || (Vo > Xo && (Xo = Vo, Jo = []), Jo.push(u));
                    }
                    function C(u, e) {
                        return new n(u, null, null, e);
                    }
                    function f(u, e, t) {
                        return new n(n.buildMessage(u, e), u, e, t);
                    }
                    function F() {
                        var u, e, t, r, n, o, s;
                        if (u = Vo, e = ae(), e !== de) {
                            if (t = Vo, r = d(), r !== de ? (n = ae(), n !== de ? (r = [
                                r,
                                n
                            ], t = r) : (Vo = t, t = de)) : (Vo = t, t = de), t === de && (t = null), t !== de) {
                                if (r = [], n = Vo, o = h(), o !== de ? (s = ae(), s !== de ? (o = [
                                    o,
                                    s
                                ], n = o) : (Vo = n, n = de)) : (Vo = n, n = de), n !== de) for(; n !== de;)r.push(n), n = Vo, o = h(), o !== de ? (s = ae(), s !== de ? (o = [
                                    o,
                                    s
                                ], n = o) : (Vo = n, n = de)) : (Vo = n, n = de);
                                else r = de;
                                r !== de ? (Yo = u, e = De(t, r), u = e) : (Vo = u, u = de);
                            } else Vo = u, u = de;
                        } else Vo = u, u = de;
                        return u;
                    }
                    function d() {
                        var u, e, t;
                        return u = Vo, e = Eu(), e !== de ? (t = pe(), t !== de ? (Yo = u, e = Be(e), u = e) : (Vo = u, u = de)) : (Vo = u, u = de), u;
                    }
                    function h() {
                        var e, t, r, n, o, s, i, a;
                        return e = Vo, t = U(), t !== de ? (r = ae(), r !== de ? (n = Vo, o = J(), o !== de ? (s = ae(), s !== de ? (o = [
                            o,
                            s
                        ], n = o) : (Vo = n, n = de)) : (Vo = n, n = de), n === de && (n = null), n !== de ? (61 === u.charCodeAt(Vo) ? (o = ve, Vo++) : (o = de, 0 === Zo && E(me)), o !== de ? (s = ae(), s !== de ? (i = g(), i !== de ? (a = pe(), a !== de ? (Yo = e, t = be(t, n, i), e = t) : (Vo = e, e = de)) : (Vo = e, e = de)) : (Vo = e, e = de)) : (Vo = e, e = de)) : (Vo = e, e = de)) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function g() {
                        var e, t, r, n, o, s, i, a;
                        if (e = Vo, t = D(), t !== de) {
                            for(r = [], n = Vo, o = ae(), o !== de ? (47 === u.charCodeAt(Vo) ? (s = xe, Vo++) : (s = de, 0 === Zo && E(Pe)), s !== de ? (i = ae(), i !== de ? (a = D(), a !== de ? (o = [
                                o,
                                s,
                                i,
                                a
                            ], n = o) : (Vo = n, n = de)) : (Vo = n, n = de)) : (Vo = n, n = de)) : (Vo = n, n = de); n !== de;)r.push(n), n = Vo, o = ae(), o !== de ? (47 === u.charCodeAt(Vo) ? (s = xe, Vo++) : (s = de, 0 === Zo && E(Pe)), s !== de ? (i = ae(), i !== de ? (a = D(), a !== de ? (o = [
                                o,
                                s,
                                i,
                                a
                            ], n = o) : (Vo = n, n = de)) : (Vo = n, n = de)) : (Vo = n, n = de)) : (Vo = n, n = de);
                            r !== de ? (Yo = e, t = _e(t, r), e = t) : (Vo = e, e = de);
                        } else Vo = e, e = de;
                        return e;
                    }
                    function D() {
                        var u, e, t, r, n;
                        return u = Vo, e = B(), e !== de ? (t = Vo, r = ae(), r !== de ? (n = Eu(), n !== de ? (r = [
                            r,
                            n
                        ], t = r) : (Vo = t, t = de)) : (Vo = t, t = de), t === de && (t = null), t !== de ? (Yo = u, e = ye(e, t), u = e) : (Vo = u, u = de)) : (Vo = u, u = de), u;
                    }
                    function B() {
                        var u, e, t, r, n, o;
                        if (u = Vo, e = v(), e !== de) {
                            for(t = [], r = Vo, n = ae(), n !== de ? (o = v(), o !== de ? (n = [
                                n,
                                o
                            ], r = n) : (Vo = r, r = de)) : (Vo = r, r = de); r !== de;)t.push(r), r = Vo, n = ae(), n !== de ? (o = v(), o !== de ? (n = [
                                n,
                                o
                            ], r = n) : (Vo = r, r = de)) : (Vo = r, r = de);
                            t !== de ? (Yo = u, e = $e(e, t), u = e) : (Vo = u, u = de);
                        } else Vo = u, u = de;
                        return u;
                    }
                    function v() {
                        var e, t, r, n, o, s;
                        return e = Vo, t = N(), t !== de ? (r = ae(), r !== de ? (58 === u.charCodeAt(Vo) ? (n = Re, Vo++) : (n = de, 0 === Zo && E(ke)), n !== de ? (o = ae(), o !== de ? (s = m(), s !== de ? (Yo = e, t = Se(t, s), e = t) : (Vo = e, e = de)) : (Vo = e, e = de)) : (Vo = e, e = de)) : (Vo = e, e = de)) : (Vo = e, e = de), e === de && (e = m()), e;
                    }
                    function m() {
                        var u, e, t, r;
                        return u = Vo, e = b(), e !== de ? (t = ae(), t !== de ? (r = x(), r !== de ? (Yo = u, e = Ie(e, r), u = e) : (Vo = u, u = de)) : (Vo = u, u = de)) : (Vo = u, u = de), u === de && (u = x()), u;
                    }
                    function b() {
                        var e;
                        return 36 === u.charCodeAt(Vo) ? (e = Oe, Vo++) : (e = de, 0 === Zo && E(je)), e === de && (38 === u.charCodeAt(Vo) ? (e = Le, Vo++) : (e = de, 0 === Zo && E(we)), e === de && (33 === u.charCodeAt(Vo) ? (e = Te, Vo++) : (e = de, 0 === Zo && E(Ne)))), e;
                    }
                    function x() {
                        var u, e, t, r;
                        return u = Vo, e = _(), e !== de ? (t = ae(), t !== de ? (r = P(), r !== de ? (Yo = u, e = Ue(e, r), u = e) : (Vo = u, u = de)) : (Vo = u, u = de)) : (Vo = u, u = de), u === de && (u = _()), u;
                    }
                    function P() {
                        var e;
                        return 63 === u.charCodeAt(Vo) ? (e = He, Vo++) : (e = de, 0 === Zo && E(qe)), e === de && (42 === u.charCodeAt(Vo) ? (e = ze, Vo++) : (e = de, 0 === Zo && E(Me)), e === de && (43 === u.charCodeAt(Vo) ? (e = Ge, Vo++) : (e = de, 0 === Zo && E(Ve)))), e;
                    }
                    function _() {
                        var e, t, r, n, o, s;
                        return e = X(), e === de && (e = Q(), e === de && (e = lu(), e === de && (e = y(), e === de && (e = $(), e === de && (e = Vo, 40 === u.charCodeAt(Vo) ? (t = Ye, Vo++) : (t = de, 0 === Zo && E(We)), t !== de ? (r = ae(), r !== de ? (n = g(), n !== de ? (o = ae(), o !== de ? (41 === u.charCodeAt(Vo) ? (s = Xe, Vo++) : (s = de, 0 === Zo && E(Je)), s !== de ? (Yo = e, t = Ze(n), e = t) : (Vo = e, e = de)) : (Vo = e, e = de)) : (Vo = e, e = de)) : (Vo = e, e = de)) : (Vo = e, e = de)))))), e;
                    }
                    function y() {
                        var e, t, r, n, o, s, i, a;
                        return e = Vo, t = U(), t !== de ? (r = Vo, Zo++, n = Vo, o = ae(), o !== de ? (s = Vo, i = J(), i !== de ? (a = ae(), a !== de ? (i = [
                            i,
                            a
                        ], s = i) : (Vo = s, s = de)) : (Vo = s, s = de), s === de && (s = null), s !== de ? (61 === u.charCodeAt(Vo) ? (i = ve, Vo++) : (i = de, 0 === Zo && E(me)), i !== de ? (o = [
                            o,
                            s,
                            i
                        ], n = o) : (Vo = n, n = de)) : (Vo = n, n = de)) : (Vo = n, n = de), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (Yo = e, t = Ke(t), e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function $() {
                        var u, e, t, r;
                        return u = Vo, e = R(), e !== de ? (t = ae(), t !== de ? (r = Eu(), r !== de ? (Yo = u, e = Qe(e, r), u = e) : (Vo = u, u = de)) : (Vo = u, u = de)) : (Vo = u, u = de), u;
                    }
                    function R() {
                        var e;
                        return 38 === u.charCodeAt(Vo) ? (e = Le, Vo++) : (e = de, 0 === Zo && E(we)), e === de && (33 === u.charCodeAt(Vo) ? (e = Te, Vo++) : (e = de, 0 === Zo && E(Ne))), e;
                    }
                    function k() {
                        var e;
                        return u.length > Vo ? (e = u.charAt(Vo), Vo++) : (e = de, 0 === Zo && E(ut)), e;
                    }
                    function S() {
                        var e, t;
                        return Zo++, 9 === u.charCodeAt(Vo) ? (e = tt, Vo++) : (e = de, 0 === Zo && E(rt)), e === de && (11 === u.charCodeAt(Vo) ? (e = nt, Vo++) : (e = de, 0 === Zo && E(ot)), e === de && (12 === u.charCodeAt(Vo) ? (e = st, Vo++) : (e = de, 0 === Zo && E(it)), e === de && (32 === u.charCodeAt(Vo) ? (e = at, Vo++) : (e = de, 0 === Zo && E(ct)), e === de && (160 === u.charCodeAt(Vo) ? (e = pt, Vo++) : (e = de, 0 === Zo && E(At)), e === de && (65279 === u.charCodeAt(Vo) ? (e = lt, Vo++) : (e = de, 0 === Zo && E(Et)), e === de && (e = xu())))))), Zo--, e === de && (t = de, 0 === Zo && E(et)), e;
                    }
                    function I() {
                        var e;
                        return Ct.test(u.charAt(Vo)) ? (e = u.charAt(Vo), Vo++) : (e = de, 0 === Zo && E(ft)), e;
                    }
                    function O() {
                        var e, t;
                        return Zo++, 10 === u.charCodeAt(Vo) ? (e = dt, Vo++) : (e = de, 0 === Zo && E(ht)), e === de && (u.substr(Vo, 2) === gt ? (e = gt, Vo += 2) : (e = de, 0 === Zo && E(Dt)), e === de && (13 === u.charCodeAt(Vo) ? (e = Bt, Vo++) : (e = de, 0 === Zo && E(vt)), e === de && (8232 === u.charCodeAt(Vo) ? (e = mt, Vo++) : (e = de, 0 === Zo && E(bt)), e === de && (8233 === u.charCodeAt(Vo) ? (e = xt, Vo++) : (e = de, 0 === Zo && E(Pt)))))), Zo--, e === de && (t = de, 0 === Zo && E(Ft)), e;
                    }
                    function j() {
                        var u, e;
                        return Zo++, u = L(), u === de && (u = T()), Zo--, u === de && (e = de, 0 === Zo && E(_t)), u;
                    }
                    function L() {
                        var e, t, r, n, o, s;
                        if (e = Vo, u.substr(Vo, 2) === yt ? (t = yt, Vo += 2) : (t = de, 0 === Zo && E($t)), t !== de) {
                            for(r = [], n = Vo, o = Vo, Zo++, u.substr(Vo, 2) === Rt ? (s = Rt, Vo += 2) : (s = de, 0 === Zo && E(kt)), Zo--, s === de ? o = void 0 : (Vo = o, o = de), o !== de ? (s = k(), s !== de ? (o = [
                                o,
                                s
                            ], n = o) : (Vo = n, n = de)) : (Vo = n, n = de); n !== de;)r.push(n), n = Vo, o = Vo, Zo++, u.substr(Vo, 2) === Rt ? (s = Rt, Vo += 2) : (s = de, 0 === Zo && E(kt)), Zo--, s === de ? o = void 0 : (Vo = o, o = de), o !== de ? (s = k(), s !== de ? (o = [
                                o,
                                s
                            ], n = o) : (Vo = n, n = de)) : (Vo = n, n = de);
                            r !== de ? (u.substr(Vo, 2) === Rt ? (n = Rt, Vo += 2) : (n = de, 0 === Zo && E(kt)), n !== de ? (t = [
                                t,
                                r,
                                n
                            ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de);
                        } else Vo = e, e = de;
                        return e;
                    }
                    function w() {
                        var e, t, r, n, o, s;
                        if (e = Vo, u.substr(Vo, 2) === yt ? (t = yt, Vo += 2) : (t = de, 0 === Zo && E($t)), t !== de) {
                            for(r = [], n = Vo, o = Vo, Zo++, u.substr(Vo, 2) === Rt ? (s = Rt, Vo += 2) : (s = de, 0 === Zo && E(kt)), s === de && (s = I()), Zo--, s === de ? o = void 0 : (Vo = o, o = de), o !== de ? (s = k(), s !== de ? (o = [
                                o,
                                s
                            ], n = o) : (Vo = n, n = de)) : (Vo = n, n = de); n !== de;)r.push(n), n = Vo, o = Vo, Zo++, u.substr(Vo, 2) === Rt ? (s = Rt, Vo += 2) : (s = de, 0 === Zo && E(kt)), s === de && (s = I()), Zo--, s === de ? o = void 0 : (Vo = o, o = de), o !== de ? (s = k(), s !== de ? (o = [
                                o,
                                s
                            ], n = o) : (Vo = n, n = de)) : (Vo = n, n = de);
                            r !== de ? (u.substr(Vo, 2) === Rt ? (n = Rt, Vo += 2) : (n = de, 0 === Zo && E(kt)), n !== de ? (t = [
                                t,
                                r,
                                n
                            ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de);
                        } else Vo = e, e = de;
                        return e;
                    }
                    function T() {
                        var e, t, r, n, o, s;
                        if (e = Vo, u.substr(Vo, 2) === St ? (t = St, Vo += 2) : (t = de, 0 === Zo && E(It)), t !== de) {
                            for(r = [], n = Vo, o = Vo, Zo++, s = I(), Zo--, s === de ? o = void 0 : (Vo = o, o = de), o !== de ? (s = k(), s !== de ? (o = [
                                o,
                                s
                            ], n = o) : (Vo = n, n = de)) : (Vo = n, n = de); n !== de;)r.push(n), n = Vo, o = Vo, Zo++, s = I(), Zo--, s === de ? o = void 0 : (Vo = o, o = de), o !== de ? (s = k(), s !== de ? (o = [
                                o,
                                s
                            ], n = o) : (Vo = n, n = de)) : (Vo = n, n = de);
                            r !== de ? (t = [
                                t,
                                r
                            ], e = t) : (Vo = e, e = de);
                        } else Vo = e, e = de;
                        return e;
                    }
                    function N() {
                        var u, e, t;
                        return u = Vo, e = Vo, Zo++, t = G(), Zo--, t === de ? e = void 0 : (Vo = e, e = de), e !== de ? (t = U(), t !== de ? (Yo = u, e = Ot(t), u = e) : (Vo = u, u = de)) : (Vo = u, u = de), u;
                    }
                    function U() {
                        var u, e, t, r;
                        if (Zo++, u = Vo, e = H(), e !== de) {
                            for(t = [], r = q(); r !== de;)t.push(r), r = q();
                            t !== de ? (Yo = u, e = Lt(e, t), u = e) : (Vo = u, u = de);
                        } else Vo = u, u = de;
                        return Zo--, u === de && (e = de, 0 === Zo && E(jt)), u;
                    }
                    function H() {
                        var e, t, r;
                        return e = z(), e === de && (36 === u.charCodeAt(Vo) ? (e = Oe, Vo++) : (e = de, 0 === Zo && E(je)), e === de && (95 === u.charCodeAt(Vo) ? (e = wt, Vo++) : (e = de, 0 === Zo && E(Tt)), e === de && (e = Vo, 92 === u.charCodeAt(Vo) ? (t = Nt, Vo++) : (t = de, 0 === Zo && E(Ut)), t !== de ? (r = cu(), r !== de ? (Yo = e, t = Ht(r), e = t) : (Vo = e, e = de)) : (Vo = e, e = de)))), e;
                    }
                    function q() {
                        var e;
                        return e = H(), e === de && (e = M(), e === de && (e = vu(), e === de && (e = bu(), e === de && (8204 === u.charCodeAt(Vo) ? (e = qt, Vo++) : (e = de, 0 === Zo && E(zt)), e === de && (8205 === u.charCodeAt(Vo) ? (e = Mt, Vo++) : (e = de, 0 === Zo && E(Gt))))))), e;
                    }
                    function z() {
                        var u;
                        return u = gu(), u === de && (u = fu(), u === de && (u = hu(), u === de && (u = Fu(), u === de && (u = du(), u === de && (u = mu()))))), u;
                    }
                    function M() {
                        var u;
                        return u = Bu(), u === de && (u = Du()), u;
                    }
                    function G() {
                        var u;
                        return u = V(), u === de && (u = Y(), u === de && (u = Xu(), u === de && (u = W()))), u;
                    }
                    function V() {
                        var u;
                        return u = Pu(), u === de && (u = _u(), u === de && (u = yu(), u === de && (u = ku(), u === de && (u = Su(), u === de && (u = Iu(), u === de && (u = Ou(), u === de && (u = ju(), u === de && (u = Lu(), u === de && (u = Hu(), u === de && (u = qu(), u === de && (u = zu(), u === de && (u = Mu(), u === de && (u = Vu(), u === de && (u = Yu(), u === de && (u = Wu(), u === de && (u = Ju(), u === de && (u = Ku(), u === de && (u = Qu(), u === de && (u = ue(), u === de && (u = te(), u === de && (u = re(), u === de && (u = ne(), u === de && (u = oe(), u === de && (u = se(), u === de && (u = ie()))))))))))))))))))))))))), u;
                    }
                    function Y() {
                        var u;
                        return u = $u(), u === de && (u = Ru(), u === de && (u = wu(), u === de && (u = Tu(), u === de && (u = Nu(), u === de && (u = Gu(), u === de && (u = Zu())))))), u;
                    }
                    function W() {
                        var u;
                        return u = ee(), u === de && (u = Uu()), u;
                    }
                    function X() {
                        var e, t, r;
                        return Zo++, e = Vo, t = J(), t !== de ? (105 === u.charCodeAt(Vo) ? (r = Yt, Vo++) : (r = de, 0 === Zo && E(Wt)), r === de && (r = null), r !== de ? (Yo = e, t = Xt(t, r), e = t) : (Vo = e, e = de)) : (Vo = e, e = de), Zo--, e === de && (t = de, 0 === Zo && E(Vt)), e;
                    }
                    function J() {
                        var e, t, r, n;
                        if (Zo++, e = Vo, 34 === u.charCodeAt(Vo) ? (t = Zt, Vo++) : (t = de, 0 === Zo && E(Kt)), t !== de) {
                            for(r = [], n = Z(); n !== de;)r.push(n), n = Z();
                            r !== de ? (34 === u.charCodeAt(Vo) ? (n = Zt, Vo++) : (n = de, 0 === Zo && E(Kt)), n !== de ? (Yo = e, t = Qt(r), e = t) : (Vo = e, e = de)) : (Vo = e, e = de);
                        } else Vo = e, e = de;
                        if (e === de) {
                            if (e = Vo, 39 === u.charCodeAt(Vo) ? (t = ur, Vo++) : (t = de, 0 === Zo && E(er)), t !== de) {
                                for(r = [], n = K(); n !== de;)r.push(n), n = K();
                                r !== de ? (39 === u.charCodeAt(Vo) ? (n = ur, Vo++) : (n = de, 0 === Zo && E(er)), n !== de ? (Yo = e, t = Qt(r), e = t) : (Vo = e, e = de)) : (Vo = e, e = de);
                            } else Vo = e, e = de;
                        }
                        return Zo--, e === de && (t = de, 0 === Zo && E(Jt)), e;
                    }
                    function Z() {
                        var e, t, r;
                        return e = Vo, t = Vo, Zo++, 34 === u.charCodeAt(Vo) ? (r = Zt, Vo++) : (r = de, 0 === Zo && E(Kt)), r === de && (92 === u.charCodeAt(Vo) ? (r = Nt, Vo++) : (r = de, 0 === Zo && E(Ut)), r === de && (r = I())), Zo--, r === de ? t = void 0 : (Vo = t, t = de), t !== de ? (r = k(), r !== de ? (Yo = e, t = tr(), e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e === de && (e = Vo, 92 === u.charCodeAt(Vo) ? (t = Nt, Vo++) : (t = de, 0 === Zo && E(Ut)), t !== de ? (r = ru(), r !== de ? (Yo = e, t = Ht(r), e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e === de && (e = tu())), e;
                    }
                    function K() {
                        var e, t, r;
                        return e = Vo, t = Vo, Zo++, 39 === u.charCodeAt(Vo) ? (r = ur, Vo++) : (r = de, 0 === Zo && E(er)), r === de && (92 === u.charCodeAt(Vo) ? (r = Nt, Vo++) : (r = de, 0 === Zo && E(Ut)), r === de && (r = I())), Zo--, r === de ? t = void 0 : (Vo = t, t = de), t !== de ? (r = k(), r !== de ? (Yo = e, t = tr(), e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e === de && (e = Vo, 92 === u.charCodeAt(Vo) ? (t = Nt, Vo++) : (t = de, 0 === Zo && E(Ut)), t !== de ? (r = ru(), r !== de ? (Yo = e, t = Ht(r), e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e === de && (e = tu())), e;
                    }
                    function Q() {
                        var e, t, r, n, o, s;
                        if (Zo++, e = Vo, 91 === u.charCodeAt(Vo) ? (t = nr, Vo++) : (t = de, 0 === Zo && E(or)), t !== de) {
                            if (94 === u.charCodeAt(Vo) ? (r = sr, Vo++) : (r = de, 0 === Zo && E(ir)), r === de && (r = null), r !== de) {
                                for(n = [], o = uu(), o === de && (o = eu()); o !== de;)n.push(o), o = uu(), o === de && (o = eu());
                                n !== de ? (93 === u.charCodeAt(Vo) ? (o = ar, Vo++) : (o = de, 0 === Zo && E(cr)), o !== de ? (105 === u.charCodeAt(Vo) ? (s = Yt, Vo++) : (s = de, 0 === Zo && E(Wt)), s === de && (s = null), s !== de ? (Yo = e, t = pr(r, n, s), e = t) : (Vo = e, e = de)) : (Vo = e, e = de)) : (Vo = e, e = de);
                            } else Vo = e, e = de;
                        } else Vo = e, e = de;
                        return Zo--, e === de && (t = de, 0 === Zo && E(rr)), e;
                    }
                    function uu() {
                        var e, t, r, n;
                        return e = Vo, t = eu(), t !== de ? (45 === u.charCodeAt(Vo) ? (r = Ar, Vo++) : (r = de, 0 === Zo && E(lr)), r !== de ? (n = eu(), n !== de ? (Yo = e, t = Er(t, n), e = t) : (Vo = e, e = de)) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function eu() {
                        var e, t, r;
                        return e = Vo, t = Vo, Zo++, 93 === u.charCodeAt(Vo) ? (r = ar, Vo++) : (r = de, 0 === Zo && E(cr)), r === de && (92 === u.charCodeAt(Vo) ? (r = Nt, Vo++) : (r = de, 0 === Zo && E(Ut)), r === de && (r = I())), Zo--, r === de ? t = void 0 : (Vo = t, t = de), t !== de ? (r = k(), r !== de ? (Yo = e, t = tr(), e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e === de && (e = Vo, 92 === u.charCodeAt(Vo) ? (t = Nt, Vo++) : (t = de, 0 === Zo && E(Ut)), t !== de ? (r = ru(), r !== de ? (Yo = e, t = Ht(r), e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e === de && (e = tu())), e;
                    }
                    function tu() {
                        var e, t, r;
                        return e = Vo, 92 === u.charCodeAt(Vo) ? (t = Nt, Vo++) : (t = de, 0 === Zo && E(Ut)), t !== de ? (r = O(), r !== de ? (Yo = e, t = Cr(), e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function ru() {
                        var e, t, r, n;
                        return e = nu(), e === de && (e = Vo, 48 === u.charCodeAt(Vo) ? (t = fr, Vo++) : (t = de, 0 === Zo && E(Fr)), t !== de ? (r = Vo, Zo++, n = pu(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (Yo = e, t = dr(), e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e === de && (e = au(), e === de && (e = cu()))), e;
                    }
                    function nu() {
                        var u;
                        return u = ou(), u === de && (u = su()), u;
                    }
                    function ou() {
                        var e, t;
                        return 39 === u.charCodeAt(Vo) ? (e = ur, Vo++) : (e = de, 0 === Zo && E(er)), e === de && (34 === u.charCodeAt(Vo) ? (e = Zt, Vo++) : (e = de, 0 === Zo && E(Kt)), e === de && (92 === u.charCodeAt(Vo) ? (e = Nt, Vo++) : (e = de, 0 === Zo && E(Ut)), e === de && (e = Vo, 98 === u.charCodeAt(Vo) ? (t = hr, Vo++) : (t = de, 0 === Zo && E(gr)), t !== de && (Yo = e, t = Dr()), e = t, e === de && (e = Vo, 102 === u.charCodeAt(Vo) ? (t = Br, Vo++) : (t = de, 0 === Zo && E(vr)), t !== de && (Yo = e, t = mr()), e = t, e === de && (e = Vo, 110 === u.charCodeAt(Vo) ? (t = br, Vo++) : (t = de, 0 === Zo && E(xr)), t !== de && (Yo = e, t = Pr()), e = t, e === de && (e = Vo, 114 === u.charCodeAt(Vo) ? (t = _r, Vo++) : (t = de, 0 === Zo && E(yr)), t !== de && (Yo = e, t = $r()), e = t, e === de && (e = Vo, 116 === u.charCodeAt(Vo) ? (t = Rr, Vo++) : (t = de, 0 === Zo && E(kr)), t !== de && (Yo = e, t = Sr()), e = t, e === de && (e = Vo, 118 === u.charCodeAt(Vo) ? (t = Ir, Vo++) : (t = de, 0 === Zo && E(Or)), t !== de && (Yo = e, t = jr()), e = t)))))))), e;
                    }
                    function su() {
                        var u, e, t;
                        return u = Vo, e = Vo, Zo++, t = iu(), t === de && (t = I()), Zo--, t === de ? e = void 0 : (Vo = e, e = de), e !== de ? (t = k(), t !== de ? (Yo = u, e = tr(), u = e) : (Vo = u, u = de)) : (Vo = u, u = de), u;
                    }
                    function iu() {
                        var e;
                        return e = ou(), e === de && (e = pu(), e === de && (120 === u.charCodeAt(Vo) ? (e = Lr, Vo++) : (e = de, 0 === Zo && E(wr)), e === de && (117 === u.charCodeAt(Vo) ? (e = Tr, Vo++) : (e = de, 0 === Zo && E(Nr))))), e;
                    }
                    function au() {
                        var e, t, r, n, o, s;
                        return e = Vo, 120 === u.charCodeAt(Vo) ? (t = Lr, Vo++) : (t = de, 0 === Zo && E(wr)), t !== de ? (r = Vo, n = Vo, o = Au(), o !== de ? (s = Au(), s !== de ? (o = [
                            o,
                            s
                        ], n = o) : (Vo = n, n = de)) : (Vo = n, n = de), r = n !== de ? u.substring(r, Vo) : n, r !== de ? (Yo = e, t = Ur(r), e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function cu() {
                        var e, t, r, n, o, s, i, a;
                        return e = Vo, 117 === u.charCodeAt(Vo) ? (t = Tr, Vo++) : (t = de, 0 === Zo && E(Nr)), t !== de ? (r = Vo, n = Vo, o = Au(), o !== de ? (s = Au(), s !== de ? (i = Au(), i !== de ? (a = Au(), a !== de ? (o = [
                            o,
                            s,
                            i,
                            a
                        ], n = o) : (Vo = n, n = de)) : (Vo = n, n = de)) : (Vo = n, n = de)) : (Vo = n, n = de), r = n !== de ? u.substring(r, Vo) : n, r !== de ? (Yo = e, t = Ur(r), e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function pu() {
                        var e;
                        return Hr.test(u.charAt(Vo)) ? (e = u.charAt(Vo), Vo++) : (e = de, 0 === Zo && E(qr)), e;
                    }
                    function Au() {
                        var e;
                        return zr.test(u.charAt(Vo)) ? (e = u.charAt(Vo), Vo++) : (e = de, 0 === Zo && E(Mr)), e;
                    }
                    function lu() {
                        var e, t;
                        return e = Vo, 46 === u.charCodeAt(Vo) ? (t = Gr, Vo++) : (t = de, 0 === Zo && E(Vr)), t !== de && (Yo = e, t = Yr()), e = t;
                    }
                    function Eu() {
                        var e, t, r, n;
                        return Zo++, e = Vo, 123 === u.charCodeAt(Vo) ? (t = Xr, Vo++) : (t = de, 0 === Zo && E(Jr)), t !== de ? (r = Cu(), r !== de ? (125 === u.charCodeAt(Vo) ? (n = Zr, Vo++) : (n = de, 0 === Zo && E(Kr)), n !== de ? (Yo = e, t = Qr(r), e = t) : (Vo = e, e = de)) : (Vo = e, e = de)) : (Vo = e, e = de), Zo--, e === de && (t = de, 0 === Zo && E(Wr)), e;
                    }
                    function Cu() {
                        var e, t, r, n, o, s;
                        if (e = Vo, t = [], r = [], n = Vo, o = Vo, Zo++, un.test(u.charAt(Vo)) ? (s = u.charAt(Vo), Vo++) : (s = de, 0 === Zo && E(en)), Zo--, s === de ? o = void 0 : (Vo = o, o = de), o !== de ? (s = k(), s !== de ? (o = [
                            o,
                            s
                        ], n = o) : (Vo = n, n = de)) : (Vo = n, n = de), n !== de) for(; n !== de;)r.push(n), n = Vo, o = Vo, Zo++, un.test(u.charAt(Vo)) ? (s = u.charAt(Vo), Vo++) : (s = de, 0 === Zo && E(en)), Zo--, s === de ? o = void 0 : (Vo = o, o = de), o !== de ? (s = k(), s !== de ? (o = [
                            o,
                            s
                        ], n = o) : (Vo = n, n = de)) : (Vo = n, n = de);
                        else r = de;
                        for(r === de && (r = Vo, 123 === u.charCodeAt(Vo) ? (n = Xr, Vo++) : (n = de, 0 === Zo && E(Jr)), n !== de ? (o = Cu(), o !== de ? (125 === u.charCodeAt(Vo) ? (s = Zr, Vo++) : (s = de, 0 === Zo && E(Kr)), s !== de ? (n = [
                            n,
                            o,
                            s
                        ], r = n) : (Vo = r, r = de)) : (Vo = r, r = de)) : (Vo = r, r = de)); r !== de;){
                            if (t.push(r), r = [], n = Vo, o = Vo, Zo++, un.test(u.charAt(Vo)) ? (s = u.charAt(Vo), Vo++) : (s = de, 0 === Zo && E(en)), Zo--, s === de ? o = void 0 : (Vo = o, o = de), o !== de ? (s = k(), s !== de ? (o = [
                                o,
                                s
                            ], n = o) : (Vo = n, n = de)) : (Vo = n, n = de), n !== de) for(; n !== de;)r.push(n), n = Vo, o = Vo, Zo++, un.test(u.charAt(Vo)) ? (s = u.charAt(Vo), Vo++) : (s = de, 0 === Zo && E(en)), Zo--, s === de ? o = void 0 : (Vo = o, o = de), o !== de ? (s = k(), s !== de ? (o = [
                                o,
                                s
                            ], n = o) : (Vo = n, n = de)) : (Vo = n, n = de);
                            else r = de;
                            r === de && (r = Vo, 123 === u.charCodeAt(Vo) ? (n = Xr, Vo++) : (n = de, 0 === Zo && E(Jr)), n !== de ? (o = Cu(), o !== de ? (125 === u.charCodeAt(Vo) ? (s = Zr, Vo++) : (s = de, 0 === Zo && E(Kr)), s !== de ? (n = [
                                n,
                                o,
                                s
                            ], r = n) : (Vo = r, r = de)) : (Vo = r, r = de)) : (Vo = r, r = de));
                        }
                        return e = t !== de ? u.substring(e, Vo) : t;
                    }
                    function fu() {
                        var e;
                        return tn.test(u.charAt(Vo)) ? (e = u.charAt(Vo), Vo++) : (e = de, 0 === Zo && E(rn)), e;
                    }
                    function Fu() {
                        var e;
                        return nn.test(u.charAt(Vo)) ? (e = u.charAt(Vo), Vo++) : (e = de, 0 === Zo && E(on)), e;
                    }
                    function du() {
                        var e;
                        return sn.test(u.charAt(Vo)) ? (e = u.charAt(Vo), Vo++) : (e = de, 0 === Zo && E(an)), e;
                    }
                    function hu() {
                        var e;
                        return cn.test(u.charAt(Vo)) ? (e = u.charAt(Vo), Vo++) : (e = de, 0 === Zo && E(pn)), e;
                    }
                    function gu() {
                        var e;
                        return An.test(u.charAt(Vo)) ? (e = u.charAt(Vo), Vo++) : (e = de, 0 === Zo && E(ln)), e;
                    }
                    function Du() {
                        var e;
                        return En.test(u.charAt(Vo)) ? (e = u.charAt(Vo), Vo++) : (e = de, 0 === Zo && E(Cn)), e;
                    }
                    function Bu() {
                        var e;
                        return fn.test(u.charAt(Vo)) ? (e = u.charAt(Vo), Vo++) : (e = de, 0 === Zo && E(Fn)), e;
                    }
                    function vu() {
                        var e;
                        return dn.test(u.charAt(Vo)) ? (e = u.charAt(Vo), Vo++) : (e = de, 0 === Zo && E(hn)), e;
                    }
                    function mu() {
                        var e;
                        return gn.test(u.charAt(Vo)) ? (e = u.charAt(Vo), Vo++) : (e = de, 0 === Zo && E(Dn)), e;
                    }
                    function bu() {
                        var e;
                        return Bn.test(u.charAt(Vo)) ? (e = u.charAt(Vo), Vo++) : (e = de, 0 === Zo && E(vn)), e;
                    }
                    function xu() {
                        var e;
                        return mn.test(u.charAt(Vo)) ? (e = u.charAt(Vo), Vo++) : (e = de, 0 === Zo && E(bn)), e;
                    }
                    function Pu() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 5) === xn ? (t = xn, Vo += 5) : (t = de, 0 === Zo && E(Pn)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function _u() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 4) === _n ? (t = _n, Vo += 4) : (t = de, 0 === Zo && E(yn)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function yu() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 5) === $n ? (t = $n, Vo += 5) : (t = de, 0 === Zo && E(Rn)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function $u() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 5) === kn ? (t = kn, Vo += 5) : (t = de, 0 === Zo && E(Sn)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function Ru() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 5) === In ? (t = In, Vo += 5) : (t = de, 0 === Zo && E(On)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function ku() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 8) === jn ? (t = jn, Vo += 8) : (t = de, 0 === Zo && E(Ln)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function Su() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 8) === wn ? (t = wn, Vo += 8) : (t = de, 0 === Zo && E(Tn)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function Iu() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 7) === Nn ? (t = Nn, Vo += 7) : (t = de, 0 === Zo && E(Un)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function Ou() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 6) === Hn ? (t = Hn, Vo += 6) : (t = de, 0 === Zo && E(qn)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function ju() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 2) === zn ? (t = zn, Vo += 2) : (t = de, 0 === Zo && E(Mn)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function Lu() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 4) === Gn ? (t = Gn, Vo += 4) : (t = de, 0 === Zo && E(Vn)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function wu() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 4) === Yn ? (t = Yn, Vo += 4) : (t = de, 0 === Zo && E(Wn)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function Tu() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 6) === Xn ? (t = Xn, Vo += 6) : (t = de, 0 === Zo && E(Jn)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function Nu() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 7) === Zn ? (t = Zn, Vo += 7) : (t = de, 0 === Zo && E(Kn)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function Uu() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 5) === Qn ? (t = Qn, Vo += 5) : (t = de, 0 === Zo && E(uo)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function Hu() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 7) === eo ? (t = eo, Vo += 7) : (t = de, 0 === Zo && E(to)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function qu() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 3) === ro ? (t = ro, Vo += 3) : (t = de, 0 === Zo && E(no)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function zu() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 8) === oo ? (t = oo, Vo += 8) : (t = de, 0 === Zo && E(so)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function Mu() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 2) === io ? (t = io, Vo += 2) : (t = de, 0 === Zo && E(ao)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function Gu() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 6) === co ? (t = co, Vo += 6) : (t = de, 0 === Zo && E(po)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function Vu() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 10) === Ao ? (t = Ao, Vo += 10) : (t = de, 0 === Zo && E(lo)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function Yu() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 2) === Eo ? (t = Eo, Vo += 2) : (t = de, 0 === Zo && E(Co)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function Wu() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 3) === fo ? (t = fo, Vo += 3) : (t = de, 0 === Zo && E(Fo)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function Xu() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 4) === ho ? (t = ho, Vo += 4) : (t = de, 0 === Zo && E(go)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function Ju() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 6) === Do ? (t = Do, Vo += 6) : (t = de, 0 === Zo && E(Bo)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function Zu() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 5) === vo ? (t = vo, Vo += 5) : (t = de, 0 === Zo && E(mo)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function Ku() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 6) === bo ? (t = bo, Vo += 6) : (t = de, 0 === Zo && E(xo)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function Qu() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 4) === Po ? (t = Po, Vo += 4) : (t = de, 0 === Zo && E(_o)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function ue() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 5) === yo ? (t = yo, Vo += 5) : (t = de, 0 === Zo && E($o)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function ee() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 4) === Ro ? (t = Ro, Vo += 4) : (t = de, 0 === Zo && E(ko)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function te() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 3) === So ? (t = So, Vo += 3) : (t = de, 0 === Zo && E(Io)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function re() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 6) === Oo ? (t = Oo, Vo += 6) : (t = de, 0 === Zo && E(jo)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function ne() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 3) === Lo ? (t = Lo, Vo += 3) : (t = de, 0 === Zo && E(wo)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function oe() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 4) === To ? (t = To, Vo += 4) : (t = de, 0 === Zo && E(No)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function se() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 5) === Uo ? (t = Uo, Vo += 5) : (t = de, 0 === Zo && E(Ho)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function ie() {
                        var e, t, r, n;
                        return e = Vo, u.substr(Vo, 4) === qo ? (t = qo, Vo += 4) : (t = de, 0 === Zo && E(zo)), t !== de ? (r = Vo, Zo++, n = q(), Zo--, n === de ? r = void 0 : (Vo = r, r = de), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e;
                    }
                    function ae() {
                        var u, e;
                        for(u = [], e = S(), e === de && (e = O(), e === de && (e = j())); e !== de;)u.push(e), e = S(), e === de && (e = O(), e === de && (e = j()));
                        return u;
                    }
                    function ce() {
                        var u, e;
                        for(u = [], e = S(), e === de && (e = w()); e !== de;)u.push(e), e = S(), e === de && (e = w());
                        return u;
                    }
                    function pe() {
                        var e, t, r, n;
                        return e = Vo, t = ae(), t !== de ? (59 === u.charCodeAt(Vo) ? (r = Mo, Vo++) : (r = de, 0 === Zo && E(Go)), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de), e === de && (e = Vo, t = ce(), t !== de ? (r = T(), r === de && (r = null), r !== de ? (n = O(), n !== de ? (t = [
                            t,
                            r,
                            n
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de)) : (Vo = e, e = de), e === de && (e = Vo, t = ae(), t !== de ? (r = Ae(), r !== de ? (t = [
                            t,
                            r
                        ], e = t) : (Vo = e, e = de)) : (Vo = e, e = de))), e;
                    }
                    function Ae() {
                        var e, t;
                        return e = Vo, Zo++, u.length > Vo ? (t = u.charAt(Vo), Vo++) : (t = de, 0 === Zo && E(ut)), Zo--, t === de ? e = void 0 : (Vo = e, e = de), e;
                    }
                    function le(u) {
                        var e, t = [];
                        for(e = 0; e < u.length; e++)"" !== u[e] && t.push(u[e]);
                        return t;
                    }
                    function Ee(u, e) {
                        return u ? u[e] : null;
                    }
                    function Ce(u, e) {
                        var t, r = new Array(u.length);
                        for(t = 0; t < u.length; t++)r[t] = u[t][e];
                        return r;
                    }
                    function fe(u, e, t) {
                        return [
                            u
                        ].concat(Ce(e, t));
                    }
                    e = void 0 !== e ? e : {};
                    var Fe, de = {}, he = {
                        Grammar: F
                    }, ge = F, De = function(u, e) {
                        return {
                            type: "grammar",
                            initializer: Ee(u, 0),
                            rules: Ce(e, 0),
                            location: r()
                        };
                    }, Be = function(u) {
                        return {
                            type: "initializer",
                            code: u,
                            location: r()
                        };
                    }, ve = "=", me = s("=", !1), be = function(u, e, t) {
                        return {
                            type: "rule",
                            name: u,
                            expression: null !== e ? {
                                type: "named",
                                name: e[0],
                                expression: t,
                                location: r()
                            } : t,
                            location: r()
                        };
                    }, xe = "/", Pe = s("/", !1), _e = function(u, e) {
                        return e.length > 0 ? {
                            type: "choice",
                            alternatives: fe(u, e, 3),
                            location: r()
                        } : u;
                    }, ye = function(u, e) {
                        return null !== e ? {
                            type: "action",
                            expression: u,
                            code: e[1],
                            location: r()
                        } : u;
                    }, $e = function(u, e) {
                        return e.length > 0 ? {
                            type: "sequence",
                            elements: fe(u, e, 1),
                            location: r()
                        } : u;
                    }, Re = ":", ke = s(":", !1), Se = function(u, e) {
                        return {
                            type: "labeled",
                            label: u,
                            expression: e,
                            location: r()
                        };
                    }, Ie = function(u, e) {
                        return {
                            type: Ko[u],
                            expression: e,
                            location: r()
                        };
                    }, Oe = "$", je = s("$", !1), Le = "&", we = s("&", !1), Te = "!", Ne = s("!", !1), Ue = function(u, e) {
                        return {
                            type: Qo[e],
                            expression: u,
                            location: r()
                        };
                    }, He = "?", qe = s("?", !1), ze = "*", Me = s("*", !1), Ge = "+", Ve = s("+", !1), Ye = "(", We = s("(", !1), Xe = ")", Je = s(")", !1), Ze = function(u) {
                        return "labeled" === u.type || "sequence" === u.type ? {
                            type: "group",
                            expression: u
                        } : u;
                    }, Ke = function(u) {
                        return {
                            type: "rule_ref",
                            name: u,
                            location: r()
                        };
                    }, Qe = function(u, e) {
                        return {
                            type: us[u],
                            code: e,
                            location: r()
                        };
                    }, ut = a(), et = p("whitespace"), tt = "	", rt = s("	", !1), nt = "\v", ot = s("\v", !1), st = "\f", it = s("\f", !1), at = " ", ct = s(" ", !1), pt = " ", At = s(" ", !1), lt = "\uFEFF", Et = s("\uFEFF", !1), Ct = /^[\n\r\u2028\u2029]/, ft = i([
                        "\n",
                        "\r",
                        "\u2028",
                        "\u2029"
                    ], !1, !1), Ft = p("end of line"), dt = "\n", ht = s("\n", !1), gt = "\r\n", Dt = s("\r\n", !1), Bt = "\r", vt = s("\r", !1), mt = "\u2028", bt = s("\u2028", !1), xt = "\u2029", Pt = s("\u2029", !1), _t = p("comment"), yt = "/*", $t = s("/*", !1), Rt = "*/", kt = s("*/", !1), St = "//", It = s("//", !1), Ot = function(u) {
                        return u;
                    }, jt = p("identifier"), Lt = function(u, e) {
                        return u + e.join("");
                    }, wt = "_", Tt = s("_", !1), Nt = "\\", Ut = s("\\", !1), Ht = function(u) {
                        return u;
                    }, qt = "‌", zt = s("‌", !1), Mt = "‍", Gt = s("‍", !1), Vt = p("literal"), Yt = "i", Wt = s("i", !1), Xt = function(u, e) {
                        return {
                            type: "literal",
                            value: u,
                            ignoreCase: null !== e,
                            location: r()
                        };
                    }, Jt = p("string"), Zt = '"', Kt = s('"', !1), Qt = function(u) {
                        return u.join("");
                    }, ur = "'", er = s("'", !1), tr = function() {
                        return t();
                    }, rr = p("character class"), nr = "[", or = s("[", !1), sr = "^", ir = s("^", !1), ar = "]", cr = s("]", !1), pr = function(u, e, t) {
                        return {
                            type: "class",
                            parts: le(e),
                            inverted: null !== u,
                            ignoreCase: null !== t,
                            location: r()
                        };
                    }, Ar = "-", lr = s("-", !1), Er = function(u, e) {
                        return u.charCodeAt(0) > e.charCodeAt(0) && o("Invalid character range: " + t() + "."), [
                            u,
                            e
                        ];
                    }, Cr = function() {
                        return "";
                    }, fr = "0", Fr = s("0", !1), dr = function() {
                        return "\0";
                    }, hr = "b", gr = s("b", !1), Dr = function() {
                        return "\b";
                    }, Br = "f", vr = s("f", !1), mr = function() {
                        return "\f";
                    }, br = "n", xr = s("n", !1), Pr = function() {
                        return "\n";
                    }, _r = "r", yr = s("r", !1), $r = function() {
                        return "\r";
                    }, Rr = "t", kr = s("t", !1), Sr = function() {
                        return "	";
                    }, Ir = "v", Or = s("v", !1), jr = function() {
                        return "\v";
                    }, Lr = "x", wr = s("x", !1), Tr = "u", Nr = s("u", !1), Ur = function(u) {
                        return String.fromCharCode(parseInt(u, 16));
                    }, Hr = /^[0-9]/, qr = i([
                        [
                            "0",
                            "9"
                        ]
                    ], !1, !1), zr = /^[0-9a-f]/i, Mr = i([
                        [
                            "0",
                            "9"
                        ],
                        [
                            "a",
                            "f"
                        ]
                    ], !1, !0), Gr = ".", Vr = s(".", !1), Yr = function() {
                        return {
                            type: "any",
                            location: r()
                        };
                    }, Wr = p("code block"), Xr = "{", Jr = s("{", !1), Zr = "}", Kr = s("}", !1), Qr = function(u) {
                        return u;
                    }, un = /^[{}]/, en = i([
                        "{",
                        "}"
                    ], !1, !1), tn = /^[a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137-\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148-\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C-\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA-\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9-\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC-\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF-\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F-\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0-\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB-\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE-\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0561-\u0587\u13F8-\u13FD\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6-\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FC7\u1FD0-\u1FD3\u1FD6-\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6-\u1FF7\u210A\u210E-\u210F\u2113\u212F\u2134\u2139\u213C-\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65-\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73-\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3-\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7B5\uA7B7\uA7FA\uAB30-\uAB5A\uAB60-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A]/, rn = i([
                        [
                            "a",
                            "z"
                        ],
                        "\xb5",
                        [
                            "\xdf",
                            "\xf6"
                        ],
                        [
                            "\xf8",
                            "\xff"
                        ],
                        "ā",
                        "ă",
                        "ą",
                        "ć",
                        "ĉ",
                        "ċ",
                        "č",
                        "ď",
                        "đ",
                        "ē",
                        "ĕ",
                        "ė",
                        "ę",
                        "ě",
                        "ĝ",
                        "ğ",
                        "ġ",
                        "ģ",
                        "ĥ",
                        "ħ",
                        "ĩ",
                        "ī",
                        "ĭ",
                        "į",
                        "ı",
                        "ĳ",
                        "ĵ",
                        [
                            "ķ",
                            "ĸ"
                        ],
                        "ĺ",
                        "ļ",
                        "ľ",
                        "ŀ",
                        "ł",
                        "ń",
                        "ņ",
                        [
                            "ň",
                            "ŉ"
                        ],
                        "ŋ",
                        "ō",
                        "ŏ",
                        "ő",
                        "œ",
                        "ŕ",
                        "ŗ",
                        "ř",
                        "ś",
                        "ŝ",
                        "ş",
                        "š",
                        "ţ",
                        "ť",
                        "ŧ",
                        "ũ",
                        "ū",
                        "ŭ",
                        "ů",
                        "ű",
                        "ų",
                        "ŵ",
                        "ŷ",
                        "ź",
                        "ż",
                        [
                            "ž",
                            "ƀ"
                        ],
                        "ƃ",
                        "ƅ",
                        "ƈ",
                        [
                            "ƌ",
                            "ƍ"
                        ],
                        "ƒ",
                        "ƕ",
                        [
                            "ƙ",
                            "ƛ"
                        ],
                        "ƞ",
                        "ơ",
                        "ƣ",
                        "ƥ",
                        "ƨ",
                        [
                            "ƪ",
                            "ƫ"
                        ],
                        "ƭ",
                        "ư",
                        "ƴ",
                        "ƶ",
                        [
                            "ƹ",
                            "ƺ"
                        ],
                        [
                            "ƽ",
                            "ƿ"
                        ],
                        "ǆ",
                        "ǉ",
                        "ǌ",
                        "ǎ",
                        "ǐ",
                        "ǒ",
                        "ǔ",
                        "ǖ",
                        "ǘ",
                        "ǚ",
                        [
                            "ǜ",
                            "ǝ"
                        ],
                        "ǟ",
                        "ǡ",
                        "ǣ",
                        "ǥ",
                        "ǧ",
                        "ǩ",
                        "ǫ",
                        "ǭ",
                        [
                            "ǯ",
                            "ǰ"
                        ],
                        "ǳ",
                        "ǵ",
                        "ǹ",
                        "ǻ",
                        "ǽ",
                        "ǿ",
                        "ȁ",
                        "ȃ",
                        "ȅ",
                        "ȇ",
                        "ȉ",
                        "ȋ",
                        "ȍ",
                        "ȏ",
                        "ȑ",
                        "ȓ",
                        "ȕ",
                        "ȗ",
                        "ș",
                        "ț",
                        "ȝ",
                        "ȟ",
                        "ȡ",
                        "ȣ",
                        "ȥ",
                        "ȧ",
                        "ȩ",
                        "ȫ",
                        "ȭ",
                        "ȯ",
                        "ȱ",
                        [
                            "ȳ",
                            "ȹ"
                        ],
                        "ȼ",
                        [
                            "ȿ",
                            "ɀ"
                        ],
                        "ɂ",
                        "ɇ",
                        "ɉ",
                        "ɋ",
                        "ɍ",
                        [
                            "ɏ",
                            "ʓ"
                        ],
                        [
                            "ʕ",
                            "ʯ"
                        ],
                        "ͱ",
                        "ͳ",
                        "ͷ",
                        [
                            "ͻ",
                            "ͽ"
                        ],
                        "ΐ",
                        [
                            "ά",
                            "ώ"
                        ],
                        [
                            "ϐ",
                            "ϑ"
                        ],
                        [
                            "ϕ",
                            "ϗ"
                        ],
                        "ϙ",
                        "ϛ",
                        "ϝ",
                        "ϟ",
                        "ϡ",
                        "ϣ",
                        "ϥ",
                        "ϧ",
                        "ϩ",
                        "ϫ",
                        "ϭ",
                        [
                            "ϯ",
                            "ϳ"
                        ],
                        "ϵ",
                        "ϸ",
                        [
                            "ϻ",
                            "ϼ"
                        ],
                        [
                            "а",
                            "џ"
                        ],
                        "ѡ",
                        "ѣ",
                        "ѥ",
                        "ѧ",
                        "ѩ",
                        "ѫ",
                        "ѭ",
                        "ѯ",
                        "ѱ",
                        "ѳ",
                        "ѵ",
                        "ѷ",
                        "ѹ",
                        "ѻ",
                        "ѽ",
                        "ѿ",
                        "ҁ",
                        "ҋ",
                        "ҍ",
                        "ҏ",
                        "ґ",
                        "ғ",
                        "ҕ",
                        "җ",
                        "ҙ",
                        "қ",
                        "ҝ",
                        "ҟ",
                        "ҡ",
                        "ң",
                        "ҥ",
                        "ҧ",
                        "ҩ",
                        "ҫ",
                        "ҭ",
                        "ү",
                        "ұ",
                        "ҳ",
                        "ҵ",
                        "ҷ",
                        "ҹ",
                        "һ",
                        "ҽ",
                        "ҿ",
                        "ӂ",
                        "ӄ",
                        "ӆ",
                        "ӈ",
                        "ӊ",
                        "ӌ",
                        [
                            "ӎ",
                            "ӏ"
                        ],
                        "ӑ",
                        "ӓ",
                        "ӕ",
                        "ӗ",
                        "ә",
                        "ӛ",
                        "ӝ",
                        "ӟ",
                        "ӡ",
                        "ӣ",
                        "ӥ",
                        "ӧ",
                        "ө",
                        "ӫ",
                        "ӭ",
                        "ӯ",
                        "ӱ",
                        "ӳ",
                        "ӵ",
                        "ӷ",
                        "ӹ",
                        "ӻ",
                        "ӽ",
                        "ӿ",
                        "ԁ",
                        "ԃ",
                        "ԅ",
                        "ԇ",
                        "ԉ",
                        "ԋ",
                        "ԍ",
                        "ԏ",
                        "ԑ",
                        "ԓ",
                        "ԕ",
                        "ԗ",
                        "ԙ",
                        "ԛ",
                        "ԝ",
                        "ԟ",
                        "ԡ",
                        "ԣ",
                        "ԥ",
                        "ԧ",
                        "ԩ",
                        "ԫ",
                        "ԭ",
                        "ԯ",
                        [
                            "ա",
                            "և"
                        ],
                        [
                            "ᏸ",
                            "ᏽ"
                        ],
                        [
                            "ᴀ",
                            "ᴫ"
                        ],
                        [
                            "ᵫ",
                            "ᵷ"
                        ],
                        [
                            "ᵹ",
                            "ᶚ"
                        ],
                        "ḁ",
                        "ḃ",
                        "ḅ",
                        "ḇ",
                        "ḉ",
                        "ḋ",
                        "ḍ",
                        "ḏ",
                        "ḑ",
                        "ḓ",
                        "ḕ",
                        "ḗ",
                        "ḙ",
                        "ḛ",
                        "ḝ",
                        "ḟ",
                        "ḡ",
                        "ḣ",
                        "ḥ",
                        "ḧ",
                        "ḩ",
                        "ḫ",
                        "ḭ",
                        "ḯ",
                        "ḱ",
                        "ḳ",
                        "ḵ",
                        "ḷ",
                        "ḹ",
                        "ḻ",
                        "ḽ",
                        "ḿ",
                        "ṁ",
                        "ṃ",
                        "ṅ",
                        "ṇ",
                        "ṉ",
                        "ṋ",
                        "ṍ",
                        "ṏ",
                        "ṑ",
                        "ṓ",
                        "ṕ",
                        "ṗ",
                        "ṙ",
                        "ṛ",
                        "ṝ",
                        "ṟ",
                        "ṡ",
                        "ṣ",
                        "ṥ",
                        "ṧ",
                        "ṩ",
                        "ṫ",
                        "ṭ",
                        "ṯ",
                        "ṱ",
                        "ṳ",
                        "ṵ",
                        "ṷ",
                        "ṹ",
                        "ṻ",
                        "ṽ",
                        "ṿ",
                        "ẁ",
                        "ẃ",
                        "ẅ",
                        "ẇ",
                        "ẉ",
                        "ẋ",
                        "ẍ",
                        "ẏ",
                        "ẑ",
                        "ẓ",
                        [
                            "ẕ",
                            "ẝ"
                        ],
                        "ẟ",
                        "ạ",
                        "ả",
                        "ấ",
                        "ầ",
                        "ẩ",
                        "ẫ",
                        "ậ",
                        "ắ",
                        "ằ",
                        "ẳ",
                        "ẵ",
                        "ặ",
                        "ẹ",
                        "ẻ",
                        "ẽ",
                        "ế",
                        "ề",
                        "ể",
                        "ễ",
                        "ệ",
                        "ỉ",
                        "ị",
                        "ọ",
                        "ỏ",
                        "ố",
                        "ồ",
                        "ổ",
                        "ỗ",
                        "ộ",
                        "ớ",
                        "ờ",
                        "ở",
                        "ỡ",
                        "ợ",
                        "ụ",
                        "ủ",
                        "ứ",
                        "ừ",
                        "ử",
                        "ữ",
                        "ự",
                        "ỳ",
                        "ỵ",
                        "ỷ",
                        "ỹ",
                        "ỻ",
                        "ỽ",
                        [
                            "ỿ",
                            "ἇ"
                        ],
                        [
                            "ἐ",
                            "ἕ"
                        ],
                        [
                            "ἠ",
                            "ἧ"
                        ],
                        [
                            "ἰ",
                            "ἷ"
                        ],
                        [
                            "ὀ",
                            "ὅ"
                        ],
                        [
                            "ὐ",
                            "ὗ"
                        ],
                        [
                            "ὠ",
                            "ὧ"
                        ],
                        [
                            "ὰ",
                            "ώ"
                        ],
                        [
                            "ᾀ",
                            "ᾇ"
                        ],
                        [
                            "ᾐ",
                            "ᾗ"
                        ],
                        [
                            "ᾠ",
                            "ᾧ"
                        ],
                        [
                            "ᾰ",
                            "ᾴ"
                        ],
                        [
                            "ᾶ",
                            "ᾷ"
                        ],
                        "ι",
                        [
                            "ῂ",
                            "ῄ"
                        ],
                        [
                            "ῆ",
                            "ῇ"
                        ],
                        [
                            "ῐ",
                            "ΐ"
                        ],
                        [
                            "ῖ",
                            "ῗ"
                        ],
                        [
                            "ῠ",
                            "ῧ"
                        ],
                        [
                            "ῲ",
                            "ῴ"
                        ],
                        [
                            "ῶ",
                            "ῷ"
                        ],
                        "ℊ",
                        [
                            "ℎ",
                            "ℏ"
                        ],
                        "ℓ",
                        "ℯ",
                        "ℴ",
                        "ℹ",
                        [
                            "ℼ",
                            "ℽ"
                        ],
                        [
                            "ⅆ",
                            "ⅉ"
                        ],
                        "ⅎ",
                        "ↄ",
                        [
                            "ⰰ",
                            "ⱞ"
                        ],
                        "ⱡ",
                        [
                            "ⱥ",
                            "ⱦ"
                        ],
                        "ⱨ",
                        "ⱪ",
                        "ⱬ",
                        "ⱱ",
                        [
                            "ⱳ",
                            "ⱴ"
                        ],
                        [
                            "ⱶ",
                            "ⱻ"
                        ],
                        "ⲁ",
                        "ⲃ",
                        "ⲅ",
                        "ⲇ",
                        "ⲉ",
                        "ⲋ",
                        "ⲍ",
                        "ⲏ",
                        "ⲑ",
                        "ⲓ",
                        "ⲕ",
                        "ⲗ",
                        "ⲙ",
                        "ⲛ",
                        "ⲝ",
                        "ⲟ",
                        "ⲡ",
                        "ⲣ",
                        "ⲥ",
                        "ⲧ",
                        "ⲩ",
                        "ⲫ",
                        "ⲭ",
                        "ⲯ",
                        "ⲱ",
                        "ⲳ",
                        "ⲵ",
                        "ⲷ",
                        "ⲹ",
                        "ⲻ",
                        "ⲽ",
                        "ⲿ",
                        "ⳁ",
                        "ⳃ",
                        "ⳅ",
                        "ⳇ",
                        "ⳉ",
                        "ⳋ",
                        "ⳍ",
                        "ⳏ",
                        "ⳑ",
                        "ⳓ",
                        "ⳕ",
                        "ⳗ",
                        "ⳙ",
                        "ⳛ",
                        "ⳝ",
                        "ⳟ",
                        "ⳡ",
                        [
                            "ⳣ",
                            "ⳤ"
                        ],
                        "ⳬ",
                        "ⳮ",
                        "ⳳ",
                        [
                            "ⴀ",
                            "ⴥ"
                        ],
                        "ⴧ",
                        "ⴭ",
                        "ꙁ",
                        "ꙃ",
                        "ꙅ",
                        "ꙇ",
                        "ꙉ",
                        "ꙋ",
                        "ꙍ",
                        "ꙏ",
                        "ꙑ",
                        "ꙓ",
                        "ꙕ",
                        "ꙗ",
                        "ꙙ",
                        "ꙛ",
                        "ꙝ",
                        "ꙟ",
                        "ꙡ",
                        "ꙣ",
                        "ꙥ",
                        "ꙧ",
                        "ꙩ",
                        "ꙫ",
                        "ꙭ",
                        "ꚁ",
                        "ꚃ",
                        "ꚅ",
                        "ꚇ",
                        "ꚉ",
                        "ꚋ",
                        "ꚍ",
                        "ꚏ",
                        "ꚑ",
                        "ꚓ",
                        "ꚕ",
                        "ꚗ",
                        "ꚙ",
                        "ꚛ",
                        "ꜣ",
                        "ꜥ",
                        "ꜧ",
                        "ꜩ",
                        "ꜫ",
                        "ꜭ",
                        [
                            "ꜯ",
                            "ꜱ"
                        ],
                        "ꜳ",
                        "ꜵ",
                        "ꜷ",
                        "ꜹ",
                        "ꜻ",
                        "ꜽ",
                        "ꜿ",
                        "ꝁ",
                        "ꝃ",
                        "ꝅ",
                        "ꝇ",
                        "ꝉ",
                        "ꝋ",
                        "ꝍ",
                        "ꝏ",
                        "ꝑ",
                        "ꝓ",
                        "ꝕ",
                        "ꝗ",
                        "ꝙ",
                        "ꝛ",
                        "ꝝ",
                        "ꝟ",
                        "ꝡ",
                        "ꝣ",
                        "ꝥ",
                        "ꝧ",
                        "ꝩ",
                        "ꝫ",
                        "ꝭ",
                        "ꝯ",
                        [
                            "ꝱ",
                            "ꝸ"
                        ],
                        "ꝺ",
                        "ꝼ",
                        "ꝿ",
                        "ꞁ",
                        "ꞃ",
                        "ꞅ",
                        "ꞇ",
                        "ꞌ",
                        "ꞎ",
                        "ꞑ",
                        [
                            "ꞓ",
                            "ꞕ"
                        ],
                        "ꞗ",
                        "ꞙ",
                        "ꞛ",
                        "ꞝ",
                        "ꞟ",
                        "ꞡ",
                        "ꞣ",
                        "ꞥ",
                        "ꞧ",
                        "ꞩ",
                        "ꞵ",
                        "ꞷ",
                        "ꟺ",
                        [
                            "ꬰ",
                            "ꭚ"
                        ],
                        [
                            "ꭠ",
                            "ꭥ"
                        ],
                        [
                            "ꭰ",
                            "ꮿ"
                        ],
                        [
                            "ﬀ",
                            "ﬆ"
                        ],
                        [
                            "ﬓ",
                            "ﬗ"
                        ],
                        [
                            "ａ",
                            "ｚ"
                        ]
                    ], !1, !1), nn = /^[\u02B0-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0374\u037A\u0559\u0640\u06E5-\u06E6\u07F4-\u07F5\u07FA\u081A\u0824\u0828\u0971\u0E46\u0EC6\u10FC\u17D7\u1843\u1AA7\u1C78-\u1C7D\u1D2C-\u1D6A\u1D78\u1D9B-\u1DBF\u2071\u207F\u2090-\u209C\u2C7C-\u2C7D\u2D6F\u2E2F\u3005\u3031-\u3035\u303B\u309D-\u309E\u30FC-\u30FE\uA015\uA4F8-\uA4FD\uA60C\uA67F\uA69C-\uA69D\uA717-\uA71F\uA770\uA788\uA7F8-\uA7F9\uA9CF\uA9E6\uAA70\uAADD\uAAF3-\uAAF4\uAB5C-\uAB5F\uFF70\uFF9E-\uFF9F]/, on = i([
                        [
                            "ʰ",
                            "ˁ"
                        ],
                        [
                            "ˆ",
                            "ˑ"
                        ],
                        [
                            "ˠ",
                            "ˤ"
                        ],
                        "ˬ",
                        "ˮ",
                        "ʹ",
                        "ͺ",
                        "ՙ",
                        "ـ",
                        [
                            "ۥ",
                            "ۦ"
                        ],
                        [
                            "ߴ",
                            "ߵ"
                        ],
                        "ߺ",
                        "ࠚ",
                        "ࠤ",
                        "ࠨ",
                        "ॱ",
                        "ๆ",
                        "ໆ",
                        "ჼ",
                        "ៗ",
                        "ᡃ",
                        "ᪧ",
                        [
                            "ᱸ",
                            "ᱽ"
                        ],
                        [
                            "ᴬ",
                            "ᵪ"
                        ],
                        "ᵸ",
                        [
                            "ᶛ",
                            "ᶿ"
                        ],
                        "ⁱ",
                        "ⁿ",
                        [
                            "ₐ",
                            "ₜ"
                        ],
                        [
                            "ⱼ",
                            "ⱽ"
                        ],
                        "ⵯ",
                        "ⸯ",
                        "々",
                        [
                            "〱",
                            "〵"
                        ],
                        "〻",
                        [
                            "ゝ",
                            "ゞ"
                        ],
                        [
                            "ー",
                            "ヾ"
                        ],
                        "ꀕ",
                        [
                            "ꓸ",
                            "ꓽ"
                        ],
                        "ꘌ",
                        "ꙿ",
                        [
                            "ꚜ",
                            "ꚝ"
                        ],
                        [
                            "ꜗ",
                            "ꜟ"
                        ],
                        "ꝰ",
                        "ꞈ",
                        [
                            "ꟸ",
                            "ꟹ"
                        ],
                        "ꧏ",
                        "ꧦ",
                        "ꩰ",
                        "ꫝ",
                        [
                            "ꫳ",
                            "ꫴ"
                        ],
                        [
                            "ꭜ",
                            "ꭟ"
                        ],
                        "ｰ",
                        [
                            "ﾞ",
                            "ﾟ"
                        ]
                    ], !1, !1), sn = /^[\xAA\xBA\u01BB\u01C0-\u01C3\u0294\u05D0-\u05EA\u05F0-\u05F2\u0620-\u063F\u0641-\u064A\u066E-\u066F\u0671-\u06D3\u06D5\u06EE-\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u0800-\u0815\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0972-\u0980\u0985-\u098C\u098F-\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC-\u09DD\u09DF-\u09E1\u09F0-\u09F1\u0A05-\u0A0A\u0A0F-\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32-\u0A33\u0A35-\u0A36\u0A38-\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2-\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0-\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F-\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32-\u0B33\u0B35-\u0B39\u0B3D\u0B5C-\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99-\u0B9A\u0B9C\u0B9E-\u0B9F\u0BA3-\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60-\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0-\u0CE1\u0CF1-\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32-\u0E33\u0E40-\u0E45\u0E81-\u0E82\u0E84\u0E87-\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA-\u0EAB\u0EAD-\u0EB0\u0EB2-\u0EB3\u0EBD\u0EC0-\u0EC4\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065-\u1066\u106E-\u1070\u1075-\u1081\u108E\u10D0-\u10FA\u10FD-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17DC\u1820-\u1842\u1844-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE-\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C77\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5-\u1CF6\u2135-\u2138\u2D30-\u2D67\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3006\u303C\u3041-\u3096\u309F\u30A1-\u30FA\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA014\uA016-\uA48C\uA4D0-\uA4F7\uA500-\uA60B\uA610-\uA61F\uA62A-\uA62B\uA66E\uA6A0-\uA6E5\uA78F\uA7F7\uA7FB-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9E0-\uA9E4\uA9E7-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA6F\uAA71-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5-\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADC\uAAE0-\uAAEA\uAAF2\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40-\uFB41\uFB43-\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF66-\uFF6F\uFF71-\uFF9D\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/, an = i([
                        "\xaa",
                        "\xba",
                        "ƻ",
                        [
                            "ǀ",
                            "ǃ"
                        ],
                        "ʔ",
                        [
                            "א",
                            "ת"
                        ],
                        [
                            "װ",
                            "ײ"
                        ],
                        [
                            "ؠ",
                            "ؿ"
                        ],
                        [
                            "ف",
                            "ي"
                        ],
                        [
                            "ٮ",
                            "ٯ"
                        ],
                        [
                            "ٱ",
                            "ۓ"
                        ],
                        "ە",
                        [
                            "ۮ",
                            "ۯ"
                        ],
                        [
                            "ۺ",
                            "ۼ"
                        ],
                        "ۿ",
                        "ܐ",
                        [
                            "ܒ",
                            "ܯ"
                        ],
                        [
                            "ݍ",
                            "ޥ"
                        ],
                        "ޱ",
                        [
                            "ߊ",
                            "ߪ"
                        ],
                        [
                            "ࠀ",
                            "ࠕ"
                        ],
                        [
                            "ࡀ",
                            "ࡘ"
                        ],
                        [
                            "ࢠ",
                            "ࢴ"
                        ],
                        [
                            "ऄ",
                            "ह"
                        ],
                        "ऽ",
                        "ॐ",
                        [
                            "क़",
                            "ॡ"
                        ],
                        [
                            "ॲ",
                            "ঀ"
                        ],
                        [
                            "অ",
                            "ঌ"
                        ],
                        [
                            "এ",
                            "ঐ"
                        ],
                        [
                            "ও",
                            "ন"
                        ],
                        [
                            "প",
                            "র"
                        ],
                        "ল",
                        [
                            "শ",
                            "হ"
                        ],
                        "ঽ",
                        "ৎ",
                        [
                            "ড়",
                            "ঢ়"
                        ],
                        [
                            "য়",
                            "ৡ"
                        ],
                        [
                            "ৰ",
                            "ৱ"
                        ],
                        [
                            "ਅ",
                            "ਊ"
                        ],
                        [
                            "ਏ",
                            "ਐ"
                        ],
                        [
                            "ਓ",
                            "ਨ"
                        ],
                        [
                            "ਪ",
                            "ਰ"
                        ],
                        [
                            "ਲ",
                            "ਲ਼"
                        ],
                        [
                            "ਵ",
                            "ਸ਼"
                        ],
                        [
                            "ਸ",
                            "ਹ"
                        ],
                        [
                            "ਖ਼",
                            "ੜ"
                        ],
                        "ਫ਼",
                        [
                            "ੲ",
                            "ੴ"
                        ],
                        [
                            "અ",
                            "ઍ"
                        ],
                        [
                            "એ",
                            "ઑ"
                        ],
                        [
                            "ઓ",
                            "ન"
                        ],
                        [
                            "પ",
                            "ર"
                        ],
                        [
                            "લ",
                            "ળ"
                        ],
                        [
                            "વ",
                            "હ"
                        ],
                        "ઽ",
                        "ૐ",
                        [
                            "ૠ",
                            "ૡ"
                        ],
                        "ૹ",
                        [
                            "ଅ",
                            "ଌ"
                        ],
                        [
                            "ଏ",
                            "ଐ"
                        ],
                        [
                            "ଓ",
                            "ନ"
                        ],
                        [
                            "ପ",
                            "ର"
                        ],
                        [
                            "ଲ",
                            "ଳ"
                        ],
                        [
                            "ଵ",
                            "ହ"
                        ],
                        "ଽ",
                        [
                            "ଡ଼",
                            "ଢ଼"
                        ],
                        [
                            "ୟ",
                            "ୡ"
                        ],
                        "ୱ",
                        "ஃ",
                        [
                            "அ",
                            "ஊ"
                        ],
                        [
                            "எ",
                            "ஐ"
                        ],
                        [
                            "ஒ",
                            "க"
                        ],
                        [
                            "ங",
                            "ச"
                        ],
                        "ஜ",
                        [
                            "ஞ",
                            "ட"
                        ],
                        [
                            "ண",
                            "த"
                        ],
                        [
                            "ந",
                            "ப"
                        ],
                        [
                            "ம",
                            "ஹ"
                        ],
                        "ௐ",
                        [
                            "అ",
                            "ఌ"
                        ],
                        [
                            "ఎ",
                            "ఐ"
                        ],
                        [
                            "ఒ",
                            "న"
                        ],
                        [
                            "ప",
                            "హ"
                        ],
                        "ఽ",
                        [
                            "ౘ",
                            "ౚ"
                        ],
                        [
                            "ౠ",
                            "ౡ"
                        ],
                        [
                            "ಅ",
                            "ಌ"
                        ],
                        [
                            "ಎ",
                            "ಐ"
                        ],
                        [
                            "ಒ",
                            "ನ"
                        ],
                        [
                            "ಪ",
                            "ಳ"
                        ],
                        [
                            "ವ",
                            "ಹ"
                        ],
                        "ಽ",
                        "ೞ",
                        [
                            "ೠ",
                            "ೡ"
                        ],
                        [
                            "ೱ",
                            "ೲ"
                        ],
                        [
                            "അ",
                            "ഌ"
                        ],
                        [
                            "എ",
                            "ഐ"
                        ],
                        [
                            "ഒ",
                            "ഺ"
                        ],
                        "ഽ",
                        "ൎ",
                        [
                            "ൟ",
                            "ൡ"
                        ],
                        [
                            "ൺ",
                            "ൿ"
                        ],
                        [
                            "අ",
                            "ඖ"
                        ],
                        [
                            "ක",
                            "න"
                        ],
                        [
                            "ඳ",
                            "ර"
                        ],
                        "ල",
                        [
                            "ව",
                            "ෆ"
                        ],
                        [
                            "ก",
                            "ะ"
                        ],
                        [
                            "า",
                            "ำ"
                        ],
                        [
                            "เ",
                            "ๅ"
                        ],
                        [
                            "ກ",
                            "ຂ"
                        ],
                        "ຄ",
                        [
                            "ງ",
                            "ຈ"
                        ],
                        "ຊ",
                        "ຍ",
                        [
                            "ດ",
                            "ທ"
                        ],
                        [
                            "ນ",
                            "ຟ"
                        ],
                        [
                            "ມ",
                            "ຣ"
                        ],
                        "ລ",
                        "ວ",
                        [
                            "ສ",
                            "ຫ"
                        ],
                        [
                            "ອ",
                            "ະ"
                        ],
                        [
                            "າ",
                            "ຳ"
                        ],
                        "ຽ",
                        [
                            "ເ",
                            "ໄ"
                        ],
                        [
                            "ໜ",
                            "ໟ"
                        ],
                        "ༀ",
                        [
                            "ཀ",
                            "ཇ"
                        ],
                        [
                            "ཉ",
                            "ཬ"
                        ],
                        [
                            "ྈ",
                            "ྌ"
                        ],
                        [
                            "က",
                            "ဪ"
                        ],
                        "ဿ",
                        [
                            "ၐ",
                            "ၕ"
                        ],
                        [
                            "ၚ",
                            "ၝ"
                        ],
                        "ၡ",
                        [
                            "ၥ",
                            "ၦ"
                        ],
                        [
                            "ၮ",
                            "ၰ"
                        ],
                        [
                            "ၵ",
                            "ႁ"
                        ],
                        "ႎ",
                        [
                            "ა",
                            "ჺ"
                        ],
                        [
                            "ჽ",
                            "ቈ"
                        ],
                        [
                            "ቊ",
                            "ቍ"
                        ],
                        [
                            "ቐ",
                            "ቖ"
                        ],
                        "ቘ",
                        [
                            "ቚ",
                            "ቝ"
                        ],
                        [
                            "በ",
                            "ኈ"
                        ],
                        [
                            "ኊ",
                            "ኍ"
                        ],
                        [
                            "ነ",
                            "ኰ"
                        ],
                        [
                            "ኲ",
                            "ኵ"
                        ],
                        [
                            "ኸ",
                            "ኾ"
                        ],
                        "ዀ",
                        [
                            "ዂ",
                            "ዅ"
                        ],
                        [
                            "ወ",
                            "ዖ"
                        ],
                        [
                            "ዘ",
                            "ጐ"
                        ],
                        [
                            "ጒ",
                            "ጕ"
                        ],
                        [
                            "ጘ",
                            "ፚ"
                        ],
                        [
                            "ᎀ",
                            "ᎏ"
                        ],
                        [
                            "ᐁ",
                            "ᙬ"
                        ],
                        [
                            "ᙯ",
                            "ᙿ"
                        ],
                        [
                            "ᚁ",
                            "ᚚ"
                        ],
                        [
                            "ᚠ",
                            "ᛪ"
                        ],
                        [
                            "ᛱ",
                            "ᛸ"
                        ],
                        [
                            "ᜀ",
                            "ᜌ"
                        ],
                        [
                            "ᜎ",
                            "ᜑ"
                        ],
                        [
                            "ᜠ",
                            "ᜱ"
                        ],
                        [
                            "ᝀ",
                            "ᝑ"
                        ],
                        [
                            "ᝠ",
                            "ᝬ"
                        ],
                        [
                            "ᝮ",
                            "ᝰ"
                        ],
                        [
                            "ក",
                            "ឳ"
                        ],
                        "ៜ",
                        [
                            "ᠠ",
                            "ᡂ"
                        ],
                        [
                            "ᡄ",
                            "ᡷ"
                        ],
                        [
                            "ᢀ",
                            "ᢨ"
                        ],
                        "ᢪ",
                        [
                            "ᢰ",
                            "ᣵ"
                        ],
                        [
                            "ᤀ",
                            "ᤞ"
                        ],
                        [
                            "ᥐ",
                            "ᥭ"
                        ],
                        [
                            "ᥰ",
                            "ᥴ"
                        ],
                        [
                            "ᦀ",
                            "ᦫ"
                        ],
                        [
                            "ᦰ",
                            "ᧉ"
                        ],
                        [
                            "ᨀ",
                            "ᨖ"
                        ],
                        [
                            "ᨠ",
                            "ᩔ"
                        ],
                        [
                            "ᬅ",
                            "ᬳ"
                        ],
                        [
                            "ᭅ",
                            "ᭋ"
                        ],
                        [
                            "ᮃ",
                            "ᮠ"
                        ],
                        [
                            "ᮮ",
                            "ᮯ"
                        ],
                        [
                            "ᮺ",
                            "ᯥ"
                        ],
                        [
                            "ᰀ",
                            "ᰣ"
                        ],
                        [
                            "ᱍ",
                            "ᱏ"
                        ],
                        [
                            "ᱚ",
                            "ᱷ"
                        ],
                        [
                            "ᳩ",
                            "ᳬ"
                        ],
                        [
                            "ᳮ",
                            "ᳱ"
                        ],
                        [
                            "ᳵ",
                            "ᳶ"
                        ],
                        [
                            "ℵ",
                            "ℸ"
                        ],
                        [
                            "ⴰ",
                            "ⵧ"
                        ],
                        [
                            "ⶀ",
                            "ⶖ"
                        ],
                        [
                            "ⶠ",
                            "ⶦ"
                        ],
                        [
                            "ⶨ",
                            "ⶮ"
                        ],
                        [
                            "ⶰ",
                            "ⶶ"
                        ],
                        [
                            "ⶸ",
                            "ⶾ"
                        ],
                        [
                            "ⷀ",
                            "ⷆ"
                        ],
                        [
                            "ⷈ",
                            "ⷎ"
                        ],
                        [
                            "ⷐ",
                            "ⷖ"
                        ],
                        [
                            "ⷘ",
                            "ⷞ"
                        ],
                        "〆",
                        "〼",
                        [
                            "ぁ",
                            "ゖ"
                        ],
                        "ゟ",
                        [
                            "ァ",
                            "ヺ"
                        ],
                        "ヿ",
                        [
                            "ㄅ",
                            "ㄭ"
                        ],
                        [
                            "ㄱ",
                            "ㆎ"
                        ],
                        [
                            "ㆠ",
                            "ㆺ"
                        ],
                        [
                            "ㇰ",
                            "ㇿ"
                        ],
                        [
                            "㐀",
                            "䶵"
                        ],
                        [
                            "一",
                            "鿕"
                        ],
                        [
                            "ꀀ",
                            "ꀔ"
                        ],
                        [
                            "ꀖ",
                            "ꒌ"
                        ],
                        [
                            "ꓐ",
                            "ꓷ"
                        ],
                        [
                            "ꔀ",
                            "ꘋ"
                        ],
                        [
                            "ꘐ",
                            "ꘟ"
                        ],
                        [
                            "ꘪ",
                            "ꘫ"
                        ],
                        "ꙮ",
                        [
                            "ꚠ",
                            "ꛥ"
                        ],
                        "ꞏ",
                        "ꟷ",
                        [
                            "ꟻ",
                            "ꠁ"
                        ],
                        [
                            "ꠃ",
                            "ꠅ"
                        ],
                        [
                            "ꠇ",
                            "ꠊ"
                        ],
                        [
                            "ꠌ",
                            "ꠢ"
                        ],
                        [
                            "ꡀ",
                            "ꡳ"
                        ],
                        [
                            "ꢂ",
                            "ꢳ"
                        ],
                        [
                            "ꣲ",
                            "ꣷ"
                        ],
                        "ꣻ",
                        "ꣽ",
                        [
                            "ꤊ",
                            "ꤥ"
                        ],
                        [
                            "ꤰ",
                            "ꥆ"
                        ],
                        [
                            "ꥠ",
                            "ꥼ"
                        ],
                        [
                            "ꦄ",
                            "ꦲ"
                        ],
                        [
                            "ꧠ",
                            "ꧤ"
                        ],
                        [
                            "ꧧ",
                            "ꧯ"
                        ],
                        [
                            "ꧺ",
                            "ꧾ"
                        ],
                        [
                            "ꨀ",
                            "ꨨ"
                        ],
                        [
                            "ꩀ",
                            "ꩂ"
                        ],
                        [
                            "ꩄ",
                            "ꩋ"
                        ],
                        [
                            "ꩠ",
                            "ꩯ"
                        ],
                        [
                            "ꩱ",
                            "ꩶ"
                        ],
                        "ꩺ",
                        [
                            "ꩾ",
                            "ꪯ"
                        ],
                        "ꪱ",
                        [
                            "ꪵ",
                            "ꪶ"
                        ],
                        [
                            "ꪹ",
                            "ꪽ"
                        ],
                        "ꫀ",
                        "ꫂ",
                        [
                            "ꫛ",
                            "ꫜ"
                        ],
                        [
                            "ꫠ",
                            "ꫪ"
                        ],
                        "ꫲ",
                        [
                            "ꬁ",
                            "ꬆ"
                        ],
                        [
                            "ꬉ",
                            "ꬎ"
                        ],
                        [
                            "ꬑ",
                            "ꬖ"
                        ],
                        [
                            "ꬠ",
                            "ꬦ"
                        ],
                        [
                            "ꬨ",
                            "ꬮ"
                        ],
                        [
                            "ꯀ",
                            "ꯢ"
                        ],
                        [
                            "가",
                            "힣"
                        ],
                        [
                            "ힰ",
                            "ퟆ"
                        ],
                        [
                            "ퟋ",
                            "ퟻ"
                        ],
                        [
                            "豈",
                            "舘"
                        ],
                        [
                            "並",
                            "龎"
                        ],
                        "יִ",
                        [
                            "ײַ",
                            "ﬨ"
                        ],
                        [
                            "שׁ",
                            "זּ"
                        ],
                        [
                            "טּ",
                            "לּ"
                        ],
                        "מּ",
                        [
                            "נּ",
                            "סּ"
                        ],
                        [
                            "ףּ",
                            "פּ"
                        ],
                        [
                            "צּ",
                            "ﮱ"
                        ],
                        [
                            "ﯓ",
                            "ﴽ"
                        ],
                        [
                            "ﵐ",
                            "ﶏ"
                        ],
                        [
                            "ﶒ",
                            "ﷇ"
                        ],
                        [
                            "ﷰ",
                            "ﷻ"
                        ],
                        [
                            "ﹰ",
                            "ﹴ"
                        ],
                        [
                            "ﹶ",
                            "ﻼ"
                        ],
                        [
                            "ｦ",
                            "ｯ"
                        ],
                        [
                            "ｱ",
                            "ﾝ"
                        ],
                        [
                            "ﾠ",
                            "ﾾ"
                        ],
                        [
                            "ￂ",
                            "ￇ"
                        ],
                        [
                            "ￊ",
                            "ￏ"
                        ],
                        [
                            "ￒ",
                            "ￗ"
                        ],
                        [
                            "ￚ",
                            "ￜ"
                        ]
                    ], !1, !1), cn = /^[\u01C5\u01C8\u01CB\u01F2\u1F88-\u1F8F\u1F98-\u1F9F\u1FA8-\u1FAF\u1FBC\u1FCC\u1FFC]/, pn = i([
                        "ǅ",
                        "ǈ",
                        "ǋ",
                        "ǲ",
                        [
                            "ᾈ",
                            "ᾏ"
                        ],
                        [
                            "ᾘ",
                            "ᾟ"
                        ],
                        [
                            "ᾨ",
                            "ᾯ"
                        ],
                        "ᾼ",
                        "ῌ",
                        "ῼ"
                    ], !1, !1), An = /^[A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178-\u0179\u017B\u017D\u0181-\u0182\u0184\u0186-\u0187\u0189-\u018B\u018E-\u0191\u0193-\u0194\u0196-\u0198\u019C-\u019D\u019F-\u01A0\u01A2\u01A4\u01A6-\u01A7\u01A9\u01AC\u01AE-\u01AF\u01B1-\u01B3\u01B5\u01B7-\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A-\u023B\u023D-\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E-\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9-\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0-\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E-\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D-\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A]/, ln = i([
                        [
                            "A",
                            "Z"
                        ],
                        [
                            "\xc0",
                            "\xd6"
                        ],
                        [
                            "\xd8",
                            "\xde"
                        ],
                        "Ā",
                        "Ă",
                        "Ą",
                        "Ć",
                        "Ĉ",
                        "Ċ",
                        "Č",
                        "Ď",
                        "Đ",
                        "Ē",
                        "Ĕ",
                        "Ė",
                        "Ę",
                        "Ě",
                        "Ĝ",
                        "Ğ",
                        "Ġ",
                        "Ģ",
                        "Ĥ",
                        "Ħ",
                        "Ĩ",
                        "Ī",
                        "Ĭ",
                        "Į",
                        "İ",
                        "Ĳ",
                        "Ĵ",
                        "Ķ",
                        "Ĺ",
                        "Ļ",
                        "Ľ",
                        "Ŀ",
                        "Ł",
                        "Ń",
                        "Ņ",
                        "Ň",
                        "Ŋ",
                        "Ō",
                        "Ŏ",
                        "Ő",
                        "Œ",
                        "Ŕ",
                        "Ŗ",
                        "Ř",
                        "Ś",
                        "Ŝ",
                        "Ş",
                        "Š",
                        "Ţ",
                        "Ť",
                        "Ŧ",
                        "Ũ",
                        "Ū",
                        "Ŭ",
                        "Ů",
                        "Ű",
                        "Ų",
                        "Ŵ",
                        "Ŷ",
                        [
                            "Ÿ",
                            "Ź"
                        ],
                        "Ż",
                        "Ž",
                        [
                            "Ɓ",
                            "Ƃ"
                        ],
                        "Ƅ",
                        [
                            "Ɔ",
                            "Ƈ"
                        ],
                        [
                            "Ɖ",
                            "Ƌ"
                        ],
                        [
                            "Ǝ",
                            "Ƒ"
                        ],
                        [
                            "Ɠ",
                            "Ɣ"
                        ],
                        [
                            "Ɩ",
                            "Ƙ"
                        ],
                        [
                            "Ɯ",
                            "Ɲ"
                        ],
                        [
                            "Ɵ",
                            "Ơ"
                        ],
                        "Ƣ",
                        "Ƥ",
                        [
                            "Ʀ",
                            "Ƨ"
                        ],
                        "Ʃ",
                        "Ƭ",
                        [
                            "Ʈ",
                            "Ư"
                        ],
                        [
                            "Ʊ",
                            "Ƴ"
                        ],
                        "Ƶ",
                        [
                            "Ʒ",
                            "Ƹ"
                        ],
                        "Ƽ",
                        "Ǆ",
                        "Ǉ",
                        "Ǌ",
                        "Ǎ",
                        "Ǐ",
                        "Ǒ",
                        "Ǔ",
                        "Ǖ",
                        "Ǘ",
                        "Ǚ",
                        "Ǜ",
                        "Ǟ",
                        "Ǡ",
                        "Ǣ",
                        "Ǥ",
                        "Ǧ",
                        "Ǩ",
                        "Ǫ",
                        "Ǭ",
                        "Ǯ",
                        "Ǳ",
                        "Ǵ",
                        [
                            "Ƕ",
                            "Ǹ"
                        ],
                        "Ǻ",
                        "Ǽ",
                        "Ǿ",
                        "Ȁ",
                        "Ȃ",
                        "Ȅ",
                        "Ȇ",
                        "Ȉ",
                        "Ȋ",
                        "Ȍ",
                        "Ȏ",
                        "Ȑ",
                        "Ȓ",
                        "Ȕ",
                        "Ȗ",
                        "Ș",
                        "Ț",
                        "Ȝ",
                        "Ȟ",
                        "Ƞ",
                        "Ȣ",
                        "Ȥ",
                        "Ȧ",
                        "Ȩ",
                        "Ȫ",
                        "Ȭ",
                        "Ȯ",
                        "Ȱ",
                        "Ȳ",
                        [
                            "Ⱥ",
                            "Ȼ"
                        ],
                        [
                            "Ƚ",
                            "Ⱦ"
                        ],
                        "Ɂ",
                        [
                            "Ƀ",
                            "Ɇ"
                        ],
                        "Ɉ",
                        "Ɋ",
                        "Ɍ",
                        "Ɏ",
                        "Ͱ",
                        "Ͳ",
                        "Ͷ",
                        "Ϳ",
                        "Ά",
                        [
                            "Έ",
                            "Ί"
                        ],
                        "Ό",
                        [
                            "Ύ",
                            "Ώ"
                        ],
                        [
                            "Α",
                            "Ρ"
                        ],
                        [
                            "Σ",
                            "Ϋ"
                        ],
                        "Ϗ",
                        [
                            "ϒ",
                            "ϔ"
                        ],
                        "Ϙ",
                        "Ϛ",
                        "Ϝ",
                        "Ϟ",
                        "Ϡ",
                        "Ϣ",
                        "Ϥ",
                        "Ϧ",
                        "Ϩ",
                        "Ϫ",
                        "Ϭ",
                        "Ϯ",
                        "ϴ",
                        "Ϸ",
                        [
                            "Ϲ",
                            "Ϻ"
                        ],
                        [
                            "Ͻ",
                            "Я"
                        ],
                        "Ѡ",
                        "Ѣ",
                        "Ѥ",
                        "Ѧ",
                        "Ѩ",
                        "Ѫ",
                        "Ѭ",
                        "Ѯ",
                        "Ѱ",
                        "Ѳ",
                        "Ѵ",
                        "Ѷ",
                        "Ѹ",
                        "Ѻ",
                        "Ѽ",
                        "Ѿ",
                        "Ҁ",
                        "Ҋ",
                        "Ҍ",
                        "Ҏ",
                        "Ґ",
                        "Ғ",
                        "Ҕ",
                        "Җ",
                        "Ҙ",
                        "Қ",
                        "Ҝ",
                        "Ҟ",
                        "Ҡ",
                        "Ң",
                        "Ҥ",
                        "Ҧ",
                        "Ҩ",
                        "Ҫ",
                        "Ҭ",
                        "Ү",
                        "Ұ",
                        "Ҳ",
                        "Ҵ",
                        "Ҷ",
                        "Ҹ",
                        "Һ",
                        "Ҽ",
                        "Ҿ",
                        [
                            "Ӏ",
                            "Ӂ"
                        ],
                        "Ӄ",
                        "Ӆ",
                        "Ӈ",
                        "Ӊ",
                        "Ӌ",
                        "Ӎ",
                        "Ӑ",
                        "Ӓ",
                        "Ӕ",
                        "Ӗ",
                        "Ә",
                        "Ӛ",
                        "Ӝ",
                        "Ӟ",
                        "Ӡ",
                        "Ӣ",
                        "Ӥ",
                        "Ӧ",
                        "Ө",
                        "Ӫ",
                        "Ӭ",
                        "Ӯ",
                        "Ӱ",
                        "Ӳ",
                        "Ӵ",
                        "Ӷ",
                        "Ӹ",
                        "Ӻ",
                        "Ӽ",
                        "Ӿ",
                        "Ԁ",
                        "Ԃ",
                        "Ԅ",
                        "Ԇ",
                        "Ԉ",
                        "Ԋ",
                        "Ԍ",
                        "Ԏ",
                        "Ԑ",
                        "Ԓ",
                        "Ԕ",
                        "Ԗ",
                        "Ԙ",
                        "Ԛ",
                        "Ԝ",
                        "Ԟ",
                        "Ԡ",
                        "Ԣ",
                        "Ԥ",
                        "Ԧ",
                        "Ԩ",
                        "Ԫ",
                        "Ԭ",
                        "Ԯ",
                        [
                            "Ա",
                            "Ֆ"
                        ],
                        [
                            "Ⴀ",
                            "Ⴥ"
                        ],
                        "Ⴧ",
                        "Ⴭ",
                        [
                            "Ꭰ",
                            "Ᏽ"
                        ],
                        "Ḁ",
                        "Ḃ",
                        "Ḅ",
                        "Ḇ",
                        "Ḉ",
                        "Ḋ",
                        "Ḍ",
                        "Ḏ",
                        "Ḑ",
                        "Ḓ",
                        "Ḕ",
                        "Ḗ",
                        "Ḙ",
                        "Ḛ",
                        "Ḝ",
                        "Ḟ",
                        "Ḡ",
                        "Ḣ",
                        "Ḥ",
                        "Ḧ",
                        "Ḩ",
                        "Ḫ",
                        "Ḭ",
                        "Ḯ",
                        "Ḱ",
                        "Ḳ",
                        "Ḵ",
                        "Ḷ",
                        "Ḹ",
                        "Ḻ",
                        "Ḽ",
                        "Ḿ",
                        "Ṁ",
                        "Ṃ",
                        "Ṅ",
                        "Ṇ",
                        "Ṉ",
                        "Ṋ",
                        "Ṍ",
                        "Ṏ",
                        "Ṑ",
                        "Ṓ",
                        "Ṕ",
                        "Ṗ",
                        "Ṙ",
                        "Ṛ",
                        "Ṝ",
                        "Ṟ",
                        "Ṡ",
                        "Ṣ",
                        "Ṥ",
                        "Ṧ",
                        "Ṩ",
                        "Ṫ",
                        "Ṭ",
                        "Ṯ",
                        "Ṱ",
                        "Ṳ",
                        "Ṵ",
                        "Ṷ",
                        "Ṹ",
                        "Ṻ",
                        "Ṽ",
                        "Ṿ",
                        "Ẁ",
                        "Ẃ",
                        "Ẅ",
                        "Ẇ",
                        "Ẉ",
                        "Ẋ",
                        "Ẍ",
                        "Ẏ",
                        "Ẑ",
                        "Ẓ",
                        "Ẕ",
                        "ẞ",
                        "Ạ",
                        "Ả",
                        "Ấ",
                        "Ầ",
                        "Ẩ",
                        "Ẫ",
                        "Ậ",
                        "Ắ",
                        "Ằ",
                        "Ẳ",
                        "Ẵ",
                        "Ặ",
                        "Ẹ",
                        "Ẻ",
                        "Ẽ",
                        "Ế",
                        "Ề",
                        "Ể",
                        "Ễ",
                        "Ệ",
                        "Ỉ",
                        "Ị",
                        "Ọ",
                        "Ỏ",
                        "Ố",
                        "Ồ",
                        "Ổ",
                        "Ỗ",
                        "Ộ",
                        "Ớ",
                        "Ờ",
                        "Ở",
                        "Ỡ",
                        "Ợ",
                        "Ụ",
                        "Ủ",
                        "Ứ",
                        "Ừ",
                        "Ử",
                        "Ữ",
                        "Ự",
                        "Ỳ",
                        "Ỵ",
                        "Ỷ",
                        "Ỹ",
                        "Ỻ",
                        "Ỽ",
                        "Ỿ",
                        [
                            "Ἀ",
                            "Ἇ"
                        ],
                        [
                            "Ἐ",
                            "Ἕ"
                        ],
                        [
                            "Ἠ",
                            "Ἧ"
                        ],
                        [
                            "Ἰ",
                            "Ἷ"
                        ],
                        [
                            "Ὀ",
                            "Ὅ"
                        ],
                        "Ὑ",
                        "Ὓ",
                        "Ὕ",
                        "Ὗ",
                        [
                            "Ὠ",
                            "Ὧ"
                        ],
                        [
                            "Ᾰ",
                            "Ά"
                        ],
                        [
                            "Ὲ",
                            "Ή"
                        ],
                        [
                            "Ῐ",
                            "Ί"
                        ],
                        [
                            "Ῠ",
                            "Ῥ"
                        ],
                        [
                            "Ὸ",
                            "Ώ"
                        ],
                        "ℂ",
                        "ℇ",
                        [
                            "ℋ",
                            "ℍ"
                        ],
                        [
                            "ℐ",
                            "ℒ"
                        ],
                        "ℕ",
                        [
                            "ℙ",
                            "ℝ"
                        ],
                        "ℤ",
                        "Ω",
                        "ℨ",
                        [
                            "K",
                            "ℭ"
                        ],
                        [
                            "ℰ",
                            "ℳ"
                        ],
                        [
                            "ℾ",
                            "ℿ"
                        ],
                        "ⅅ",
                        "Ↄ",
                        [
                            "Ⰰ",
                            "Ⱞ"
                        ],
                        "Ⱡ",
                        [
                            "Ɫ",
                            "Ɽ"
                        ],
                        "Ⱨ",
                        "Ⱪ",
                        "Ⱬ",
                        [
                            "Ɑ",
                            "Ɒ"
                        ],
                        "Ⱳ",
                        "Ⱶ",
                        [
                            "Ȿ",
                            "Ⲁ"
                        ],
                        "Ⲃ",
                        "Ⲅ",
                        "Ⲇ",
                        "Ⲉ",
                        "Ⲋ",
                        "Ⲍ",
                        "Ⲏ",
                        "Ⲑ",
                        "Ⲓ",
                        "Ⲕ",
                        "Ⲗ",
                        "Ⲙ",
                        "Ⲛ",
                        "Ⲝ",
                        "Ⲟ",
                        "Ⲡ",
                        "Ⲣ",
                        "Ⲥ",
                        "Ⲧ",
                        "Ⲩ",
                        "Ⲫ",
                        "Ⲭ",
                        "Ⲯ",
                        "Ⲱ",
                        "Ⲳ",
                        "Ⲵ",
                        "Ⲷ",
                        "Ⲹ",
                        "Ⲻ",
                        "Ⲽ",
                        "Ⲿ",
                        "Ⳁ",
                        "Ⳃ",
                        "Ⳅ",
                        "Ⳇ",
                        "Ⳉ",
                        "Ⳋ",
                        "Ⳍ",
                        "Ⳏ",
                        "Ⳑ",
                        "Ⳓ",
                        "Ⳕ",
                        "Ⳗ",
                        "Ⳙ",
                        "Ⳛ",
                        "Ⳝ",
                        "Ⳟ",
                        "Ⳡ",
                        "Ⳣ",
                        "Ⳬ",
                        "Ⳮ",
                        "Ⳳ",
                        "Ꙁ",
                        "Ꙃ",
                        "Ꙅ",
                        "Ꙇ",
                        "Ꙉ",
                        "Ꙋ",
                        "Ꙍ",
                        "Ꙏ",
                        "Ꙑ",
                        "Ꙓ",
                        "Ꙕ",
                        "Ꙗ",
                        "Ꙙ",
                        "Ꙛ",
                        "Ꙝ",
                        "Ꙟ",
                        "Ꙡ",
                        "Ꙣ",
                        "Ꙥ",
                        "Ꙧ",
                        "Ꙩ",
                        "Ꙫ",
                        "Ꙭ",
                        "Ꚁ",
                        "Ꚃ",
                        "Ꚅ",
                        "Ꚇ",
                        "Ꚉ",
                        "Ꚋ",
                        "Ꚍ",
                        "Ꚏ",
                        "Ꚑ",
                        "Ꚓ",
                        "Ꚕ",
                        "Ꚗ",
                        "Ꚙ",
                        "Ꚛ",
                        "Ꜣ",
                        "Ꜥ",
                        "Ꜧ",
                        "Ꜩ",
                        "Ꜫ",
                        "Ꜭ",
                        "Ꜯ",
                        "Ꜳ",
                        "Ꜵ",
                        "Ꜷ",
                        "Ꜹ",
                        "Ꜻ",
                        "Ꜽ",
                        "Ꜿ",
                        "Ꝁ",
                        "Ꝃ",
                        "Ꝅ",
                        "Ꝇ",
                        "Ꝉ",
                        "Ꝋ",
                        "Ꝍ",
                        "Ꝏ",
                        "Ꝑ",
                        "Ꝓ",
                        "Ꝕ",
                        "Ꝗ",
                        "Ꝙ",
                        "Ꝛ",
                        "Ꝝ",
                        "Ꝟ",
                        "Ꝡ",
                        "Ꝣ",
                        "Ꝥ",
                        "Ꝧ",
                        "Ꝩ",
                        "Ꝫ",
                        "Ꝭ",
                        "Ꝯ",
                        "Ꝺ",
                        "Ꝼ",
                        [
                            "Ᵹ",
                            "Ꝿ"
                        ],
                        "Ꞁ",
                        "Ꞃ",
                        "Ꞅ",
                        "Ꞇ",
                        "Ꞌ",
                        "Ɥ",
                        "Ꞑ",
                        "Ꞓ",
                        "Ꞗ",
                        "Ꞙ",
                        "Ꞛ",
                        "Ꞝ",
                        "Ꞟ",
                        "Ꞡ",
                        "Ꞣ",
                        "Ꞥ",
                        "Ꞧ",
                        "Ꞩ",
                        [
                            "Ɦ",
                            "Ɬ"
                        ],
                        [
                            "Ʞ",
                            "Ꞵ"
                        ],
                        "Ꞷ",
                        [
                            "Ａ",
                            "Ｚ"
                        ]
                    ], !1, !1), En = /^[\u0903\u093B\u093E-\u0940\u0949-\u094C\u094E-\u094F\u0982-\u0983\u09BE-\u09C0\u09C7-\u09C8\u09CB-\u09CC\u09D7\u0A03\u0A3E-\u0A40\u0A83\u0ABE-\u0AC0\u0AC9\u0ACB-\u0ACC\u0B02-\u0B03\u0B3E\u0B40\u0B47-\u0B48\u0B4B-\u0B4C\u0B57\u0BBE-\u0BBF\u0BC1-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCC\u0BD7\u0C01-\u0C03\u0C41-\u0C44\u0C82-\u0C83\u0CBE\u0CC0-\u0CC4\u0CC7-\u0CC8\u0CCA-\u0CCB\u0CD5-\u0CD6\u0D02-\u0D03\u0D3E-\u0D40\u0D46-\u0D48\u0D4A-\u0D4C\u0D57\u0D82-\u0D83\u0DCF-\u0DD1\u0DD8-\u0DDF\u0DF2-\u0DF3\u0F3E-\u0F3F\u0F7F\u102B-\u102C\u1031\u1038\u103B-\u103C\u1056-\u1057\u1062-\u1064\u1067-\u106D\u1083-\u1084\u1087-\u108C\u108F\u109A-\u109C\u17B6\u17BE-\u17C5\u17C7-\u17C8\u1923-\u1926\u1929-\u192B\u1930-\u1931\u1933-\u1938\u1A19-\u1A1A\u1A55\u1A57\u1A61\u1A63-\u1A64\u1A6D-\u1A72\u1B04\u1B35\u1B3B\u1B3D-\u1B41\u1B43-\u1B44\u1B82\u1BA1\u1BA6-\u1BA7\u1BAA\u1BE7\u1BEA-\u1BEC\u1BEE\u1BF2-\u1BF3\u1C24-\u1C2B\u1C34-\u1C35\u1CE1\u1CF2-\u1CF3\u302E-\u302F\uA823-\uA824\uA827\uA880-\uA881\uA8B4-\uA8C3\uA952-\uA953\uA983\uA9B4-\uA9B5\uA9BA-\uA9BB\uA9BD-\uA9C0\uAA2F-\uAA30\uAA33-\uAA34\uAA4D\uAA7B\uAA7D\uAAEB\uAAEE-\uAAEF\uAAF5\uABE3-\uABE4\uABE6-\uABE7\uABE9-\uABEA\uABEC]/, Cn = i([
                        "ः",
                        "ऻ",
                        [
                            "ा",
                            "ी"
                        ],
                        [
                            "ॉ",
                            "ौ"
                        ],
                        [
                            "ॎ",
                            "ॏ"
                        ],
                        [
                            "ং",
                            "ঃ"
                        ],
                        [
                            "া",
                            "ী"
                        ],
                        [
                            "ে",
                            "ৈ"
                        ],
                        [
                            "ো",
                            "ৌ"
                        ],
                        "ৗ",
                        "ਃ",
                        [
                            "ਾ",
                            "ੀ"
                        ],
                        "ઃ",
                        [
                            "ા",
                            "ી"
                        ],
                        "ૉ",
                        [
                            "ો",
                            "ૌ"
                        ],
                        [
                            "ଂ",
                            "ଃ"
                        ],
                        "ା",
                        "ୀ",
                        [
                            "େ",
                            "ୈ"
                        ],
                        [
                            "ୋ",
                            "ୌ"
                        ],
                        "ୗ",
                        [
                            "ா",
                            "ி"
                        ],
                        [
                            "ு",
                            "ூ"
                        ],
                        [
                            "ெ",
                            "ை"
                        ],
                        [
                            "ொ",
                            "ௌ"
                        ],
                        "ௗ",
                        [
                            "ఁ",
                            "ః"
                        ],
                        [
                            "ు",
                            "ౄ"
                        ],
                        [
                            "ಂ",
                            "ಃ"
                        ],
                        "ಾ",
                        [
                            "ೀ",
                            "ೄ"
                        ],
                        [
                            "ೇ",
                            "ೈ"
                        ],
                        [
                            "ೊ",
                            "ೋ"
                        ],
                        [
                            "ೕ",
                            "ೖ"
                        ],
                        [
                            "ം",
                            "ഃ"
                        ],
                        [
                            "ാ",
                            "ീ"
                        ],
                        [
                            "െ",
                            "ൈ"
                        ],
                        [
                            "ൊ",
                            "ൌ"
                        ],
                        "ൗ",
                        [
                            "ං",
                            "ඃ"
                        ],
                        [
                            "ා",
                            "ෑ"
                        ],
                        [
                            "ෘ",
                            "ෟ"
                        ],
                        [
                            "ෲ",
                            "ෳ"
                        ],
                        [
                            "༾",
                            "༿"
                        ],
                        "ཿ",
                        [
                            "ါ",
                            "ာ"
                        ],
                        "ေ",
                        "း",
                        [
                            "ျ",
                            "ြ"
                        ],
                        [
                            "ၖ",
                            "ၗ"
                        ],
                        [
                            "ၢ",
                            "ၤ"
                        ],
                        [
                            "ၧ",
                            "ၭ"
                        ],
                        [
                            "ႃ",
                            "ႄ"
                        ],
                        [
                            "ႇ",
                            "ႌ"
                        ],
                        "ႏ",
                        [
                            "ႚ",
                            "ႜ"
                        ],
                        "ា",
                        [
                            "ើ",
                            "ៅ"
                        ],
                        [
                            "ះ",
                            "ៈ"
                        ],
                        [
                            "ᤣ",
                            "ᤦ"
                        ],
                        [
                            "ᤩ",
                            "ᤫ"
                        ],
                        [
                            "ᤰ",
                            "ᤱ"
                        ],
                        [
                            "ᤳ",
                            "ᤸ"
                        ],
                        [
                            "ᨙ",
                            "ᨚ"
                        ],
                        "ᩕ",
                        "ᩗ",
                        "ᩡ",
                        [
                            "ᩣ",
                            "ᩤ"
                        ],
                        [
                            "ᩭ",
                            "ᩲ"
                        ],
                        "ᬄ",
                        "ᬵ",
                        "ᬻ",
                        [
                            "ᬽ",
                            "ᭁ"
                        ],
                        [
                            "ᭃ",
                            "᭄"
                        ],
                        "ᮂ",
                        "ᮡ",
                        [
                            "ᮦ",
                            "ᮧ"
                        ],
                        "᮪",
                        "ᯧ",
                        [
                            "ᯪ",
                            "ᯬ"
                        ],
                        "ᯮ",
                        [
                            "᯲",
                            "᯳"
                        ],
                        [
                            "ᰤ",
                            "ᰫ"
                        ],
                        [
                            "ᰴ",
                            "ᰵ"
                        ],
                        "᳡",
                        [
                            "ᳲ",
                            "ᳳ"
                        ],
                        [
                            "〮",
                            "〯"
                        ],
                        [
                            "ꠣ",
                            "ꠤ"
                        ],
                        "ꠧ",
                        [
                            "ꢀ",
                            "ꢁ"
                        ],
                        [
                            "ꢴ",
                            "ꣃ"
                        ],
                        [
                            "ꥒ",
                            "꥓"
                        ],
                        "ꦃ",
                        [
                            "ꦴ",
                            "ꦵ"
                        ],
                        [
                            "ꦺ",
                            "ꦻ"
                        ],
                        [
                            "ꦽ",
                            "꧀"
                        ],
                        [
                            "ꨯ",
                            "ꨰ"
                        ],
                        [
                            "ꨳ",
                            "ꨴ"
                        ],
                        "ꩍ",
                        "ꩻ",
                        "ꩽ",
                        "ꫫ",
                        [
                            "ꫮ",
                            "ꫯ"
                        ],
                        "ꫵ",
                        [
                            "ꯣ",
                            "ꯤ"
                        ],
                        [
                            "ꯦ",
                            "ꯧ"
                        ],
                        [
                            "ꯩ",
                            "ꯪ"
                        ],
                        "꯬"
                    ], !1, !1), fn = /^[\u0300-\u036F\u0483-\u0487\u0591-\u05BD\u05BF\u05C1-\u05C2\u05C4-\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7-\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962-\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2-\u09E3\u0A01-\u0A02\u0A3C\u0A41-\u0A42\u0A47-\u0A48\u0A4B-\u0A4D\u0A51\u0A70-\u0A71\u0A75\u0A81-\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7-\u0AC8\u0ACD\u0AE2-\u0AE3\u0B01\u0B3C\u0B3F\u0B41-\u0B44\u0B4D\u0B56\u0B62-\u0B63\u0B82\u0BC0\u0BCD\u0C00\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55-\u0C56\u0C62-\u0C63\u0C81\u0CBC\u0CBF\u0CC6\u0CCC-\u0CCD\u0CE2-\u0CE3\u0D01\u0D41-\u0D44\u0D4D\u0D62-\u0D63\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB-\u0EBC\u0EC8-\u0ECD\u0F18-\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86-\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039-\u103A\u103D-\u103E\u1058-\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085-\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752-\u1753\u1772-\u1773\u17B4-\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u18A9\u1920-\u1922\u1927-\u1928\u1932\u1939-\u193B\u1A17-\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ABD\u1B00-\u1B03\u1B34\u1B36-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80-\u1B81\u1BA2-\u1BA5\u1BA8-\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8-\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8-\u1CF9\u1DC0-\u1DF5\u1DFC-\u1DFF\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302D\u3099-\u309A\uA66F\uA674-\uA67D\uA69E-\uA69F\uA6F0-\uA6F1\uA802\uA806\uA80B\uA825-\uA826\uA8C4\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9E5\uAA29-\uAA2E\uAA31-\uAA32\uAA35-\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7-\uAAB8\uAABE-\uAABF\uAAC1\uAAEC-\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F]/, Fn = i([
                        [
                            "̀",
                            "ͯ"
                        ],
                        [
                            "҃",
                            "҇"
                        ],
                        [
                            "֑",
                            "ֽ"
                        ],
                        "ֿ",
                        [
                            "ׁ",
                            "ׂ"
                        ],
                        [
                            "ׄ",
                            "ׅ"
                        ],
                        "ׇ",
                        [
                            "ؐ",
                            "ؚ"
                        ],
                        [
                            "ً",
                            "ٟ"
                        ],
                        "ٰ",
                        [
                            "ۖ",
                            "ۜ"
                        ],
                        [
                            "۟",
                            "ۤ"
                        ],
                        [
                            "ۧ",
                            "ۨ"
                        ],
                        [
                            "۪",
                            "ۭ"
                        ],
                        "ܑ",
                        [
                            "ܰ",
                            "݊"
                        ],
                        [
                            "ަ",
                            "ް"
                        ],
                        [
                            "߫",
                            "߳"
                        ],
                        [
                            "ࠖ",
                            "࠙"
                        ],
                        [
                            "ࠛ",
                            "ࠣ"
                        ],
                        [
                            "ࠥ",
                            "ࠧ"
                        ],
                        [
                            "ࠩ",
                            "࠭"
                        ],
                        [
                            "࡙",
                            "࡛"
                        ],
                        [
                            "ࣣ",
                            "ं"
                        ],
                        "ऺ",
                        "़",
                        [
                            "ु",
                            "ै"
                        ],
                        "्",
                        [
                            "॑",
                            "ॗ"
                        ],
                        [
                            "ॢ",
                            "ॣ"
                        ],
                        "ঁ",
                        "়",
                        [
                            "ু",
                            "ৄ"
                        ],
                        "্",
                        [
                            "ৢ",
                            "ৣ"
                        ],
                        [
                            "ਁ",
                            "ਂ"
                        ],
                        "਼",
                        [
                            "ੁ",
                            "ੂ"
                        ],
                        [
                            "ੇ",
                            "ੈ"
                        ],
                        [
                            "ੋ",
                            "੍"
                        ],
                        "ੑ",
                        [
                            "ੰ",
                            "ੱ"
                        ],
                        "ੵ",
                        [
                            "ઁ",
                            "ં"
                        ],
                        "઼",
                        [
                            "ુ",
                            "ૅ"
                        ],
                        [
                            "ે",
                            "ૈ"
                        ],
                        "્",
                        [
                            "ૢ",
                            "ૣ"
                        ],
                        "ଁ",
                        "଼",
                        "ି",
                        [
                            "ୁ",
                            "ୄ"
                        ],
                        "୍",
                        "ୖ",
                        [
                            "ୢ",
                            "ୣ"
                        ],
                        "ஂ",
                        "ீ",
                        "்",
                        "ఀ",
                        [
                            "ా",
                            "ీ"
                        ],
                        [
                            "ె",
                            "ై"
                        ],
                        [
                            "ొ",
                            "్"
                        ],
                        [
                            "ౕ",
                            "ౖ"
                        ],
                        [
                            "ౢ",
                            "ౣ"
                        ],
                        "ಁ",
                        "಼",
                        "ಿ",
                        "ೆ",
                        [
                            "ೌ",
                            "್"
                        ],
                        [
                            "ೢ",
                            "ೣ"
                        ],
                        "ഁ",
                        [
                            "ു",
                            "ൄ"
                        ],
                        "്",
                        [
                            "ൢ",
                            "ൣ"
                        ],
                        "්",
                        [
                            "ි",
                            "ු"
                        ],
                        "ූ",
                        "ั",
                        [
                            "ิ",
                            "ฺ"
                        ],
                        [
                            "็",
                            "๎"
                        ],
                        "ັ",
                        [
                            "ິ",
                            "ູ"
                        ],
                        [
                            "ົ",
                            "ຼ"
                        ],
                        [
                            "່",
                            "ໍ"
                        ],
                        [
                            "༘",
                            "༙"
                        ],
                        "༵",
                        "༷",
                        "༹",
                        [
                            "ཱ",
                            "ཾ"
                        ],
                        [
                            "ྀ",
                            "྄"
                        ],
                        [
                            "྆",
                            "྇"
                        ],
                        [
                            "ྍ",
                            "ྗ"
                        ],
                        [
                            "ྙ",
                            "ྼ"
                        ],
                        "࿆",
                        [
                            "ိ",
                            "ူ"
                        ],
                        [
                            "ဲ",
                            "့"
                        ],
                        [
                            "္",
                            "်"
                        ],
                        [
                            "ွ",
                            "ှ"
                        ],
                        [
                            "ၘ",
                            "ၙ"
                        ],
                        [
                            "ၞ",
                            "ၠ"
                        ],
                        [
                            "ၱ",
                            "ၴ"
                        ],
                        "ႂ",
                        [
                            "ႅ",
                            "ႆ"
                        ],
                        "ႍ",
                        "ႝ",
                        [
                            "፝",
                            "፟"
                        ],
                        [
                            "ᜒ",
                            "᜔"
                        ],
                        [
                            "ᜲ",
                            "᜴"
                        ],
                        [
                            "ᝒ",
                            "ᝓ"
                        ],
                        [
                            "ᝲ",
                            "ᝳ"
                        ],
                        [
                            "឴",
                            "឵"
                        ],
                        [
                            "ិ",
                            "ួ"
                        ],
                        "ំ",
                        [
                            "៉",
                            "៓"
                        ],
                        "៝",
                        [
                            "᠋",
                            "᠍"
                        ],
                        "ᢩ",
                        [
                            "ᤠ",
                            "ᤢ"
                        ],
                        [
                            "ᤧ",
                            "ᤨ"
                        ],
                        "ᤲ",
                        [
                            "᤹",
                            "᤻"
                        ],
                        [
                            "ᨗ",
                            "ᨘ"
                        ],
                        "ᨛ",
                        "ᩖ",
                        [
                            "ᩘ",
                            "ᩞ"
                        ],
                        "᩠",
                        "ᩢ",
                        [
                            "ᩥ",
                            "ᩬ"
                        ],
                        [
                            "ᩳ",
                            "᩼"
                        ],
                        "᩿",
                        [
                            "᪰",
                            "᪽"
                        ],
                        [
                            "ᬀ",
                            "ᬃ"
                        ],
                        "᬴",
                        [
                            "ᬶ",
                            "ᬺ"
                        ],
                        "ᬼ",
                        "ᭂ",
                        [
                            "᭫",
                            "᭳"
                        ],
                        [
                            "ᮀ",
                            "ᮁ"
                        ],
                        [
                            "ᮢ",
                            "ᮥ"
                        ],
                        [
                            "ᮨ",
                            "ᮩ"
                        ],
                        [
                            "᮫",
                            "ᮭ"
                        ],
                        "᯦",
                        [
                            "ᯨ",
                            "ᯩ"
                        ],
                        "ᯭ",
                        [
                            "ᯯ",
                            "ᯱ"
                        ],
                        [
                            "ᰬ",
                            "ᰳ"
                        ],
                        [
                            "ᰶ",
                            "᰷"
                        ],
                        [
                            "᳐",
                            "᳒"
                        ],
                        [
                            "᳔",
                            "᳠"
                        ],
                        [
                            "᳢",
                            "᳨"
                        ],
                        "᳭",
                        "᳴",
                        [
                            "᳸",
                            "᳹"
                        ],
                        [
                            "᷀",
                            "᷵"
                        ],
                        [
                            "᷼",
                            "᷿"
                        ],
                        [
                            "⃐",
                            "⃜"
                        ],
                        "⃡",
                        [
                            "⃥",
                            "⃰"
                        ],
                        [
                            "⳯",
                            "⳱"
                        ],
                        "⵿",
                        [
                            "ⷠ",
                            "ⷿ"
                        ],
                        [
                            "〪",
                            "〭"
                        ],
                        [
                            "゙",
                            "゚"
                        ],
                        "꙯",
                        [
                            "ꙴ",
                            "꙽"
                        ],
                        [
                            "ꚞ",
                            "ꚟ"
                        ],
                        [
                            "꛰",
                            "꛱"
                        ],
                        "ꠂ",
                        "꠆",
                        "ꠋ",
                        [
                            "ꠥ",
                            "ꠦ"
                        ],
                        "꣄",
                        [
                            "꣠",
                            "꣱"
                        ],
                        [
                            "ꤦ",
                            "꤭"
                        ],
                        [
                            "ꥇ",
                            "ꥑ"
                        ],
                        [
                            "ꦀ",
                            "ꦂ"
                        ],
                        "꦳",
                        [
                            "ꦶ",
                            "ꦹ"
                        ],
                        "ꦼ",
                        "ꧥ",
                        [
                            "ꨩ",
                            "ꨮ"
                        ],
                        [
                            "ꨱ",
                            "ꨲ"
                        ],
                        [
                            "ꨵ",
                            "ꨶ"
                        ],
                        "ꩃ",
                        "ꩌ",
                        "ꩼ",
                        "ꪰ",
                        [
                            "ꪲ",
                            "ꪴ"
                        ],
                        [
                            "ꪷ",
                            "ꪸ"
                        ],
                        [
                            "ꪾ",
                            "꪿"
                        ],
                        "꫁",
                        [
                            "ꫬ",
                            "ꫭ"
                        ],
                        "꫶",
                        "ꯥ",
                        "ꯨ",
                        "꯭",
                        "ﬞ",
                        [
                            "︀",
                            "️"
                        ],
                        [
                            "︠",
                            "︯"
                        ]
                    ], !1, !1), dn = /^[0-9\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0BE6-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F29\u1040-\u1049\u1090-\u1099\u17E0-\u17E9\u1810-\u1819\u1946-\u194F\u19D0-\u19D9\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\uA620-\uA629\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]/, hn = i([
                        [
                            "0",
                            "9"
                        ],
                        [
                            "٠",
                            "٩"
                        ],
                        [
                            "۰",
                            "۹"
                        ],
                        [
                            "߀",
                            "߉"
                        ],
                        [
                            "०",
                            "९"
                        ],
                        [
                            "০",
                            "৯"
                        ],
                        [
                            "੦",
                            "੯"
                        ],
                        [
                            "૦",
                            "૯"
                        ],
                        [
                            "୦",
                            "୯"
                        ],
                        [
                            "௦",
                            "௯"
                        ],
                        [
                            "౦",
                            "౯"
                        ],
                        [
                            "೦",
                            "೯"
                        ],
                        [
                            "൦",
                            "൯"
                        ],
                        [
                            "෦",
                            "෯"
                        ],
                        [
                            "๐",
                            "๙"
                        ],
                        [
                            "໐",
                            "໙"
                        ],
                        [
                            "༠",
                            "༩"
                        ],
                        [
                            "၀",
                            "၉"
                        ],
                        [
                            "႐",
                            "႙"
                        ],
                        [
                            "០",
                            "៩"
                        ],
                        [
                            "᠐",
                            "᠙"
                        ],
                        [
                            "᥆",
                            "᥏"
                        ],
                        [
                            "᧐",
                            "᧙"
                        ],
                        [
                            "᪀",
                            "᪉"
                        ],
                        [
                            "᪐",
                            "᪙"
                        ],
                        [
                            "᭐",
                            "᭙"
                        ],
                        [
                            "᮰",
                            "᮹"
                        ],
                        [
                            "᱀",
                            "᱉"
                        ],
                        [
                            "᱐",
                            "᱙"
                        ],
                        [
                            "꘠",
                            "꘩"
                        ],
                        [
                            "꣐",
                            "꣙"
                        ],
                        [
                            "꤀",
                            "꤉"
                        ],
                        [
                            "꧐",
                            "꧙"
                        ],
                        [
                            "꧰",
                            "꧹"
                        ],
                        [
                            "꩐",
                            "꩙"
                        ],
                        [
                            "꯰",
                            "꯹"
                        ],
                        [
                            "０",
                            "９"
                        ]
                    ], !1, !1), gn = /^[\u16EE-\u16F0\u2160-\u2182\u2185-\u2188\u3007\u3021-\u3029\u3038-\u303A\uA6E6-\uA6EF]/, Dn = i([
                        [
                            "ᛮ",
                            "ᛰ"
                        ],
                        [
                            "Ⅰ",
                            "ↂ"
                        ],
                        [
                            "ↅ",
                            "ↈ"
                        ],
                        "〇",
                        [
                            "〡",
                            "〩"
                        ],
                        [
                            "〸",
                            "〺"
                        ],
                        [
                            "ꛦ",
                            "ꛯ"
                        ]
                    ], !1, !1), Bn = /^[_\u203F-\u2040\u2054\uFE33-\uFE34\uFE4D-\uFE4F\uFF3F]/, vn = i([
                        "_",
                        [
                            "‿",
                            "⁀"
                        ],
                        "⁔",
                        [
                            "︳",
                            "︴"
                        ],
                        [
                            "﹍",
                            "﹏"
                        ],
                        "＿"
                    ], !1, !1), mn = /^[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/, bn = i([
                        " ",
                        " ",
                        " ",
                        [
                            " ",
                            " "
                        ],
                        " ",
                        " ",
                        "　"
                    ], !1, !1), xn = "break", Pn = s("break", !1), _n = "case", yn = s("case", !1), $n = "catch", Rn = s("catch", !1), kn = "class", Sn = s("class", !1), In = "const", On = s("const", !1), jn = "continue", Ln = s("continue", !1), wn = "debugger", Tn = s("debugger", !1), Nn = "default", Un = s("default", !1), Hn = "delete", qn = s("delete", !1), zn = "do", Mn = s("do", !1), Gn = "else", Vn = s("else", !1), Yn = "enum", Wn = s("enum", !1), Xn = "export", Jn = s("export", !1), Zn = "extends", Kn = s("extends", !1), Qn = "false", uo = s("false", !1), eo = "finally", to = s("finally", !1), ro = "for", no = s("for", !1), oo = "function", so = s("function", !1), io = "if", ao = s("if", !1), co = "import", po = s("import", !1), Ao = "instanceof", lo = s("instanceof", !1), Eo = "in", Co = s("in", !1), fo = "new", Fo = s("new", !1), ho = "null", go = s("null", !1), Do = "return", Bo = s("return", !1), vo = "super", mo = s("super", !1), bo = "switch", xo = s("switch", !1), Po = "this", _o = s("this", !1), yo = "throw", $o = s("throw", !1), Ro = "true", ko = s("true", !1), So = "try", Io = s("try", !1), Oo = "typeof", jo = s("typeof", !1), Lo = "var", wo = s("var", !1), To = "void", No = s("void", !1), Uo = "while", Ho = s("while", !1), qo = "with", zo = s("with", !1), Mo = ";", Go = s(";", !1), Vo = 0, Yo = 0, Wo = [
                        {
                            line: 1,
                            column: 1
                        }
                    ], Xo = 0, Jo = [], Zo = 0;
                    if ("startRule" in e) {
                        if (!(e.startRule in he)) throw new Error("Can't start parsing from rule \"" + e.startRule + '".');
                        ge = he[e.startRule];
                    }
                    var Ko = {
                        $: "text",
                        "&": "simple_and",
                        "!": "simple_not"
                    }, Qo = {
                        "?": "optional",
                        "*": "zero_or_more",
                        "+": "one_or_more"
                    }, us = {
                        "&": "semantic_and",
                        "!": "semantic_not"
                    };
                    if (Fe = ge(), Fe !== de && Vo === u.length) return Fe;
                    throw Fe !== de && Vo < u.length && E(c()), f(Jo, Xo < u.length ? u.charAt(Xo) : null, Xo < u.length ? l(Xo, Xo + 1) : l(Xo, Xo));
                }
                r(n, Error), n.buildMessage = function(u, e) {
                    function t(u) {
                        return u.charCodeAt(0).toString(16).toUpperCase();
                    }
                    function r(u) {
                        return u.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(u) {
                            return "\\x0" + t(u);
                        }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(u) {
                            return "\\x" + t(u);
                        });
                    }
                    function n(u) {
                        return u.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(u) {
                            return "\\x0" + t(u);
                        }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(u) {
                            return "\\x" + t(u);
                        });
                    }
                    function o(u) {
                        return a[u.type](u);
                    }
                    function s(u) {
                        var e, t, r = new Array(u.length);
                        for(e = 0; e < u.length; e++)r[e] = o(u[e]);
                        if (r.sort(), r.length > 0) {
                            for(e = 1, t = 1; e < r.length; e++)r[e - 1] !== r[e] && (r[t] = r[e], t++);
                            r.length = t;
                        }
                        switch(r.length){
                            case 1:
                                return r[0];
                            case 2:
                                return r[0] + " or " + r[1];
                            default:
                                return r.slice(0, -1).join(", ") + ", or " + r[r.length - 1];
                        }
                    }
                    function i(u) {
                        return u ? '"' + r(u) + '"' : "end of input";
                    }
                    var a = {
                        literal: function(u) {
                            return '"' + r(u.text) + '"';
                        },
                        class: function(u) {
                            var e, t = "";
                            for(e = 0; e < u.parts.length; e++)t += u.parts[e] instanceof Array ? n(u.parts[e][0]) + "-" + n(u.parts[e][1]) : n(u.parts[e]);
                            return "[" + (u.inverted ? "^" : "") + t + "]";
                        },
                        any: function(u) {
                            return "any character";
                        },
                        end: function(u) {
                            return "end of input";
                        },
                        other: function(u) {
                            return u.description;
                        }
                    };
                    return "Expected " + s(u) + " but " + i(e) + " found.";
                }, e.exports = {
                    SyntaxError: n,
                    parse: o
                };
            },
            {}
        ],
        16: [
            function(u, e, t) {
                "use strict";
                var r = u("./utils/arrays"), n = u("./utils/objects"), o = {
                    VERSION: "0.10.0",
                    GrammarError: u("./grammar-error"),
                    parser: u("./parser"),
                    compiler: u("./compiler"),
                    generate: function(u, e) {
                        function t(u) {
                            var e, t = {};
                            for(e in u)u.hasOwnProperty(e) && (t[e] = n.values(u[e]));
                            return t;
                        }
                        e = void 0 !== e ? e : {}, e = n.clone(e);
                        var s = "plugins" in e ? e.plugins : [], i = {
                            parser: o.parser,
                            passes: t(o.compiler.passes)
                        };
                        return r.each(s, function(u) {
                            u.use(i, e);
                        }), o.compiler.compile(i.parser.parse(u), i.passes, e);
                    }
                };
                e.exports = o;
            },
            {
                "./compiler": 2,
                "./grammar-error": 14,
                "./parser": 15,
                "./utils/arrays": 17,
                "./utils/objects": 19
            }
        ],
        17: [
            function(u, e, t) {
                "use strict";
                var r = {
                    range: function(u, e) {
                        var t, r, n = e - u, o = new Array(n);
                        for(t = 0, r = u; t < n; t++, r++)o[t] = r;
                        return o;
                    },
                    find: function(u, e) {
                        var t, r = u.length;
                        if ("function" == typeof e) {
                            for(t = 0; t < r; t++)if (e(u[t])) return u[t];
                        } else for(t = 0; t < r; t++)if (u[t] === e) return u[t];
                    },
                    indexOf: function(u, e) {
                        var t, r = u.length;
                        if ("function" == typeof e) {
                            for(t = 0; t < r; t++)if (e(u[t])) return t;
                        } else for(t = 0; t < r; t++)if (u[t] === e) return t;
                        return -1;
                    },
                    contains: function(u, e) {
                        return r.indexOf(u, e) !== -1;
                    },
                    each: function(u, e) {
                        var t, r = u.length;
                        for(t = 0; t < r; t++)e(u[t], t);
                    },
                    map: function(u, e) {
                        var t, r = u.length, n = new Array(r);
                        for(t = 0; t < r; t++)n[t] = e(u[t], t);
                        return n;
                    },
                    pluck: function(u, e) {
                        return r.map(u, function(u) {
                            return u[e];
                        });
                    },
                    every: function(u, e) {
                        var t, r = u.length;
                        for(t = 0; t < r; t++)if (!e(u[t])) return !1;
                        return !0;
                    },
                    some: function(u, e) {
                        var t, r = u.length;
                        for(t = 0; t < r; t++)if (e(u[t])) return !0;
                        return !1;
                    }
                };
                e.exports = r;
            },
            {}
        ],
        18: [
            function(u, e, t) {
                "use strict";
                var r = {
                    subclass: function(u, e) {
                        function t() {
                            this.constructor = u;
                        }
                        t.prototype = e.prototype, u.prototype = new t;
                    }
                };
                e.exports = r;
            },
            {}
        ],
        19: [
            function(u, e, t) {
                "use strict";
                var r = {
                    keys: function(u) {
                        var e, t = [];
                        for(e in u)u.hasOwnProperty(e) && t.push(e);
                        return t;
                    },
                    values: function(u) {
                        var e, t = [];
                        for(e in u)u.hasOwnProperty(e) && t.push(u[e]);
                        return t;
                    },
                    clone: function(u) {
                        var e, t = {};
                        for(e in u)u.hasOwnProperty(e) && (t[e] = u[e]);
                        return t;
                    },
                    defaults: function(u, e) {
                        var t;
                        for(t in e)e.hasOwnProperty(t) && (t in u || (u[t] = e[t]));
                    }
                };
                e.exports = r;
            },
            {}
        ]
    }, {}, [
        16
    ])(16);
});

//# sourceMappingURL=index.67c236a5.js.map