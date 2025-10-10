import { openDB } from 'idb'

const DB_NAME = 'audioButtonsDB'
const STORE_NAME = 'buttons'

export async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    },
  })
}

export async function saveButton(id, blob, filename, imageBlob, color, customLabel) {
  const db = await getDB()
  const existing = await db.get(STORE_NAME, id)
  await db.put(STORE_NAME, {
    id,
    blob: blob ?? existing?.blob ?? null,
    image: imageBlob ?? existing?.image ?? null,
    color: color ?? existing?.color ?? '#4b5563',
    filename: filename ?? existing?.filename ?? '',
    customLabel: customLabel ?? existing?.customLabel ?? '',
    updatedAt: Date.now(),
  })
}

export async function getButton(id) {
  const db = await getDB()
  return db.get(STORE_NAME, id)
}

export async function deleteButton(id) {
  const db = await getDB()
  return db.delete(STORE_NAME, id)
}

export async function getAllButtons() {
  const db = await getDB()
  const all = await db.getAll(STORE_NAME)
  const map = {}
  for (const btn of all) map[btn.id] = btn
  return map
}
