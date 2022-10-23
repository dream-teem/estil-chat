export interface Verification {
  id: string;
  countryCode: string;
  isVerified: boolean;
  phone: string;
  smsCode: string;
  expiration: Date;
}

export interface SendVerificationRO {
  verificationId: string;
  isVerified: boolean;
}
