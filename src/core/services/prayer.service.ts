import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import { IResponse } from "core/models/Response";
import { IPrayer } from "core/models/Prayer";
import { IPrayerRequest } from "core/models/Prayer";
import { ITestimony, ICommentTestimony } from "core/models/Testimony";
import { Testimony } from "core/enums/Testimony";
import { IBibleBook, IBibleChapter, IBibleVerses } from "core/models/Bible";

const baseUrl = `${process.env.REACT_APP_SERVER_URL}/Prayer`;
const config: AxiosRequestConfig = {
  headers: { "Content-Type": "application/json-patch+json" },
};

export const getPrayer = async (
  denominationId: number,
  cancelToken: CancelTokenSource
): Promise<IResponse<IPrayer[]>> => {
  try {
    const url = `${baseUrl}/GetPrayer/${denominationId}`;
    const response = await axios.get(url, {
      cancelToken: cancelToken.token,
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};
export const getDailyReading = async (
  cancelToken: CancelTokenSource
): Promise<IResponse<any>> => {
  const currentDate = new Date().toLocaleDateString().split("/");
  const padString = (str: string) => {
    return str.length >= 2 ? str : `0${str}`;
  };

  const formatDate = `${currentDate[2]}-${padString(
    currentDate[0]
  )}-${padString(currentDate[1])}`;

  try {
    const url = `${baseUrl}/GetDailyReading?date=${formatDate}`;
    const response = await axios.get(url, {
      cancelToken: cancelToken.token,
    });
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
  churchId: number,
  cancelToken: CancelTokenSource
): Promise<IResponse<IPrayerRequest[]>> => {
  const url = `${baseUrl}/GetPrayerRequest/${churchId}`;
  try {
    const response = await axios.get(url, {
      cancelToken: cancelToken.token,
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};
export const prayerForPrayerRequest = async (
  prayerRequestId: number,
  personId: string
): Promise<IResponse<null>> => {
  const url = `${baseUrl}/PrayPrayerRequest/${prayerRequestId}`;
  try {
    const response = await axios.post(url);
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
    const response = await axios.post(url, addTestmony, config);
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
  arg: IGetTestimony,
  cancelToken: CancelTokenSource
): Promise<IResponse<ITestimony[]>> => {
  const url = `${baseUrl}/GetTestimony/${arg.testimonyType}`;
  try {
    const response = await axios.get(url, {
      cancelToken: cancelToken.token,
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const CommentOnTestimony = async (
  arg: ICommentTestimony
): Promise<IResponse<ITestimony>> => {
  const url = `${baseUrl}/CommentOnTestimony/${arg.testimonyId}`;
  try {
    const response = await axios.post(url);
    return response.data;
  } catch (err) {
    throw err;
  }
};

// Bible API
export const GetBibleByVersion = async (
  version: string,
  cancelToken:CancelTokenSource
): Promise<IResponse<IBibleBook[]>> => {
  const url = `${baseUrl}/GetBibleVerseBook?version=${version}`
  try{
    const response = await axios.get(url,{
      cancelToken:cancelToken.token
    })
    return response.data
  }catch(err){
    throw err
  }
};

export const GetBibleBookChapters = async (
  bookid:number,
  version:string,
  cancelToken:CancelTokenSource
): Promise<IResponse<IBibleChapter[]>> => {
  const url = `${baseUrl}/GetBibleVerseChapterByBook?bookid=${bookid}&version=${version}`
  try{
    const response = await axios.get(url,{
      cancelToken:cancelToken.token
    })
    return response.data
  }catch(err){
    throw err
  }
}

export const GetBibleVerses = async (
  bookid:number,
  chapter:number,
  version:string,
  cancelToken:CancelTokenSource
):Promise<IResponse<IBibleVerses>> => {
  const url = `${baseUrl}/GetBibleVerses?bookid=${bookid}&chapter=${chapter}&version=${version}`
  try{
    const respone = await axios.get(url,{
      cancelToken:cancelToken.token
    })
    return respone.data
  }catch(err){
    throw err
  }
}