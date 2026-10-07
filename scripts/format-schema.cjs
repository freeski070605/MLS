// This maintenance script intentionally stays CommonJS without changing the project module mode.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
const file = 'prisma/schema.prisma';
const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
const modelNames = lines.filter(x => x.startsWith('model ')).map(x => x.split(' ')[1]);
const types = ['String','Int','Boolean','DateTime','Json','UserRole','BookingStatus','PaymentStatus','PriceType','DepositType','PublishStatus',...modelNames];
const typePattern = new RegExp(` (?=[A-Za-z][A-Za-z0-9]* (?:${types.join('|')})(?:\\[\\])?\\??(?: |$))`,'g');
const result=[];
for(const line of lines){
  if(line.startsWith('generator ')||line.startsWith('datasource ')){
    result.push(line.replace(' { ',' {\n  ').replace(/ (url|provider) = /g,'\n  $1 = ').replace(' }','\n}'));continue;
  }
  if(line.startsWith('enum ')){
    const match=line.match(/^enum (\w+) \{ (.*?) \}$/);
    result.push(`enum ${match[1]} {\n${match[2].split(' ').map(x=>'  '+x).join('\n')}\n}`);continue;
  }
  if(line.startsWith('model ')){
    const match=line.match(/^model (\w+) \{ (.*?) \}$/);
    let body=match[2].replace(typePattern,'\n  ').replace(/ @@/g,'\n  @@');
    result.push(`model ${match[1]} {\n  ${body}\n}`);continue;
  }
  result.push(line);
}
fs.writeFileSync(file,result.join('\n'));
