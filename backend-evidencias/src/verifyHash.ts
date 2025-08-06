import bcrypt from 'bcrypt';

const plainTextPassword = '5678'; // o '1234'
const hash = '$2b$10$PoSg2CL4ps8nSEaBvtHb2./vyRAD8oaV6x1gr4KgSM9w.DHW6tavm'; // tu hash actual

bcrypt.compare(plainTextPassword, hash).then(match => {
    console.log(match ? '✅ Coincide' : '❌ No coincide');
});
