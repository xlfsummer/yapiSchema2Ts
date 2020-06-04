/**
 * @typedef {Omit<Yapi.ObjectSchema & { selfRequired: boolean }, "required">} ParsedObjectSchema
 * @typedef {ParsedObjectSchema | Yapi.ArraySchema | Yapi.PrimitveSchema} ParsedSchema
 */


/**
 * @param {Yapi.Schema} source
 * @returns {ParsedSchema}
*/
export function parse (source){
    return source;
}

/**
 * @param {Yapi.Schema} rootSchema
 */
export function emit(rootSchema){
    let descriptionStr = formatDescription(rootSchema);
    let result = descriptionStr;

    if(rootSchema.type == "object"){
        let propertiesStr = getPropertiesStr(rootSchema);
        result += `interface Result ${propertiesStr}\n`;
    } else if(rootSchema.type == "array"){
        result += 
`interface Result {\n${formatDescription(rootSchema.items, 1)}    [index: number]: ${getPropertiesStr(rootSchema.items, 2)};\n}\n`
    } else {
        let type = findPrimitiveType(rootSchema);
        result += `type Result = ${type};\n`
    }

    return result;

    /**
     * 
     * @param {Yapi.Schema} parentSchema 
     * @param {number} depth 
     */
    function getPropertiesStr(parentSchema = {}, depth = 1) {
        if(findPrimitiveType(parentSchema)){
            return findPrimitiveType(parentSchema);
        }

        if(parentSchema.type == "object"){
            let tab = "    ".repeat(depth);
            let propertiesStr = "{";
            const hasProperty = Boolean(Object.keys(parentSchema.properties ?? {}).length);
    
            if(hasProperty) propertiesStr += "\n";
    
            for (let propName in (parentSchema.properties || {})) {
                let childSchema = parentSchema.properties[propName];
    
                let requiredStr = (parentSchema.required || []).includes(propName) ? "" : "?";
                propertiesStr += formatDescription(childSchema, depth);
                propertiesStr += formatRow(`${propName}${requiredStr}: ${getPropertiesStr(childSchema, depth + 1)};`, depth);
            }
            let newline = hasProperty ? "    ".repeat(depth - 1) : "";
            propertiesStr += `${newline}}`;
    
            return propertiesStr;
        }

        if(parentSchema.type == "array"){
            return getPropertiesStr(parentSchema.items, depth) + "[]";
        }

        return "any";
    }

    /**
     * @param {Yapi.Schema} schema 
     */
    function findPrimitiveType(schema) {
        return ["number", "string", "null", "bool"].find(type => schema.type == type);
    }
    function formatDescription(schema, depth = 0){
        return schema.description ? formatRow(`/** ${schema.description} */`, depth) : "";
    }
    function formatRow(content, depth = 0){
        const TAB_SIZE = 4
        return `${" ".repeat(TAB_SIZE).repeat(depth)}${content}\n`;
    }
}

export function transform(source){
    return emit(parse(source));
}

/**
 * @param {Yapi.ObjectSchema} source 
 * @returns {Omit<Yapi.ObjectSchema & { selfRequired: boolean }, "required">}
 */
function mergeRequiredToProperty(source){
    for(let propName in source.properties){
        source.properties[propName].selfRequired = source.required.includes(propName);
    }
    delete source.required
    return source;
}