
/**
 * DTO utilizado para la autenticación de usuarios.
 * 
 * Se utiliza cuando un usuario intenta iniciar sesión 
 * enviando su email y contraseña.
 */
export class LoginUserDTO {

    /**
     * Constructor privado para evitar crear instancias directamente
     * sin validación.
     * 
     * @param email Correo electrónico del usuario.
     * @param password Contraseña del usuario.
     */
    private constructor(
        public readonly email: string,
        public readonly password: string) { }
    
    /**
     * Crea un LoginUserDTO validando los datos recibidos.
     * Verifica que el email y contraseña existen antes de crear el DTO.
     * 
     * @param body Objeto recibido desde la petición HTTP.
     * @returns Devuelve un array con posible error o el DTO creado.
     */    
    static create(body: { [key: string]: any; }): [string | null, LoginUserDTO?] {
        const { email, password } = body;
        if (!email) return ['Missing email'];
        if (!password) return ['Missing password'];

        const dto = new LoginUserDTO(email, password)
        return [null, dto];
    }

}