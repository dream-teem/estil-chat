import _ from 'lodash';
import md5 from 'md5';

import type { PayboxParams } from '../interfaces/paybox.interface';

const FIELDS_TO_REMOVE: Array<keyof PayboxParams> = ['pg_sig'];
export const makeFlatParamsArray = (params: Record<string, any>): (string | number)[] => _(params)
  .toPairs()
  .sortBy(0)
  .map<string | number>(([, value]: [string, string | number]) => value)
  .value();

export const makePayboxSignature = (scriptName: string, params: Record<string, any>, secret: string): string => {
  const paramsArr = makeFlatParamsArray(_.omit(params, FIELDS_TO_REMOVE));

  return md5([scriptName, ...paramsArr, secret].join(';'));
};

export const getScriptNameFromUrl = (url: string): string => _.last(url.split('/').filter(Boolean)) || '';
