import { Pipe, PipeTransform } from '@angular/core';

interface KeyValue {
  key: string | number;
  value: any;
}

function ensureType(key: string) {
  const numericKey = +key;
  return isNaN(numericKey) ? key : numericKey;
}

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
  transform(value): KeyValue[] {
    const keys: KeyValue[] = [];
    for (const key of Object.keys(value)) {
      keys.push({key: ensureType(key), value: value[key]});
    }
    return keys;
  }
}
