import { transform } from "./transform.js"
import { strict as assert } from "assert";

function test(msg, cb) {
    try {
        cb();
    } catch (e) {
        if (e instanceof assert.AssertionError) {
            console.group(msg)
            console.log(e.message);
            console.groupEnd(msg)
            return;
        }
        throw e;
    }
}

test("简单类型不带注释", () => {
    /** @type {Yapi.Schema} */
    ["number", "string", "null", "bool"].forEach(type => {
        let input = { type };
        assert.equal(transform(input),
            `type Result = ${type};
`)
    });
});

test("简单类型带注释", () => {
    ["number", "string", "null", "bool"].forEach(type => {
        /** @type {Yapi.BaseSchema} */
        let input = { type, description: "hello" };
        assert.equal(transform(input),
            `/** hello */
type Result = ${type};
`)
    });
});

test("空对象类型", () => {
    /** @type {Yapi.Schema} */
    let input = { type: "object" };
    assert.equal(transform(input),
        `interface Result {}
`)
});

test("空对象类型带注释", () => {
    /** @type {Yapi.Schema} */
    let input = { type: "object", description: "balabala" };
    assert.equal(transform(input),
        `/** balabala */
interface Result {}
`);
});

test("有一个简单类型属性的对象", () => {
    /** @type {Yapi.Schema} */
    let input = { type: "object", properties: { p1: { type: "string" } } };
    assert.equal(transform(input),
        `interface Result {
    p1?: string;
}
`);
});

test("有另一个简单类型属性的对象", () => {
    /** @type {Yapi.Schema} */
    let input = { type: "object", properties: { p2: { type: "number" } } };
    assert.equal(transform(input),
        `interface Result {
    p2?: number;
}
`);
});

test("有多个简单类型属性的对象", () => {
    /** @type {Yapi.Schema} */
    let input = {
        type: "object", properties: {
            a: { type: "string" },
            b: { type: "number" },
            c: { type: "bool" }
        }
    };
    assert.equal(transform(input),
        `interface Result {
    a?: string;
    b?: number;
    c?: bool;
}
`);
});

test("带有多个注释的多个简单类型属性的对象", () => {
    /** @type {Yapi.Schema} */
    let input = {
        type: "object", properties: {
            a: { type: "string" },
            b: { type: "number", description: "This is a number" },
            c: { type: "bool", description: "This is a bool" }
        }
    };
    assert.equal(transform(input),
        `interface Result {
    a?: string;
    /** This is a number */
    b?: number;
    /** This is a bool */
    c?: bool;
}
`);
});

test("带有多个注释和必选属性的多个简单类型属性的对象", () => {
    /** @type {Yapi.Schema} */
    let input = {
        type: "object", properties: {
            a: { type: "string" },
            b: { type: "number", description: "This is a number" },
            c: { type: "bool", description: "This is a bool" },
        },
        required: ["a", "c"]
    };
    assert.equal(transform(input),
        `interface Result {
    a: string;
    /** This is a number */
    b?: number;
    /** This is a bool */
    c: bool;
}
`);
});

test("嵌套空对象", () => {
    /** @type {Yapi.Schema} */
    let input = {
        type: "object", properties: {
            a: { type: "object" },
        }
    };
    assert.equal(transform(input),
        `interface Result {
    a?: {};
}
`);
});

test("嵌套简单属性对象", () => {
    /** @type {Yapi.Schema} */
    let input = {
        type: "object", properties: {
            a: {
                type: "object", properties: {
                    b: { type: "string" }
                }
            },
        }
    };
    assert.equal(transform(input),
        `interface Result {
    a?: {
        b?: string;
    };
}
`);
});

test("多层嵌套复杂对象", () => {
    /** @type {Yapi.Schema} */
    let input = {
        type: "object", properties: {
            a: {
                type: "object", properties: {
                    b: { type: "string" },
                    b2: {
                        type: "object", description: "内层第二",
                        properties: {
                            c: { type: "number" }
                        }
                    }
                },
                required: ["b2"]
            },
            a2: { type: "string", description: "外层第二" }
        },
        required: ["a2"]
    };
    assert.equal(transform(input),
        `interface Result {
    a?: {
        b?: string;
        /** 内层第二 */
        b2: {
            c?: number;
        };
    };
    /** 外层第二 */
    a2: string;
}
`);
});

test("数组", () => {
    /** @type {Yapi.Schema} */
    let input = { type: "array", items: { type: "number" } };
    assert.equal(transform(input),
        `interface Result {
    [index: number]: number;
}
`,
    );
});

test("数组 + 注释", () => {
    /** @type {Yapi.Schema} */
    let input = { type: "array", items: { type: "number", description: "ABC" } };
    assert.equal(transform(input),
        `interface Result {
    /** ABC */
    [index: number]: number;
}
`);
});

test("数组 + 对象 + 注释", () => {
    /** @type {Yapi.Schema} */
    let input = {
        type: "array", items: {
            type: "object", description: "ABC",
            properties: {
                prop: { type: "string", description: "DEF" }
            }
        }
    };
    assert.equal(transform(input),
        `interface Result {
    /** ABC */
    [index: number]: {
        /** DEF */
        prop?: string;
    };
}
`);
});