import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
  buildMessage,
  isPhoneNumber,
} from 'class-validator';
import type { CountryCode } from 'libphonenumber-js';

// eslint-disable-next-line @typescript-eslint/naming-convention
export function IsPhoneNumber(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isPhoneNumber',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          // the property name that holds the country code
          const [countryCodeField] = args.constraints;

          // the value of the country code on the target object
          const countryCode: CountryCode = (<any>args.object)[countryCodeField];

          // validate phone number for specified region
          return isPhoneNumber(value, countryCode);
        },
        // specify custom error message
        defaultMessage: buildMessage(
          (eachPrefix: string) => `${eachPrefix} $property must be a valid phone number in the specified region`,
          validationOptions,
        ),
      },
    });
  };
}
