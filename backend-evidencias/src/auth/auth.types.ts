export type Rol = 'tecnico' | 'coordinador';

export interface UserPayload {
    id: string;
    username: string;
    rol: Rol;
}
