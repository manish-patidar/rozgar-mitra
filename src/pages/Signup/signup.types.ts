export interface SignupFormState {
    name: string;
    username: string;
    email: string;
    age: string;
    phone: string;
    password: string;
    role: string;
}

export type SignupFormErrors = Partial<Record<keyof SignupFormState, string>>;
