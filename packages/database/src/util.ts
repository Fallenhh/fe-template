import type { DBSchema as RootDBSchema, IDBPDatabase } from 'idb'

export type Opener<DBSchema extends RootDBSchema | unknown = unknown> =
  () => Promise<IDBPDatabase<DBSchema>>;

export function createDBAccess<DBSchema> (
  opener: Opener<DBSchema>
): Opener<DBSchema> {
  let db: IDBPDatabase<DBSchema> | undefined

  function cleanup () {
    db = undefined
  }

  return async () => {
    if (db) {
      try {
        // try if the db still open
        db.transaction([], 'readonly', {})
        return db
      } catch {
        cleanup()
      }
    }
    db = await opener()
    db.addEventListener('close', cleanup)
    db.addEventListener('error', cleanup)
    return db
  }
}

export function createDBAccessWithAsyncUpgrade<DBSchema,
  AsyncUpgradePreparedData> (
  firstVersionThatRequiresAsyncUpgrade: number,
  latestVersion: number,
  opener: (
    currentTryOpenVersion: number,
    knowledge?: AsyncUpgradePreparedData
  ) => Promise<IDBPDatabase<DBSchema>>,
  asyncUpgradePrepare: (
    db: IDBPDatabase<DBSchema>
  ) => Promise<AsyncUpgradePreparedData | undefined>
): Opener<DBSchema> {
  let db: IDBPDatabase<DBSchema> | undefined
  let pendingOpen: Promise<IDBPDatabase<DBSchema>> | undefined

  async function open (): Promise<IDBPDatabase<DBSchema>> {
    if (db?.version === latestVersion) return db
    let currentVersion = firstVersionThatRequiresAsyncUpgrade
    let lastVersionData: AsyncUpgradePreparedData | undefined
    while (currentVersion < latestVersion) {
      try {
        db = await opener(currentVersion, lastVersionData)
        // if the open success, the stored version is small or eq than currentTryOpenVersion
        // let's call the prepare function to do all the async jobs
        lastVersionData = await asyncUpgradePrepare(db)
      } catch (error) {
        if (currentVersion >= latestVersion) throw error
        // if the stored database version is bigger than the currentTryOpenVersion
        // It will fail and we just move to next version
      }
      currentVersion += 1
      db?.close()
      db = undefined
    }
    db = await opener(currentVersion, lastVersionData)
    db.addEventListener('close', () => (db = undefined))
    if (!db) throw new Error('Invalid state')
    return db
  }

  return () => {
    // Share a Promise to prevent async upgrade for multiple times
    if (pendingOpen) return pendingOpen
    const promise = (pendingOpen = open())
    promise.catch(() => (pendingOpen = undefined))
    return promise
  }
}

export function flattenJson (
  json: Record<string, any>,
  prefix?: string,
  data: Record<string, any> = {}
): Record<string, any> {
  for (const key in json) {
    if (typeof json[key] === 'object') {
      flattenJson(json[key], key, data)
    } else {
      if (prefix) {
        const k = `${prefix}.${key}`
        data[k] = json[key]
      } else {
        data[key] = json[key]
      }
    }
  }
  return data
}
