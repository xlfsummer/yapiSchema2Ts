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
 * @param {ParsedSchema} parsedSchma
 */
export function emit(parsedSchma){
    let description = parsedSchma.description ? `/** ${parsedSchma.description} */\n` : "";
    
    if(parsedSchma.type == "object"){
        return `${description}interface Result {\n}\n`;
    }
    let type = ["number", "string", "null", "bool"].find(type => parsedSchma.type == type);
    return `${description}type Result = ${type};\n`
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