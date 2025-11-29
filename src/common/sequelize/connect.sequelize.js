import { Sequelize } from "sequelize";

const sequelize = new Sequelize('mysql://root:080706@localhost:3307/demo',{logging:true})
try {
  await sequelize.authenticate();
  console.log('[SEQUELIZE] Connection has been established successfully.');
} catch (error) {
  console.error('[SEQUELIZE] Unable to connect to the database:', error);
}
export default sequelize 