import MockAdapter from "axios-mock-adapter/types";
import {accountMock} from "./account.mock";
import {activityMock} from "./activity.mock";
import {churchMock} from "./church.mock";
import {livestreamMock} from "./livestream.mock";
import {prayerMock} from "./prayer.mock";
import {sermonMock} from "./sermon.mock";
import {userMock} from "./user.mock";
import {utilityMock} from './utility.mock'

export const initFunction = (mock:MockAdapter) => {
    utilityMock(mock);
    churchMock(mock);
    accountMock(mock);
    userMock(mock);
    prayerMock(mock);
    sermonMock(mock);
    activityMock(mock);
    livestreamMock(mock);
}
