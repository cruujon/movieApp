// app/tmdb-test/page.js
import { fetchPopularMovies } from "@/lib/tmdb";

export const metadata = { title: "人気映画タイトル一覧" };

export default async function TmdbTestPage() {
  const movies = await fetchPopularMovies();

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">人気映画タイトル一覧</h1>
      <ul className="list-disc pl-5 space-y-1">
        {movies.map((m) => (
          <li key={m.id}>{m.title}</li>
        ))}
      </ul>
    </main>
  );
}