// lib/tmdb.js
const BASE_URL = process.env.TMDB_BASE_URL;
const API_KEY  = process.env.TMDB_API_KEY;

/** 人気映画を取得して配列を返す（サーバー専用） */
export async function fetchPopularMovies(lang = "ja-JP", page = 1) {
  const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=${lang}&page=${page}`;

  const res = await fetch(url);
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`TMDB 取得失敗 (${res.status}): ${detail}`);
  }

  const { results } = await res.json();
  return results;
}