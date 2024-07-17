import { ConnectionConfig } from 'src/config/connection.config';

async function loadBalancer(itemsPerPage, bigArray, callback) {
  const total = Math.ceil(bigArray.length / itemsPerPage);

  for (let page = 1; page <= total; page++) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    await callback(bigArray.slice(startIndex, endIndex));
  }
}

process.on('message', async (items: any) => {
  const conn = await ConnectionConfig.getPostgresConnection('librarys');
  loadBalancer(4, items, async (data) => {
    for (const item of data) {
      await conn.client.query(
        'INSERT INTO librarys.students (name, email, age) VALUES ($1, $2, $3)',
        [item.name, item.email, item.age],
      );
      process.send('item-done');
    }
  });

  // await conn.client.destroy();
});
