export type Rol = 'tecnico' | 'coordinador';

export interface UserPayload {
    username: string;
    rol: Rol;
}
