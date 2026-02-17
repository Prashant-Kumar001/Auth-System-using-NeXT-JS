export type EmailTemplate =
    | "WELCOME"
    | "OTP"
    | "CONTACT"
    | "CUSTOM"
    | "PASSWORD_RESET"
    | "VERIFICATION"
    | "DELETE_ACCOUNT"
    | "ALERT"
    | "ORGANIZATION_INVITATION"
    | "THANK_YOU"
    ;

export type SendEmailOptions = {
    from: string;
    to: string;
    subject: string;
    html?: string;


    template: EmailTemplate;
    data: Record<string, string | number | boolean>;


};
