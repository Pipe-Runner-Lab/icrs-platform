import { GAMES } from "../../constants/games";
import { getFirestore } from "firebase-admin/firestore";
import * as aoe4world from "../../utils/aoe4world";
import { User, WithId } from "../../@types/firebase-data";
import { logger } from "firebase-functions/v2";

/**
 * Scheduled callback to update user data
 * This function is called every 5 minutes
 * @return {Promise<void>}
 */
export async function updateOnlineLeaderboard() {
  const db = getFirestore();
  const users = (await db.collection("users").get()).docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as WithId<User>[];

  /* ---------------------------- AGE OF EMPIRES 4 ---------------------------- */

  users.forEach(async (user) => {
    if (!user[GAMES.AOE4]) return;

    try {
      const newRatings = Object.keys(user[GAMES.AOE4]).reduce(
        async (accPromise, id) => ({
          ...(await accPromise),
          [id]: {
            ...user[GAMES.AOE4][id],
            ...(await aoe4world.getAllElo(id))
          }
        }),
        Promise.resolve({})
      );

      await db
        .collection("users")
        .doc(user.id)
        .set(
          {
            [GAMES.AOE4]: await newRatings
          },
          { merge: true }
        );
    } catch (e) {
      logger.info("Error in updating AOE4 leaderboard information");
      logger.error(e);
    }
  });
}
