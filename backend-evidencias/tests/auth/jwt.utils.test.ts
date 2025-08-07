import * as jwtUtils from '../../src/auth/jwt.utils';
import type { Rol } from '../../src/auth/auth.types';

describe('JWT Utils', () => {
    const payload = { username: 'usuario', rol: 'tecnico' as Rol };

    const originalSecret = process.env.JWT_SECRET;

    afterEach(() => {
        process.env.JWT_SECRET = originalSecret; // Restaurar valor original
    });

    test('debería generar un token válido con JWT_SECRET', () => {
        process.env.JWT_SECRET = 'clavepersonal';
        const token = jwtUtils.generateToken(payload);
        expect(typeof token).toBe('string');
        const decoded = jwtUtils.verifyToken(token);
        expect(decoded.username).toBe(payload.username);
        expect(decoded.rol).toBe(payload.rol);
    });

    test('debería usar "supersecret" si JWT_SECRET no está definido', () => {
        delete process.env.JWT_SECRET;
        const token = jwtUtils.generateToken(payload);
        const decoded = jwtUtils.verifyToken(token);
        expect(decoded.username).toBe(payload.username);
        expect(decoded.rol).toBe(payload.rol);
    });

    test('debería lanzar error con token inválido', () => {
        expect(() => jwtUtils.verifyToken('invalido')).toThrow();
    });
});
