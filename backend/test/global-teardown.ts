export default async function globalTeardown() {
    console.log('💾 Tests finalizados');
    // Nada que destruir aquí, cada test file gestiona su conexión
}