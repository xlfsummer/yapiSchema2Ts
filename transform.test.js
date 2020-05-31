import { transform } from "./transform.js"
import { strict as assert } from "assert";

// let input = { "$schema": "http://json-schema.org/draft-04/schema#", "type": "object", "properties": { "code": { "type": "number" }, "data": { "type": "object", "properties": { "streamer_id": { "type": "number", "description": "主播id" }, "nick_name": { "type": "string", "description": "昵称" }, "icon_url": { "type": "null", "description": "主播头像" }, "room_id": { "type": "number", "description": "房间号" }, "is_follow": { "type": "number", "description": "是否关注了主播", "mock": { "mock": "0=未关注，1=已关注" } }, "play_url": { "type": "string", "description": "播放流地址" } }, "required": ["streamer_id", "nick_name", "icon_url", "room_id", "is_follow", "play_url"] }, "message": { "type": "string" } }, "required": ["code", "data", "message"] };

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
    "空对象类型带注释")

})();