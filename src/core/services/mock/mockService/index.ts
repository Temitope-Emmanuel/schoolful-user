import MockAdapter from "axios-mock-adapter/types";
import {accountMock} from "./account.mock";
import {churchMock} from "./church.mock";
import {userMock} from "./user.mock";
import {utilityMock} from './utility.mock'

export const initFunction = (mock:MockAdapter) => {
    utilityMock(mock);
    churchMock(mock);
    accountMock(mock);
    userMock(mock);
}
