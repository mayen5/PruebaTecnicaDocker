import bcrypt from 'bcrypt';

const generateHash = async (password: string) => {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    console.log(`Contraseña: ${password}`);
    console.log(`Hash: ${hash}`);
};

(async () => {
    await generateHash('1234');      // Para técnico
    await generateHash('5678');      // Para coordinador
})();
