"use server";
import { sql } from "@vercel/postgres";
import { ToDo } from "@/app/pwa-todo/types";

export async function createToDo(task: string, due: string) {
  await sql`
        INSERT INTO pwa_todo (task, due, done)
        VALUES (${task}, ${due}, false)
    `;
}

export async function getAllToDo() {
  const data = await sql<ToDo>`
      SELECT *
      FROM pwa_todo
      ORDER BY id
  `;
  return data.rows;
}

export async function updateToDoStatus(id: number, done: boolean) {
  await sql`
        UPDATE pwa_todo
        SET done = ${done}
        WHERE id = ${id};
    `;
}
