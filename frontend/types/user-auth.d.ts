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