export enum UserAuthRole {
    USER = 'user',
    ADMIN = 'admin',
    SUPER_ADMIN = 'super_admin',
    MODERATOR = 'moderator'
}

export enum UserAuthSectionType {
    MATRIMONIAL = 'matrimonial',
    SOCIAL = 'social'
}

export interface UserAuth {
    id: string;
    email: string;
    mobile: string;
    password: string;
    role: UserAuthRole;
    isEmailVerified: boolean;
    isMobileVerified: boolean;
    sectionType: UserAuthSectionType;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date | null;
    isActive: boolean;
    isSuspended: boolean;
}

export interface UserResponse {
    id: string;
    email: string;
    mobile: string;
    role: UserAuthRole;
    isEmailVerified: boolean;
    isMobileVerified: boolean;
    sectionType: UserAuthSectionType;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date | null;
    isActive: boolean;
    isSuspended: boolean;
}

export interface UserAuthResponse {
    user: UserResponse;
    accessToken: string;
    refreshToken: string;
    sessionId: string;
}

export interface SocialProfile {
    id: number;
    userId: string;
    firstName: string;
    lastName: string;
    userName: string;
    age: number;
    gender: string;
    orientation: string;
    lookingFor: string;
    ethnicity: string;
    religion: string | null;
    countryId: number;
    stateId: number | null;
    cityId: number | null;
    isProfileActive: boolean;
    isProfileComplete: boolean;
    profileVisibility: string;
    showOnlyInMyArea: boolean;
    bio: string | null;
    interests: string | null;
    lastActiveAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface MatrimonialProfile {
    id: number;
    userId: string;
    lookingFor: string;
    firstName: string;
    lastName: string;
    userName: string;
    age: number;
    gender: string;
    orientation: string;
    ethnicity: string;
    religion: string;
    casteId: number | null;
    customCaste: string | null;
    countryId: number;
    stateId: number | null;
    cityId: number | null;
    isProfileActive: boolean;
    isProfileComplete: boolean;
    profileVisibility: string;
    lastActiveAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export type UserAuthWithProfiles = Omit<UserAuth, 'socialProfile' | 'matrimonialProfile'> & {
    socialProfile?: SocialProfile | null;
    matrimonialProfile?: MatrimonialProfile | null;
}

export interface CreateUserAuth {
    email: string;
    mobile: string;
    password: string;
    sectionType: 'matrimonial' | 'social';
    role?: 'user' | 'admin';
}

export interface UpdateUserAuth {
    email?: string;
    mobile?: string;
    password?: string;
    role?: 'user' | 'admin';
    isEmailVerified?: boolean;
    isMobileVerified?: boolean;
    sectionType?: 'matrimonial' | 'social';
    lastLoginAt?: Date;
    isActive?: boolean;
    isSuspended?: boolean;
}  

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface OTPVerification {
    email: string;
    otp: string;
}

export interface MobileVerification {
    mobile: string;
    confirmedMobile: string;
}