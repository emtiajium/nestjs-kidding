/* eslint-disable no-param-reassign, @typescript-eslint/no-explicit-any, no-console */

export default function Logged(): MethodDecorator {
  return (target: unknown, propertyKey: string, descriptor: PropertyDescriptor): void => {
    const originalMethod = descriptor.value;
    descriptor.value = function myLog(...args: unknown[]): any {
      console.log(`${target.constructor.name}: ${propertyKey}: ${new Date().toISOString()}: ${JSON.stringify(args)}`);
      // ES-2015
      return Reflect.apply(originalMethod, this, args);
      // return originalMethod.apply(this, args);
    };
  };
}
