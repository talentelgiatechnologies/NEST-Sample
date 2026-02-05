import { dataSourceFunction } from "../datasource";
import { adminSeed } from "./admin.seed";
import 'dotenv/config';

const dataSource = dataSourceFunction()

async function seeding() {
    await dataSource.initialize()

    await adminSeed(dataSource)
}

seeding().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});