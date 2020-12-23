import axios, { AxiosRequestConfig } from "axios";
import { IResponse } from "core/models/Response";
import { IPrayer } from "core/models/Prayer";
import { IPrayerRequest } from "core/models/PrayerRequest";
import { ITestimony } from "core/models/Testimony";
import { Testimony } from "core/enums/Testimony";

const baseUrl = `${process.env.REACT_APP_SERVER_URL}/Prayer`;

export const getPrayer = async (
  denominationId: number
): Promise<IResponse<IPrayer[]>> => {
  try {
    const url = `${baseUrl}/GetPrayer?denomination=${denominationId}`;
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    throw err;
  }
};
export const getDailyReading = async (): Promise<IResponse<any>> => {
  const currentDate = new Date().toLocaleDateString().split("/");
  const padString = (str: string) => {
    return str.length >= 2 ? str : `0${str}`;
  };

  const formatDate = `${currentDate[2]}-${padString(
    currentDate[0]
  )}-${padString(currentDate[1])}`;

  try {
    const url = `${baseUrl}/GetDailyReading?date=${formatDate}`;
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    throw err;
  }
};
export const getPreviousDailyReading = async (
  dateString: Date
): Promise<IResponse<IPrayer[]>> => {
  try {
    const url = `${baseUrl}/GetPreviousDailyReading`;
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    throw err;
  }
};
export const getPrayerRequest = async (
  churchId: number
): Promise<IResponse<IPrayerRequest[]>> => {
  const url = `${baseUrl}/GetPrayerRequest?churchId=${churchId}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    throw err;
  }
};
export const prayerForPrayerRequest = async (
  prayerRequestId: number,
  personId: string
): Promise<IResponse<null>> => {
  const url = `${baseUrl}/prayerRequetId=${prayerRequestId}&personId=${personId}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    throw err;
  }
};
export const addPrayerRequest = async (
  newPrayerRequest: IPrayerRequest
): Promise<IResponse<IPrayerRequest>> => {
  const url = `${baseUrl}/AddPrayerRequest`;
  try {
    const response = await axios.post(url, newPrayerRequest);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const updatePrayerRequest = async (
  updatePrayerRequest: IPrayerRequest
): Promise<IResponse<IPrayerRequest>> => {
  const url = `${baseUrl}/UpdatPrayerRequest`;
  try {
    const response = await axios.put(url, updatePrayerRequest);
    return response.data;
  } catch (err) {
    throw err;
  }
};
export const deletePrayerReqeuest = async (
  deletePrayerReqeuestId: number
): Promise<IResponse<null>> => {
  const url = `${baseUrl}/DeletePrayerRequest?prayerrequestId=${deletePrayerReqeuestId}`;
  try {
    const response = await axios.delete(url);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const addTestimony = async (
  addTestmony: ITestimony
): Promise<IResponse<ITestimony>> => {
  const url = `${baseUrl}/AddTestimony`;
  try {
    const response = await axios.post(url);
    return response.data;
  } catch (err) {
    throw err;
  }
};
export const updateTestimony = async (
  updateTestimony: ITestimony
): Promise<IResponse<ITestimony>> => {
  const url = `${baseUrl}/UpdateTestimony`;
  try {
    const response = await axios.put(url);
    return response.data;
  } catch (err) {
    throw err;
  }
};
export const deleteTestimony = async (
  deleteTestimonyId: number
): Promise<IResponse<null>> => {
  const url = `${baseUrl}/DeletTesimony?testimonyId=${deleteTestimonyId}`;
  try {
    const response = await axios.delete(url);
    return response.data;
  } catch (err) {
    throw err;
  }
};
interface IGetTestimony {
  churchId: number;
  testimonyType: Testimony;
}
export const getTestimony = async (
  arg: IGetTestimony
): Promise<IResponse<ITestimony[]>> => {
  const url = `${baseUrl}/GetTestimony?churchId=${arg.churchId}&testimonyType=${arg.testimonyType}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    throw err;
  }
};

interface ICommentTestimony {
  testimonyId: number;
  comment: {
    status: "Approved" | "Pending" | "Discard";
    reason?: string;
  };
  personId: string;
}

export const CommentOnTestimony = async (
  arg: ICommentTestimony
): Promise<IResponse<null>> => {
  const url = `${baseUrl}/CommentOnTestimony?testimonyId=${
    arg.testimonyId
  }&comment=${JSON.stringify(arg.comment)}&personId=${arg.personId}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    throw err;
  }
};
