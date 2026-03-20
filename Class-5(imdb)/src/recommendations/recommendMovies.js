import axios from "axios";
import { genreids } from "../genres";

// Note: the API key is already used elsewhere in this project.
// For a real app, move this to a backend or use Vite env vars.
const TMDB_API_KEY = "3aec63790d50f3b9fc2efb4c15a8cf99";

const MOOD_TO_GENRE_IDS = {
  Cozy: [10749, 16, 35], // Romance, Animation, Comedy
  "On the edge": [53, 27, 9648], // Thriller, Horror, Mystery
  Inspired: [99, 36, 18], // Documentary, History, Drama
  "Brain Off": [28, 12, 14], // Action, Adventure, Fantasy
  "Documentary": [99], 
};

function uniq(arr) {
  return Array.from(new Set(arr));
}

function safeGenreNamesFromIds(ids) {
  return ids
    .filter((id) => typeof id === "number")
    .map((id) => genreids[id])
    .filter(Boolean);
}

function moodGenres(mood) {
  if (!mood) return [];
  return MOOD_TO_GENRE_IDS[mood] ?? [];
}

function scoreMovieForMood(movieObj, moodGenreIds) {
  const movieGenreIds = Array.isArray(movieObj?.genre_ids)
    ? movieObj.genre_ids
    : [];

  const overlap = movieGenreIds.filter((id) => moodGenreIds.includes(id));
  const overlapScore = overlap.length;

  // Prefer strong overlap; then prefer widely liked/popular titles.
  const ratingBoost = typeof movieObj?.vote_average === "number" ? movieObj.vote_average / 10 : 0;
  const popularityBoost =
    typeof movieObj?.popularity === "number" ? Math.min(movieObj.popularity / 100, 1) : 0;

  return overlapScore * 5 + ratingBoost * 2 + popularityBoost;
}

function topGenreIdsFromWatchlist(watchlist, limit = 6) {
  const counts = new Map();
  for (const m of watchlist) {
    if (!Array.isArray(m?.genre_ids)) continue;
    for (const id of m.genre_ids) {
      if (typeof id !== "number") continue;
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id);
}

function pickBestFromWatchlist(watchlist, moodGenreIds, count) {
  const candidates = watchlist.filter((m) => typeof m?.id === "number");

  // Sort by a mood score, then by vote_average/popularity as tie-breakers.
  const sorted = [...candidates].sort((a, b) => {
    const scoreA = scoreMovieForMood(a, moodGenreIds);
    const scoreB = scoreMovieForMood(b, moodGenreIds);
    if (scoreB !== scoreA) return scoreB - scoreA;
    const ratingA = typeof a?.vote_average === "number" ? a.vote_average : 0;
    const ratingB = typeof b?.vote_average === "number" ? b.vote_average : 0;
    return ratingB - ratingA;
  });

  const picked = [];
  const used = new Set();
  for (const m of sorted) {
    if (used.has(m.id)) continue;
    used.add(m.id);
    picked.push(m);
    if (picked.length >= count) break;
  }
  return picked;
}

function buildWatchlistReasoning(movieObj, mood) {
  const movieGenres = Array.isArray(movieObj?.genre_ids) ? movieObj.genre_ids : [];
  const moodGenreIdsArr = moodGenres(mood);
  const overlapIds = movieGenres.filter((id) => moodGenreIdsArr.includes(id));
  const overlapNames = safeGenreNamesFromIds(overlapIds).slice(0, 3);

  if (overlapNames.length > 0) {
    return `${movieObj.title} already matches your mood with ${overlapNames.join(
      ", "
    )} energy—consider it your “automatic rewatch” pick.`;
  }
  return `${movieObj.title} is in your watchlist for a reason—let’s steer it toward your ${mood} vibe.`;
}

function buildExternalReasoning(movieObj, mood, moodGenreIdsArr, vibeGenreIdsArr) {
  const movieGenres = Array.isArray(movieObj?.genre_ids) ? movieObj.genre_ids : [];
  const overlapMood = movieGenres.filter((id) => moodGenreIdsArr.includes(id));
  const overlapVibe = movieGenres.filter((id) => vibeGenreIdsArr.includes(id));

  const moodNames = safeGenreNamesFromIds(overlapMood).slice(0, 2);
  const vibeNames = safeGenreNamesFromIds(overlapVibe).slice(0, 2);

  if (moodNames.length > 0 && vibeNames.length > 0) {
    return `${movieObj.title} blends your ${mood} lane (${moodNames.join(
      " & "
    )}) with your watchlist’s vibe (${vibeNames.join(", ")}).`;
  }
  if (moodNames.length > 0) {
    return `${movieObj.title} is a mood match for ${mood}—more vibes, fewer wrong turns.`;
  }
  return `${movieObj.title} is a fresh “adjacent” find that should still feel right in your mood (${mood}).`;
}

async function discoverExternalMovies({
  apiKey,
  genreIds,
  excludeIds,
  targetCount,
  maxPages = 3,
}) {
  if (!genreIds.length) return [];
  const excludeSet = new Set(excludeIds ?? []);

  const collected = [];
  const collectedIds = new Set();

  for (let page = 1; page <= maxPages; page++) {
    const withGenres = uniq(genreIds).join(",");

    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/movie`,
      {
        params: {
          api_key: apiKey,
          language: "en-US",
          sort_by: "popularity.desc",
          include_adult: "false",
          include_video: "false",
          with_genres: withGenres,
          page,
        },
      }
    );

    const results = Array.isArray(response.data?.results)
      ? response.data.results
      : [];

    for (const m of results) {
      if (typeof m?.id !== "number") continue;
      if (excludeSet.has(m.id)) continue;
      if (collectedIds.has(m.id)) continue;
      collectedIds.add(m.id);
      collected.push(m);
      if (collected.length >= targetCount) break;
    }

    if (collected.length >= targetCount) break;
  }

  return collected.slice(0, targetCount);
}

async function discoverPopularFallback({
  apiKey,
  excludeIds,
  targetCount,
  maxPages = 3,
}) {
  if (!targetCount) return [];
  const excludeSet = new Set(excludeIds ?? []);
  const collected = [];
  const collectedIds = new Set();

  for (let page = 1; page <= maxPages; page++) {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular`,
      {
        params: {
          api_key: apiKey,
          language: "en-US",
          page,
        },
      }
    );

    const results = Array.isArray(response.data?.results)
      ? response.data.results
      : [];

    for (const m of results) {
      if (typeof m?.id !== "number") continue;
      if (excludeSet.has(m.id)) continue;
      if (collectedIds.has(m.id)) continue;
      collectedIds.add(m.id);
      collected.push(m);
      if (collected.length >= targetCount) break;
    }

    if (collected.length >= targetCount) break;
  }

  return collected.slice(0, targetCount);
}

