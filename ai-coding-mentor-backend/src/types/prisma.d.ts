declare module "@prisma/client" {
  export class PrismaClient {
    constructor(options?: any);
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    user: any;
    userProfile: any;
    refreshToken: any;
    session: any;
    conversation: any;
    message: any;
    challenge: any;
    challengeAttempt: any;
    document: any;
    notification: any;
    activityLog: any;
    learningProgress: any;
    learningModule: any;
    lesson: any;
    recommendation: any;
  }
}
