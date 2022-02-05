export interface ICommentTestimony {
    testimonyId: number;
    comment:string; 
    // {
    //   status: "Approved" | "Pending" | "Discard" | string;
    //   reason?: string;
    // };
    personId: string;
  }
  

export interface ITestimony {
  testimonyID?:number;
  testimonyTitle:string;
  testimonyDetail:string
  personID:string;
  churchID:number;
  dateEntered:Date;
  timeLapsed?:string;
}