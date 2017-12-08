import { apiGET } from "../common/api";
import { addTransferTask } from "./actions";
import { Observable } from 'rxjs/Rx';

import { ADD_TRANSFER_TASK } from "./actions/actionTypes";

export const addTransferTaskEpic = action$ => (
    action$.ofType(ADD_TRANSFER_TASK)
        .delay(1000)
        .mapTo({ type: 'xxx epic' })
);



// const API_BASE_URL = 'http://localhost:8080';

// fetchUsersEpic = action$ => (
//     action$.ofType(ADD_TRANSFER_TASK)
//         .switchMap(
//             apiGET(`${API_BASE_URL}/users.json`)
//                 .map(res => fetchUsersSuccess(res))
//                 .catch(err => {
//                     console.log("fetchUsersEpic -> api.get catch", err);
//                     return Observable.of(fetchUsersError(`fetchUsersEpic err: ${err}`)
//                 })
//         )
// );