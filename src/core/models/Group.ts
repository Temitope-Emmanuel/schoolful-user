export interface IPosition {
    positionID:number;
    position:string;
    description:string;
}

export interface IGroup {
    groupID: number;
    name: string;
    description: string;
    imageUrl?: string;
    churchID: number;
    groupMember?:IGroupMember[];
}
export interface IGroupMember {
    groupMemberID:string;
    personID:string;
    churchID:number;
    groupID:number;
    positionName:string;
    pictureUrl?:string;
    fullName:string;
}
export interface ICreateGroupMember {
    societies:number[];
    societyPosition:number[];
    churchId:number;
    personId:string
}