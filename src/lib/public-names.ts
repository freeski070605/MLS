/**
 * Customer-facing brand copy must only use Shante and Cee.
 * Historical records, folder names and internal migration identifiers remain
 * unchanged so existing database and media references keep working.
 */
export function publicStudioCopy(value:string|null|undefined):string{
  return (value??'')
    .replace(/\bKe(?=(?:['’]s)?\b)/g,'Shante')
    .replace(/\bTiti(?=(?:['’]s)?\b)/gi,'Cee')
    .replace(/\bChristina(?=(?:['’]s)?\b)/g,'Cee');
}
export function publicStudioOptional(value:string|null|undefined):string|null{
  return value==null?null:publicStudioCopy(value);
}
