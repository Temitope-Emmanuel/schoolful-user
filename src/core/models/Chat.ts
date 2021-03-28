// export interface SendMessageToUser { 
//     id:number;
//     receiverId:string;
//     text:string;
//     when:Date;
// }

export interface GroupMessage {
    id?:number;
    groupId:number;
    personId:string;
    groupName:string;
    text:string;
    when:Date | string;
    ownerIsCurrentUser?:boolean;
}

export interface GetGroupChat {
    groupName:string;
    page:number;
    take:number;
    count:number;
}
