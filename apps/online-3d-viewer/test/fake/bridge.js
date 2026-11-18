// Stand-in for @forge/bridge in tests: records calls and serves a fixed page with attachments.
export const calls = { submitted: null, requests: [] };
export const state = { config: {}, attachments: [] };
export const view = {
  getContext: async () => ({ extension: { config: state.config, content: { id: '123' } } }),
  submit: async (payload) => { calls.submitted = payload; },
};
export async function requestConfluence(path) {
  calls.requests.push(path);
  return { ok: true, status: 200, json: async () => ({ results: state.attachments, _links: {} }), blob: async () => new Blob(['x']) };
}
