import { TestDataSource } from './test-datasource';

export async function setupTestDB() {
    if (!TestDataSource.isInitialized) {
        await TestDataSource.initialize();
    }
}

export async function teardownTestDB() {
    if (TestDataSource.isInitialized) {
        await TestDataSource.destroy();
    }
}

export async function clearAllTables() {
    // DELETE respeta FK si vas en orden correcto: hijos → padres
    // TypeORM conoce el orden de dependencias
    const entities = TestDataSource.entityMetadatas;

    // Ordenar: tablas sin dependencias al final (padres al final, hijos primero)
    const sorted = [...entities].sort((a, b) => {
        const aHasFk = a.foreignKeys.length > 0;
        const bHasFk = b.foreignKeys.length > 0;
        if (aHasFk && !bHasFk) return -1; // a primero (hijo)
        if (!aHasFk && bHasFk) return 1;  // b primero (hijo)
        return 0;
    });

    for (const entity of sorted) {
        await TestDataSource.query(`DELETE FROM \`${entity.tableName}\``);
    }
}