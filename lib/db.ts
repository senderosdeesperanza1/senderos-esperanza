import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "senderos_db",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export function getSQLDateTime(): string {
  const date = new Date();
  return date.toISOString().slice(0, 19).replace("T", " ");
}
