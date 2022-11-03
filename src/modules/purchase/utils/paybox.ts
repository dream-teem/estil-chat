import bcrypt from 'bcrypt';
import _ from 'lodash';
import md5 from 'md5';
import xml2js from 'xml2js';

import type { PayboxResponse } from '../interfaces/paybox-webhook.interface';
import type { PayboxParams, PayboxParamsWithSignature } from '../interfaces/paybox.interface';

const xmlParser = new xml2js.Parser({ explicitArray: false });
const xmlBuilder = new xml2js.Builder();

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

export const makeParamsWithSignature = async <T = any>(
  scriptName: string,
  params: T & { pg_salt?: string },
  secret: string,
): Promise<PayboxParamsWithSignature<T>> => {
  if (!params.pg_salt) {
    params.pg_salt = await bcrypt.genSalt();
  }

  return <PayboxParamsWithSignature<T>>{
    ...params,
    pg_sig: makePayboxSignature(scriptName, params, secret),
  };
};

export const getScriptNameFromUrl = (url: string): string => _.last(url.split('/').filter(Boolean)) || '';

export const parseXmlData = async <T = any>(xml: string): Promise<T> => (
  xmlParser.parseStringPromise(xml).then((value: PayboxResponse<T>) => value.response)
);

export const makeXmlData = (data: object): string => {
  const payboxResponse: PayboxResponse = {
    response: data,
  };
  return xmlBuilder.buildObject(payboxResponse);
};
