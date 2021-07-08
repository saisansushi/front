const initialState = {
  orderData: {},
};

export default function order(
  state = initialState,
  payload: { type: string; content: object }
) {
  switch (payload.type) {
    case "orderSetContent":
      return {
        ...state,
        orderData: Object.assign({}, state.orderData, payload.content),
      };

    case "resetOrder":
      return {
        ...state,
        orderData: {},
      };

    default:
      return state;
  }
}


