declare namespace Yapi {
    export type Schema = ObjectSchema | ArraySchema | PrimitveSchema
    
    interface ObjectSchema<T extends string = string> extends BaseSchema {
        type: "object"
        properties: Record<T, Schema>,
        required?: T[],
    }
    
    interface ArraySchema extends BaseSchema {
        type: "array"
        items: Schema
    }
    
    interface PrimitveSchema extends BaseSchema {
        type: "number" | "string" | "bool" | "null",
    }
    
    interface BaseSchema {
        title?: string
        $schema?: string,
        type: string,
        /** 注释 */
        description?: string
        mock?: { mock: string }
    }
}
