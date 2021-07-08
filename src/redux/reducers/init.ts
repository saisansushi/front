const initialState = {};
export default function init(
  state = initialState,
  payload: { type: string; content: object }
) {
  switch (payload.type) {
    case "setInitVendors":
      return { ...state, vendors: payload.content };
    case "setInitProducts":
      return { ...state, products: payload.content };

    default:
      return state;
  }
}
