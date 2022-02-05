import axios from "axios";
import MockAdapter from 'axios-mock-adapter'
import {initFunction} from './mock/mockService'

const setupMock = () => {
    const mock = new MockAdapter(axios)
    
    initFunction(mock)
}

// Comment out to remove mock data
setupMock();

export default axios