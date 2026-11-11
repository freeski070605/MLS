/**
 * Customer-facing brand copy must always use Shante's professional name.
 * Historical records, folder names and internal migration identifiers remain
 * unchanged so existing database and media references keep working.
 */
export function publicStudioCopy(value:string|null|undefined):string{
  return (value??'').replace(/\bKe(?=(?:['’]s)?\b)/g,'Shante');
}
export function publicStudioOptional(value:string|null|undefined):string|null{
  return value==null?null:publicStudioCopy(value);
}
