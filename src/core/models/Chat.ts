export interface SendMessageToUser { 
    id:number;
    receiverId:string;
    text:string;
    when:Date;
}

export interface SendMessageToGroup {
    id:number;
    groupId:number;
    groupName:string;
    text:string;
    when:Date
}