import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from 'src/infra/prisma/prisma.service';

interface Data {
  table: string;
  field: string;
  validationOptions?: ValidationOptions;
}

export function Exists({ table, field, validationOptions }: Data) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'Exists',
      constraints: [table, field],
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ExistsRule,
    });
  };
}

@ValidatorConstraint({ name: 'Exists', async: true })
export class ExistsRule implements ValidatorConstraintInterface {
  async validate(value: string, args: ValidationArguments) {
    if (!value) {
      return false;
    }
    try {
      const [table, field] = args.constraints;

      const prisma = new PrismaService();

      await prisma.$connect();

      const result = await prisma.$queryRawUnsafe<[]>(
        `SELECT * FROM "${table}" WHERE ${field} = '${value}'`,
      );

      await prisma.$disconnect();
      if (result.length !== 0) {
        return false;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  }
  defaultMessage(args: ValidationArguments) {
    if (!args.value) {
      return `${args.property} is required`;
    } else {
      return `${args.property} already exists`;
    }
  }
}
