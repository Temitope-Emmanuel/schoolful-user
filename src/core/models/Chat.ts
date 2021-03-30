
export interface GroupMessage {
    id?:number;
    groupId:number;
    personId:string;
    groupName:string;
    text:string;
    when:Date | string;
    ownerIsCurrentUser?:boolean;
    senderImageUrl:string;
}

export interface GetGroupChat {
    groupName:string;
    page:number;
    take:number;
}

export interface GetGroupChatResponse {
    currentPage:number;
    pageSize:number;
    totalPages:number;
    totalRecords:number;
    records?:GroupMessage[]
}