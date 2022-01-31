export declare function deployAlexandria(): Promise<import("../typechain").Alexandria>;
export declare function deployTagStore(): Promise<import("../typechain").TagStore>;
export declare function deployTagLogic(tagStoreAddr: string): Promise<import("../typechain").TagLogic>;
export declare function impersonateAccount(address: string): Promise<void>;
