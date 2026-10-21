/**
 * IndexNow — tells Bing (and Yandex, Seznam, Naver) that a URL changed instead
 * of waiting to be crawled. Bing's index is what ChatGPT search and Copilot
 * read, so a page Bing has not re-crawled is invisible to them. Google does not
 * participate.
 *
 * The key is deliberately public: IndexNow verifies it by fetching
 * https://athomefamilyservices.com/<key>.txt (public/e57936b99575e85d46d67f06cd085033.txt). It proves
 * control of the domain and nothing more. If it changes, rename that file too.
 *
 * Ping after a production deploy: `npm run indexnow` (scripts/indexnow.mjs).
 */
export const INDEXNOW_KEY = 'e57936b99575e85d46d67f06cd085033';
