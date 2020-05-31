import { transform } from "./transform.js"
import { strict as assert } from "assert";

(() => {
    /** @type {Yapi.Schema} */
    ["number", "string", "null", "bool"].forEach(type => {
        let input = { type };
        assert.equal(transform(input), 
`type Result = ${type};
`,
        "简单类型不带注释")
    });
})();

(() => {
    ["number", "string", "null", "bool"].forEach(type => {
        /** @type {Yapi.BaseSchema} */
        let input = { type, description: "hello" };
        assert.equal(transform(input), 
`/** hello */
type Result = ${type};
`,
        "简单类型带注释")
    });
})();

(() => {
        /** @type {Yapi.Schema} */
        let input = { type: "object" };
        assert.equal(transform(input), 
`interface Result {
}
`,
        "空对象类型")

})();

(() => {
    /** @type {Yapi.Schema} */
    let input = { type: "object", description: "balabala" };
    assert.equal(transform(input), 
`/** balabala */
interface Result {
}
`,
    "空对象类型带注释");
})();

(() => {
    /** @type {Yapi.Schema} */
    let input = { type: "object", properties: { p1: { type: "string" } } };
    assert.equal(transform(input), 
`interface Result {
    p1?: string;
}
`,
    "有一个简单类型属性的对象");
})();

(() => {
    /** @type {Yapi.Schema} */
    let input = { type: "object", properties: { p2: { type: "number" } } };
    assert.equal(transform(input), 
`interface Result {
    p2?: number;
}
`,
    "有另一个简单类型属性的对象");
})();

(() => {
    /** @type {Yapi.Schema} */
    let input = { type: "object", properties: {
        a: { type: "string" },
        b: { type: "number" },
        c: { type: "bool" } 
    }};
    assert.equal(transform(input), 
`interface Result {
    a?: string;
    b?: number;
    c?: bool;
}
`,
    "有多个简单类型属性的对象");
})();

(() => {
    /** @type {Yapi.Schema} */
    let input = { type: "object", properties: {
        a: { type: "string" },
        b: { type: "number", description: "This is a number" },
        c: { type: "bool", description: "This is a bool" } 
    }};
    assert.equal(transform(input), 
`interface Result {
    a?: string;
    /** This is a number */
    b?: number;
    /** This is a bool */
    c?: bool;
}
`,
    "带有多个注释的多个简单类型属性的对象");
})();