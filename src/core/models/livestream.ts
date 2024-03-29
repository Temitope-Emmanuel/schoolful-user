interface StreamChurch {
    liveStreamID: string;
    frameRate: "60fps" | "80fps";
    ingestionType: "rtmp";
    resolution: "480p" | "1080p";
    isReusable: boolean;
    title: string;
    description: string;
    churchId: string;
    ingestionAddress: string;
    rtmpingestionAddress: string;
    ingestionBackupAddress: string;
    streamName: string;
  };

export interface LiveStreamChurchResponse {
    liveBroadcastID: string;
    liveStreamID: string;
    title: string;
    description: string;
    url: null | string;
    liveChatID: string;
    channelID: null | string;
    publishedOn: Date | string;
    scheduledStartTime: Date | string;
    scheduledEndTime: Date | string;
    privacyStatus: string;
    status: "Upcoming" | "IsLive" | "Complete" | "NotCompleted" | "Testing";
    churchID: number;
    eventID:number;
  }
  
  export type StatusType = "upComing" | "isLive" | "completed"
