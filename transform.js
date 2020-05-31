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
 * @param {ParsedSchema} rootSchema
 */
export function emit(rootSchema){
    let descriptionStr = formatDescription(rootSchema);

    if(rootSchema.type == "object"){
        let propertiesStr = ""

        if(rootSchema.properties){
            let tab = "    ";
            for(let propName in rootSchema.properties){
                let propSchema = rootSchema.properties[propName];

                let descriptionStr = formatDescription(propSchema);
                if(descriptionStr) descriptionStr = tab + descriptionStr;

                if(propSchema.type == "object"){
                    
                } else {
                    let type = findType(propSchema);
                    propertiesStr += `${descriptionStr}${tab}${propName}?: ${type};\n`
                }
            }
        }
        return `${descriptionStr}interface Result {\n${propertiesStr}}\n`;
    } else {
        let type = findType(rootSchema);
        return `${descriptionStr}type Result = ${type};\n`
    }

    /**
     * @param {Yapi.Schema} schema 
     */
    function findType(schema) {
        return ["number", "string", "null", "bool"].find(type => schema.type == type);
    }
    function formatDescription(schema){
        return schema.description ? `/** ${schema.description} */\n` : "";
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