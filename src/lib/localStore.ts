// ============================================================
// localStore.ts — localStorage Database (Firebase Fallback)
// Used automatically when Firebase credentials are not set
// ============================================================

const PREFIX = "beautycafe_";

function isClient(): boolean {
  return typeof window !== "undefined";
}

type DocData = Record<string, unknown>;

function getCollection(name: string): Record<string, DocData> {
  if (!isClient()) return {};
  try {
    const raw = localStorage.getItem(`${PREFIX}col_${name}`);
    return raw ? (JSON.parse(raw) as Record<string, DocData>) : {};
  } catch {
    return {};
  }
}

function saveCollection(name: string, data: Record<string, DocData>): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(`${PREFIX}col_${name}`, JSON.stringify(data));
  } catch (e) {
    console.error("localStore: failed to save collection", name, e);
  }
}

export const localDb = {
  /** Get a single document */
  getDoc(collectionName: string, id: string) {
    const col = getCollection(collectionName);
    const data = col[id];
    return {
      exists: () => data !== undefined && data !== null,
      data: () => data as DocData,
      id,
    };
  },

  /** Create or overwrite a document */
  setDoc(collectionName: string, id: string, data: DocData): void {
    const col = getCollection(collectionName);
    col[id] = { ...data };
    saveCollection(collectionName, col);
  },

  /** Merge updates into an existing document */
  updateDoc(collectionName: string, id: string, updates: DocData): void {
    const col = getCollection(collectionName);
    col[id] = { ...(col[id] || {}), ...updates };
    saveCollection(collectionName, col);
  },

  /** Get all documents, with optional filter */
  getDocs(
    collectionName: string,
    filter?: (doc: DocData & { id: string }) => boolean
  ): (DocData & { id: string })[] {
    const col = getCollection(collectionName);
    const docs = Object.entries(col).map(([id, data]) => ({ id, ...(data as object) })) as (DocData & { id: string })[];
    return filter ? docs.filter(filter) : docs;
  },

  /** Delete a document */
  deleteDoc(collectionName: string, id: string): void {
    const col = getCollection(collectionName);
    delete col[id];
    saveCollection(collectionName, col);
  },
};
