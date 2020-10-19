export class AdditionalAcctPayload {
    accountName:string;
    existingAccount: string;
    existingAccountType: string;
    phoneNumber: string;
    newAccountType: string;
    extraAccountClass: string;
    currency: string;
    authType: string;
    documents: UploadedDocument[];
    otpIdentifier: string;
    otpSourceReference:string;
    otp: string;
    otpReasonCode: string;
}

export class UploadedDocument {
    title: string;
    name: string;
    base64Content: string;
    documentExt?:string;
}
