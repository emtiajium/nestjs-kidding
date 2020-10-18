// class-validator's validate() return too much data which is not needed normally
// NestJS also uses class-validator (see, https://docs.nestjs.com/techniques/validation)
// but it transform the error in a more readable format

// here, transformError() mimics the same behavior
// copied from https://github.com/nestjs/nest/blob/master/packages/common/pipes/validation.pipe.ts
// modified a bit to pacify es-lint :D

// use like below:
// import { validate } from 'class-validator';
// transformError(await validate(plainToClass(p1, p2)));

import { ValidationError } from 'class-validator/types/validation/ValidationError';
import { iterate } from 'iterare';
import { BadRequestException } from '@nestjs/common';

function prependConstraintsWithParentProp(parentError: ValidationError, error: ValidationError): ValidationError {
  const constraints = {};
  Object.keys(error.constraints).forEach(key => {
    constraints[key] = `${parentError.property}.${error.constraints[key]}`;
  });
  return {
    ...error,
    constraints,
  };
}

function mapChildrenToValidationErrors(error: ValidationError): ValidationError[] {
  if (!(error.children && error.children.length > 0)) {
    return [error];
  }
  const validationErrors = [];
  error.children.forEach(item => {
    if (item.children && item.children.length > 0) {
      validationErrors.push(...mapChildrenToValidationErrors(item));
    }
    validationErrors.push(prependConstraintsWithParentProp(error, item));
  });
  return validationErrors;
}

function flattenValidationErrors(validationErrors: ValidationError[]): string[] {
  return iterate(validationErrors)
    .map(error => mapChildrenToValidationErrors(error))
    .flatten()
    .filter(item => !!item.constraints)
    .map(item => Object.values(item.constraints))
    .flatten()
    .toArray();
}

export default function transformError(error: ValidationError[]): boolean {
  if (error.length > 0) {
    // ;)
    // new ValidationPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST });
    throw new BadRequestException(flattenValidationErrors(error));
  }
  return true;
}
