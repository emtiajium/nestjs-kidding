export default function logged(
  target: unknown,
  propertyKey: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor {
  const originalMethod = descriptor.value;
  descriptor.value = function myLog(...args: unknown[]): any {
    console.log(`${target.constructor.name}: ${new Date().toISOString()}: ${JSON.stringify(args)}`);
    // ES-2015
    return Reflect.apply(originalMethod, this, args);
    // return originalMethod.apply(this, args);
  };
  return descriptor;
}
