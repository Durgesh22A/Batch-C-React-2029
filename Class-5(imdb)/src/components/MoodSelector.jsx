import { useContext, useMemo, useState } from "react";
import { MovieContext } from "../MovieContext";
import { recommendMovies } from "../recommendations/recommendMovies";

const MOODS = ["Cozy", "On the edge", "Inspired", "Brain Off", "Documentary"];

function RecommendationSkeleton() {
  return (
    <div className="m-8">
      <div className="flex flex-wrap gap-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="w-72 rounded-xl bg-gray-100 p-4 animate-pulse"
          >
            <div className="h-6 w-2/3 rounded bg-gray-300" />
            <div className="mt-3 h-4 w-full rounded bg-gray-300" />
            <div className="mt-2 h-4 w-5/6 rounded bg-gray-300" />
          </div>
        ))}
      </div>
    </div>
  );
}

function MoodSelector() {
  const { watchList } = useContext(MovieContext);
  const [selectedMood, setSelectedMood] = useState(MOODS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const watchlistSizeLabel = useMemo(() => {
    const count = Array.isArray(watchList) ? watchList.length : 0;
    return `${count} in your watchlist`;
  }, [watchList]);

  async function handleGetRecommendations() {
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const json = await recommendMovies({
        mood: selectedMood,
        watchlist: Array.isArray(watchList) ? watchList : [],
      });
      setResult(json);
    } catch {
      setError("Could not generate recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[60vh]">
      <div className="px-8 py-8">
        <h1 className="text-4xl font-bold text-green-600">Mood Selector</h1>
        <p className="text-gray-600 mt-2">{watchlistSizeLabel}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          {MOODS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setSelectedMood(m)}
              className={`px-4 py-2 rounded-xl border transition-colors ${
                selectedMood === m
                  ? "bg-green-600 text-white border-green-700"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleGetRecommendations}
          disabled={loading}
          className="mt-6 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:opacity-90 disabled:opacity-60"
        >
          Get 6 recommendations
        </button>

        {error ? (
          <div className="mt-4 text-red-600 font-semibold">{error}</div>
        ) : null}
      </div>

      {loading ? (
        <RecommendationSkeleton />
      ) : null}

      {!loading && result ? (
        <div className="m-8">
          <h2 className="text-2xl font-bold mb-4">
            Your {result.mood} picks
          </h2>

          <div className="space-y-3">
            {result.recommendations.map((rec) => (
              <div
                key={rec.tmdb_id ?? rec.title}
                className="rounded-xl border border-gray-200 p-4 bg-white"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-bold text-lg">{rec.title}</div>
                    <div className="text-gray-600 mt-1">{rec.reasoning}</div>
                    <div className="text-xs text-gray-500 mt-2">
                      Source:{" "}
                      <span className="font-semibold text-gray-700">
                        {rec.source}
                      </span>
                      {rec.tmdb_id ? ` • TMDB: ${rec.tmdb_id}` : ""}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default MoodSelector;