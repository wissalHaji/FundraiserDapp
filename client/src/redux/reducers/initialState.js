//redux store shape

import { fundraisersStatus } from "../../constants";

const initialState = {
  fundraisers: {
    data: [],
    page: 0,
    status: fundraisersStatus.IDLE,
    addressList: [], // array of objects with shape {name : "", address : ""}
  },
};

export default initialState;
