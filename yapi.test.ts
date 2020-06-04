/// <reference path="yapi.d.ts" />

let api1: Yapi.Schema = {
  $schema: "http://json-schema.org/draft-04/schema#",
  type: "object",
  properties: {
    code: { type: "number" },
    data: {
      type: "object",
      properties: {
        streamer_id: { type: "number", description: "主播id" },
        nick_name: { type: "string", description: "昵称" },
        icon_url: { type: "null", description: "主播头像" },
        room_id: { type: "number", description: "房间号" },
        is_follow: {
          type: "number",
          description: "是否关注了主播",
          mock: { mock: "0=未关注，1=已关注" },
        },
        play_url: { type: "string", description: "播放流地址" },
      },
      required: [
        "streamer_id",
        "nick_name",
        "icon_url",
        "room_id",
        "is_follow",
        "play_url",
      ],
    },
    message: { type: "string" },
  },
  required: ["code", "data", "message"],
};

let api2: Yapi.Schema = {
  $schema: "http://json-schema.org/draft-04/schema#",
  type: "object",
  properties: {
    plan_id: { type: "string", description: "直播id，修改必须传" },
    goods: {
      type: "array",
      items: {
        type: "object",
        properties: {
          goods_id: { type: "number", description: "直播商品id" },
          sort: { type: "number", description: "排序数字1-100？" },
          goods_name: { type: "string", description: "商品名" },
          goods_img_url: {
            type: "string",
            mock: { mock: "http://xxx.com/sdfsaf.jpg" },
            description: "商品图片",
          },
          goods_price: {
            type: "number",
            description: "商品价格和price_level二选一",
            mock: { mock: "number|null" },
          },
          price_level: {
            type: "object",
            properties: {
              title: { type: "string", description: "阶梯价标题" },
              price: { type: "number", description: "阶梯价价格" },
            },
            required: ["title", "price"],
            description: "商品阶梯价",
          },
          product_code: {
            type: "string",
            description: "来自哪个产品",
            mock: { mock: "kshopmax|ksuperminiapp|liveminiapp" },
          },
          product_url: { type: "string", description: "产品跳转url" },
        },
        required: [
          "goods_name",
          "goods_img_url",
          "goods_price",
          "price_level",
          "product_code",
          "product_url",
          "sort",
          "goods_id",
        ],
      },
      description: "直播商品数组",
    },
  }
};

let api3: Yapi.Schema = {
  type: "object",
  title: "empty object",
  properties: {
    order_id: {
      type: "string",
      description: "订单 ID，需保证全局唯一",
      mock: { mock: "2020011600000001040000" },
    },
    openid: {
      type: "string",
      description:
        "用户openid，当add_source=2 时无需填写（不发送物流服务通知）",
      mock: { mock: "ohZdt5RiMqTw0hBTXK1Hq3ltZRU0" },
    },
    delivery_id: {
      type: "string",
      description: "快递公司ID，参见getAllDelivery, 必须和waybill_id对应",
      mock: { mock: "SF" },
    },
    waybill_id: {
      type: "string",
      description: "运单ID",
      mock: { mock: "123456" },
    },
  },
  required: ["order_id", "openid", "delivery_id", "waybill_id"],
};