import { Doc } from "./doc";
export declare const DbService: {
    init: (path: string, interval: number) => Promise<void>;
    close: () => Promise<void>;
    save: (entity: Doc<unknown>) => Promise<Doc<unknown> | null>;
    saveAll: (entities: Doc<unknown>[]) => Promise<Doc<unknown>[]>;
    get: (id: unknown) => Promise<Doc<unknown> | null | undefined>;
    getAll: () => Promise<Doc<unknown>[]>;
    remove: (deleteIds: unknown | unknown[]) => Promise<void>;
};
//# sourceMappingURL=dbservice.d.ts.map