// Returns JSON that the app can map directly.
// Structure:
// { mood: string, recommendations: [{title, tmdb_id, reasoning, source}] }
export async function recommendMovies({ mood, watchlist }) {
  const moodGenreIdsArr = moodGenres(mood);

  // Optimization tip from your prompt: focus on recent watchlist items.
  const recentWatchlist = Array.isArray(watchlist)
    ? watchlist.slice(-25)
    : [];

  const watchlistIds = recentWatchlist
    .map((m) => m?.id)
    .filter((id) => typeof id === "number");

  const watchlistPicks = pickBestFromWatchlist(
    recentWatchlist,
    moodGenreIdsArr,
    2
  );

  const vibeGenreIdsArr = topGenreIdsFromWatchlist(recentWatchlist, 6);
  const combinedGenreIds = uniq([...moodGenreIdsArr, ...vibeGenreIdsArr]).slice(
    0,
    6
  );

  const recommendations = [
    ...watchlistPicks.map((m) => ({
      title: m.title,
      tmdb_id: m.id,
      reasoning: buildWatchlistReasoning(m, mood),
      source: "watchlist",
    })),
  ];

  // 4 external recommendations (with fallbacks to guarantee 6 total).
  let remaining = 6 - recommendations.length;
  let externalPicks = await discoverExternalMovies({
    apiKey: TMDB_API_KEY,
    genreIds: combinedGenreIds,
    excludeIds: watchlistIds,
    targetCount: remaining,
    maxPages: 4,
  });

  recommendations.push(
    ...externalPicks.map((m) => ({
      title: m.title,
      tmdb_id: m.id,
      reasoning: buildExternalReasoning(
        m,
        mood,
        moodGenreIdsArr,
        vibeGenreIdsArr
      ),
      source: "ai_discovery",
    }))
  );

  remaining = 6 - recommendations.length;
  if (remaining > 0 && moodGenreIdsArr.length) {
    externalPicks = await discoverExternalMovies({
      apiKey: TMDB_API_KEY,
      genreIds: uniq(moodGenreIdsArr).slice(0, 6),
      excludeIds: watchlistIds,
      targetCount: remaining,
      maxPages: 3,
    });

    recommendations.push(
      ...externalPicks.map((m) => ({
        title: m.title,
        tmdb_id: m.id,
        reasoning: buildExternalReasoning(
          m,
          mood,
          moodGenreIdsArr,
          vibeGenreIdsArr
        ),
        source: "ai_discovery",
      }))
    );
  }

  remaining = 6 - recommendations.length;
  if (remaining > 0) {
    const extra = await discoverPopularFallback({
      apiKey: TMDB_API_KEY,
      excludeIds: watchlistIds,
      targetCount: remaining,
      maxPages: 2,
    });
    recommendations.push(
      ...extra.map((m) => ({
        title: m.title,
        tmdb_id: m.id,
        reasoning: buildExternalReasoning(
          m,
          mood,
          moodGenreIdsArr,
          vibeGenreIdsArr
        ),
        source: "ai_discovery",
      }))
    );
  }

  return {
    mood,
    recommendations: recommendations.slice(0, 6),
  };
}

