const initialState = {
  terminalId: 1, // айди терминала
  openOrderId: null, // текущий открытый заказ в терминале
  networkError: false,
  initCompleted: false,
};

export default function appState(
  state = initialState,
  payload: {
    type: string;
    openOrderId: number;
    terminalId: number;
    initCompleted: boolean;
    networkError: boolean;
    preloader: boolean;
  }
) {
  switch (payload.type) {
    case "currentOrder":
      return { ...state, openOrderId: payload.openOrderId };
    case "setTerminal":
      return { ...state, terminalId: payload.terminalId };

    case "initCompleted":
      return { ...state, initCompleted: payload.initCompleted };

    case "setNetworkError":
      return { ...state, networkError: payload.networkError };
    case "setPreloader":
      return { ...state, preloader: payload.preloader };

    default:
      return state;
  }
}
