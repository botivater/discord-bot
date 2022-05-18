export interface IService<T> {
    findAll(): Promise<T[]>;
    findOne(where: any): Promise<T>;
    create(data: any): Promise<T>;
    update(where: any, data: any): Promise<T>;
    delete(data: any): Promise<void>;
}