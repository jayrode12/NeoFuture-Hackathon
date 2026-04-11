/**
 * chatService.js — API client for the IWTS voice/chat assistant endpoints.
 *
 * All functions return parsed JSON or throw on non-2xx responses.
 */

const API_URL = 'http://localhost:8000/api';

/**
 * POST /api/chat
 *
 * @param {Object} payload
 * @param {string}  payload.message       - User's typed or transcribed text
 * @param {string}  payload.mode          - "scheme_discovery" | "profile_score" | "guidance"
 * @param {string}  payload.language      - "en" | "hi" | "mr"
 * @param {Object|null} payload.user_profile - Worker feature fields (can be null for guidance)
 *
 * @returns {Promise<Object>} Full ChatResponse JSON
 */
export async function sendChatMessage({ message, mode, language, user_profile }) {
  const body = {
    message,
    mode,
    language,
    user_profile: user_profile ?? null,
  };

  const res = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `Chat request failed (${res.status})`);
  }

  return res.json();
}

/**
 * POST /api/predict
 * Raw prediction without the chat wrapper.
 *
 * @param {Object} user_profile - Full worker profile fields
 * @returns {Promise<{ iwts_score: number, eligible_schemes: Array }>}
 */
export async function predictScore(user_profile) {
  const res = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_profile }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `Predict request failed (${res.status})`);
  }

  return res.json();
}

/**
 * POST /api/explain
 * SHAP explanation for a worker profile.
 *
 * @param {Object} user_profile
 * @returns {Promise<{ shap_values: Object, base_value: number, top_features: Array }>}
 */
export async function explainScore(user_profile) {
  const res = await fetch(`${API_URL}/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_profile }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `Explain request failed (${res.status})`);
  }

  return res.json();
}

/**
 * POST /api/match-schemes
 * Match schemes for a known IWTS score without calling the ML model.
 *
 * @param {number} iwts_score
 * @returns {Promise<{ iwts_score: number, eligible_schemes: Array }>}
 */
export async function matchSchemes(iwts_score) {
  const res = await fetch(`${API_URL}/match-schemes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ iwts_score }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `Match schemes request failed (${res.status})`);
  }

  return res.json();
}
