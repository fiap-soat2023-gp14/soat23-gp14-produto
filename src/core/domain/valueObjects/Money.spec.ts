import { Money } from './Money';
import { ValidationException } from '../../../infrastructure/exceptions/ValidationException';

describe('Money', () => {
    describe('create', () => {
        it('Should create a Money instance with the given value', async () => {
            const money = await Money.create(100);
            expect(money.value).toEqual(100);
            expect(money.currency).toEqual('BRL');
        });
    });

    describe('validate', () => {
        it('Should not throw an error if the value is valid', async () => {
            const money = await Money.create(100);
            await expect(money.validate()).resolves.not.toThrow();
        });

        it('Should throw a ValidationException if the value is not a number', async () => {
            const money = await Money.create('invalid' as any);
            await expect(money.validate()).rejects.toThrow(ValidationException);
        });

        it('Should throw a ValidationException if the value is negative', async () => {
            const money = await Money.create(-1);
            await expect(money.validate()).rejects.toThrow(ValidationException);
        });

        it('Should throw a ValidationException if the value is equal to 0', async () => {
            const money = await Money.create(0);
            await expect(money.validate()).rejects.toThrow(ValidationException);
        });
    });
});