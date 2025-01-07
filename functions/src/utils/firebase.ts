import { getFirestore } from "firebase-admin/firestore";

export const getCache = async <T>(cacheId: string): Promise<T> => {
  const db = getFirestore();
  const cacheDocRef = db.collection("history").doc(cacheId).get();
  const cache = (await cacheDocRef).data();

  return cache as T;
};

export const setCache = async <T>(cacheId: string, data: T): Promise<void> => {
  const db = getFirestore();
  await db
    .collection("history")
    .doc(cacheId)
    .set(
      {
        [cacheId]: data
      },
      { merge: true }
    );
};
