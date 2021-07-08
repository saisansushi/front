const initialState = {
  pageName: "main",
  menuMode: false,
  addressMode: "none",
};
export default function navigation(
  state = initialState,
  action: {
    type: string;
    pageName: string;
    menuMode: boolean;
    addressMode: string;
  }
) {
  switch (action.type) {
    case "setPage":
      return { ...state, pageName: action.pageName };

    case "setMenuMode":
      return { ...state, menuMode: action.menuMode };

    case "setAddressMode":
      return { ...state, addressMode: action.addressMode };
    default:
      return state;
  }
}
