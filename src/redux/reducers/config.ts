const initialState = {
  theme: "desktop",
  apiURL: "http://api.test/",
  token: "Basic usertokensecret",
  tokenDaData: "7acc767bfb1f8280c0f8a3f7bc67d589d7027ed8",
  YMapsApikey: "e9fcb0ac-fe84-4975-8325-a2cea341a5ff",
};

export default function config(state = initialState, payload: string) {
  return state;
}